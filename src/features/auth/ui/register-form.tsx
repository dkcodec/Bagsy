"use client";

import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Form } from "@/entities/form";
import { Button } from "@/entities/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/entities/card";
import { Stepper } from "@/entities/stepper";
import { RegisterStepBusiness } from "./register-step-business";
import { RegisterStepOne } from "./register-step-one";
import { RegisterStepTwo } from "./register-step-two";
import {
  useManagementRegister,
  useManagementConfirm,
} from "@/shared/hooks/use-management-register";
import type { ManagementRole } from "@/shared/api/types";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

const MAX_ATTEMPTS = 3;

export function RegisterForm() {
  const t = useTranslations("RegisterForm");
  const [currentStep, setCurrentStep] = useState(0);
  const [registeredPhone, setRegisteredPhone] = useState<string>("");
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);

  const registerMutation = useManagementRegister();
  const confirmMutation = useManagementConfirm();

  const roles = useMemo(() => {
    const raw = t.raw("roles");
    if (Array.isArray(raw)) {
      return raw.filter(
        (item): item is { value: ManagementRole; label: string } => {
          return (
            typeof item === "object" &&
            item !== null &&
            typeof (item as { value: string }).value === "string" &&
            typeof (item as { label: string }).label === "string"
          );
        }
      );
    }
    return [] as Array<{ value: ManagementRole; label: string }>;
  }, [t]);

  // Схема для шага 0: информация о бизнесе
  const stepBusinessSchema = useMemo(
    () =>
      z.object({
        network_info: z.object({
          name: z
            .string()
            .trim()
            .min(1, { message: t("errors.networkNameRequired") }),
          description: z
            .string()
            .trim()
            .min(1, { message: t("errors.networkDescriptionRequired") }),
        }),
        name: z.string().optional(),
        surname: z.string().optional(),
        phone: z.string().optional(),
        password: z.string().optional(),
        role: z.enum(["net_manager", "self_owner"]).optional(),
        code: z.string().optional(),
      }),
    [t]
  );

  // Схема для шага 1: информация о пользователе
  const stepOneSchema = useMemo(
    () =>
      z.object({
        name: z
          .string()
          .trim()
          .min(1, { message: t("errors.nameRequired") }),
        surname: z
          .string()
          .trim()
          .min(1, { message: t("errors.surnameRequired") }),
        phone: z
          .string()
          .trim()
          .min(1, { message: t("errors.phoneRequired") })
          .regex(/^\+?[0-9\s().-]{7,}$/, {
            message: t("errors.phoneInvalid"),
          }),
        password: z.string().min(6, { message: t("errors.passwordMin") }),
        role: z
          .enum(["net_manager", "self_owner"])
          .refine(val => val !== undefined, {
            message: t("errors.roleRequired"),
          }),
        network_info: z
          .object({
            name: z.string().optional(),
            description: z.string().optional(),
          })
          .optional(),
        code: z.string().optional(),
      }),
    [t]
  );

  // Схема для шага 2: подтверждение кода
  const stepTwoSchema = useMemo(
    () =>
      z.object({
        name: z.string().optional(),
        surname: z.string().optional(),
        phone: z.string().optional(),
        password: z.string().optional(),
        role: z.enum(["net_manager", "self_owner"]).optional(),
        network_info: z
          .object({
            name: z.string().optional(),
            description: z.string().optional(),
          })
          .optional(),
        code: z
          .string()
          .length(4, { message: t("errors.codeLength") })
          .regex(/^\d{4}$/, { message: t("errors.codeInvalid") }),
      }),
    [t]
  );

  // Создаем единую схему с условной валидацией в зависимости от шага
  const unifiedSchema = useMemo(() => {
    return z
      .object({
        network_info: z.object({
          name: z.string().trim(),
          description: z.string().trim(),
        }),
        name: z.string().trim(),
        surname: z.string().trim(),
        phone: z.string().trim(),
        password: z.string(),
        confirmPassword: z.string(),
        role: z.enum(["net_manager", "self_owner"]).optional(),
        code: z.string(),
      })
      .superRefine((data, ctx) => {
        // Валидация для шага 0: информация о бизнесе
        if (currentStep === 0) {
          if (
            !data.network_info.name ||
            data.network_info.name.trim().length === 0
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.networkNameRequired"),
              path: ["network_info", "name"],
            });
          }
          if (
            !data.network_info.description ||
            data.network_info.description.trim().length === 0
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.networkDescriptionRequired"),
              path: ["network_info", "description"],
            });
          }
        }

        // Валидация для шага 1: информация о пользователе
        if (currentStep === 1) {
          if (!data.name || data.name.trim().length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.nameRequired"),
              path: ["name"],
            });
          }
          if (!data.surname || data.surname.trim().length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.surnameRequired"),
              path: ["surname"],
            });
          }
          if (!data.phone || data.phone.trim().length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.phoneRequired"),
              path: ["phone"],
            });
          } else if (!/^\+?[0-9\s().-]{7,}$/.test(data.phone)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.phoneInvalid"),
              path: ["phone"],
            });
          }
          if (!data.password || data.password.length < 6) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.passwordMin"),
              path: ["password"],
            });
          }
          if (!data.confirmPassword || data.confirmPassword.length < 1) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.confirmPasswordRequired"),
              path: ["confirmPassword"],
            });
          } else if (data.password !== data.confirmPassword) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.passwordsMustMatch"),
              path: ["confirmPassword"],
            });
          }
          if (!data.role) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.roleRequired"),
              path: ["role"],
            });
          }
        }

        // Валидация для шага 2: код подтверждения
        if (currentStep === 2) {
          if (!data.code || data.code.length !== 4) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.codeLength"),
              path: ["code"],
            });
          } else if (!/^\d{4}$/.test(data.code)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.codeInvalid"),
              path: ["code"],
            });
          }
        }
      });
  }, [currentStep, t]);

  const form = useForm({
    resolver: zodResolver(unifiedSchema),
    defaultValues: {
      name: "",
      surname: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: undefined as ManagementRole | undefined,
      network_info: {
        name: "",
        description: "",
      },
      code: "",
    },
    mode: "onBlur", // Изменено на onBlur чтобы не блокировать ввод
    reValidateMode: "onBlur", // Ревалидация только при потере фокуса
    shouldUnregister: false, // Сохраняем значения полей при размонтировании
    shouldFocusError: false, // Не фокусируемся на ошибках автоматически
  });

  // Очищаем ошибки при смене шага
  useEffect(() => {
    form.clearErrors();
  }, [currentStep, form]);

  const steps = useMemo(
    () => [
      {
        label: t("steps.step1.label"),
      },
      {
        label: t("steps.step2.label"),
      },
      {
        label: t("steps.step3.label"),
      },
    ],
    [t]
  );

  const handleStepBusinessSubmit = async (
    data: z.infer<typeof stepBusinessSchema>
  ) => {
    // Переходим на следующий шаг
    setCurrentStep(1);
  };

  const handleStepOneSubmit = async (data: z.infer<typeof stepOneSchema>) => {
    try {
      // Получаем данные о бизнесе из формы
      const formValues = form.getValues();
      const networkInfo = formValues.network_info;
      const validPhone = data.phone.replace(/\D/g, "");

      if (!networkInfo || !networkInfo.name || !networkInfo.description) {
        toast.error(t("errors.networkInfoRequired"));
        return;
      }

      await registerMutation.mutateAsync({
        name: data.name,
        surname: data.surname,
        phone: validPhone,
        password: data.password,
        role: data.role,
        network_info: {
          name: networkInfo.name,
          description: networkInfo.description,
        },
      });

      setRegisteredPhone(validPhone);
      setCurrentStep(2);
      toast.success(t("success.codeSent"));
    } catch (error) {
      // Ошибка уже обработана в хуке
    }
  };

  const handleStepTwoSubmit = async (data: z.infer<typeof stepTwoSchema>) => {
    if (attemptsLeft <= 0) {
      toast.error(t("errors.maxAttemptsReached"));
      return;
    }

    try {
      await confirmMutation.mutateAsync({
        phone: registeredPhone,
        code: data.code,
      });
      // Редирект происходит в хуке
    } catch (error) {
      // Уменьшаем количество попыток при ошибке
      setAttemptsLeft(prev => Math.max(0, prev - 1));

      // Если попытки закончились
      if (attemptsLeft <= 1) {
        toast.error(t("errors.maxAttemptsReached"));
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 0) return;
    setCurrentStep(currentStep - 1);
    if (currentStep === 2) {
      // При возврате с шага подтверждения очищаем код
      form.setValue("code", "");
      setAttemptsLeft(MAX_ATTEMPTS);
    }
  };

  const isLoading = registerMutation.isPending || confirmMutation.isPending;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Stepper steps={steps} currentStep={currentStep} />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              currentStep === 0
                ? data =>
                    handleStepBusinessSubmit(
                      data as z.infer<typeof stepBusinessSchema>
                    )
                : currentStep === 1
                  ? data =>
                      handleStepOneSubmit(data as z.infer<typeof stepOneSchema>)
                  : data =>
                      handleStepTwoSubmit(data as z.infer<typeof stepTwoSchema>)
            )}
            className="space-y-6"
          >
            {currentStep === 0 ? (
              <RegisterStepBusiness />
            ) : currentStep === 1 ? (
              <RegisterStepOne roles={roles} />
            ) : (
              <RegisterStepTwo
                phone={registeredPhone}
                attemptsLeft={attemptsLeft}
              />
            )}

            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0 || isLoading}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="size-4" />
                {t("buttons.back")}
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t("buttons.submitting")}
                  </>
                ) : (
                  <>
                    {currentStep === 2 ? (
                      t("buttons.confirm")
                    ) : (
                      <>
                        {t("buttons.continue")}
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
