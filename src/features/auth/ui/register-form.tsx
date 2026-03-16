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
import { RegisterStepOne } from "./register-step-one";
import { RegisterStepTwo } from "./register-step-two";
import {
  useRegister,
  useRegisterResend,
  useRegisterVerify,
} from "@/shared/hooks/use-register";
import type { PlanCode } from "@/shared/api/types";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface RegisterFormProps {
  defaultPlan?: string;
}

export function RegisterForm({ defaultPlan }: RegisterFormProps) {
  const t = useTranslations("RegisterForm");
  const [currentStep, setCurrentStep] = useState(0);
  const [registeredPhone, setRegisteredPhone] = useState<string>("");
  const [retryAfter, setRetryAfter] = useState(0);

  const registerMutation = useRegister();
  const resendMutation = useRegisterResend();
  const verifyMutation = useRegisterVerify();

  const validPlan = (
    ["solo", "point", "network"].includes(defaultPlan || "")
      ? defaultPlan
      : "solo"
  ) as PlanCode;

  const unifiedSchema = useMemo(() => {
    return z
      .object({
        first_name: z.string().trim(),
        last_name: z.string().trim(),
        phone: z.string().trim(),
        password: z.string(),
        confirmPassword: z.string(),
        plan_code: z.enum(["solo", "point", "network"]),
        code: z.string(),
      })
      .superRefine((data, ctx) => {
        if (currentStep === 0) {
          if (!data.first_name || data.first_name.trim().length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.nameRequired"),
              path: ["first_name"],
            });
          }
          if (!data.last_name || data.last_name.trim().length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.surnameRequired"),
              path: ["last_name"],
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
          if (!data.plan_code) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.planRequired"),
              path: ["plan_code"],
            });
          }
        }

        if (currentStep === 1) {
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
      first_name: "",
      last_name: "",
      phone: "",
      password: "",
      confirmPassword: "",
      plan_code: validPlan,
      code: "",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
    shouldUnregister: false,
    shouldFocusError: false,
  });

  useEffect(() => {
    form.clearErrors();
  }, [currentStep, form]);

  const steps = useMemo(
    () => [
      { label: t("steps.step1.label") },
      { label: t("steps.step2.label") },
    ],
    [t]
  );

  const handleStepOneSubmit = async () => {
    const data = form.getValues();
    try {
      const validPhone = data.phone.replace(/\D/g, "");

      const response = await registerMutation.mutateAsync({
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
        phone: validPhone,
        plan_code: data.plan_code,
      });

      setRegisteredPhone(validPhone);
      setRetryAfter(response.retry_after);
      setCurrentStep(1);
      toast.success(t("success.codeSent"));
    } catch {
      // Ошибка обработана в хуке
    }
  };

  const handleStepTwoSubmit = async () => {
    const data = form.getValues();
    try {
      await verifyMutation.mutateAsync({
        phone: registeredPhone,
        code: data.code,
      });
    } catch {
      // Ошибка обработана в хуке
    }
  };

  const handleResend = async () => {
    try {
      const response = await resendMutation.mutateAsync({
        phone: registeredPhone,
      });
      setRetryAfter(response.retry_after);
    } catch {
      // Ошибка обработана в хуке
    }
  };

  const handleBack = () => {
    if (currentStep === 0) return;
    setCurrentStep(0);
    form.setValue("code", "");
  };

  const isLoading =
    registerMutation.isPending ||
    verifyMutation.isPending ||
    resendMutation.isPending;

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
              currentStep === 0 ? handleStepOneSubmit : handleStepTwoSubmit
            )}
            className="space-y-6"
          >
            {currentStep === 0 ? (
              <RegisterStepOne />
            ) : (
              <RegisterStepTwo
                phone={registeredPhone}
                retryAfter={retryAfter}
                onResend={handleResend}
                isResending={resendMutation.isPending}
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
                    {currentStep === 1 ? (
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
