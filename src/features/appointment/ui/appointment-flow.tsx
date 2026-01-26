"use client";

/**
 * Главный компонент формы записи на прием
 * Управляет шагами, формой и интеграцией всех компонентов
 */

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useServices, useDaySlots } from "@/shared/hooks/use-bagsy";
import { Form } from "@/entities/form";
import { Stepper } from "@/entities/stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/entities/card";
import { Button } from "@/entities/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AppointmentStepService } from "./appointment-step-service";
import { AppointmentStepDateTime } from "./appointment-step-datetime";
import { AppointmentStepClient } from "./appointment-step-client";
import { AppointmentStepConfirm } from "./appointment-step-confirm";
import { AppointmentStepSuccess } from "./appointment-step-success";
import { AppointmentAside } from "./appointment-aside";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { toStartAtISO } from "@/shared/utils/datetime";
import { cn } from "@/src/shared/utils/styles";

interface AppointmentFlowProps {
  pointCode: string;
}

// Тип формы
type AppointmentFormData = {
  service_id?: string;
  date?: string;
  time?: string;
  master_phone?: string;
  name?: string;
  surname?: string;
  client_phone?: string;
  comment?: string;
  bagsy_id?: string;
  code?: string;
};

export function AppointmentFlow({ pointCode }: AppointmentFlowProps) {
  const t = useTranslations("AppointmentForm");
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState(0);

  // Схема валидации с условной валидацией по шагам
  const schema = useMemo(() => {
    return z
      .object({
        service_id: z.string().optional(),
        date: z.string().optional(),
        time: z.string().optional(),
        master_phone: z.string().optional(),
        name: z.string().optional(),
        surname: z.string().optional(),
        client_phone: z.string().optional(),
        bagsy_id: z.string().optional(),
        code: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        // Валидация для шага 0: выбор услуги
        if (currentStep === 0) {
          if (!data.service_id || data.service_id.trim().length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.serviceRequired"),
              path: ["service_id"],
            });
          }
        }

        // Валидация для шага 1: дата, время, мастер
        if (currentStep === 1) {
          if (!data.date || data.date.trim().length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.dateRequired"),
              path: ["date"],
            });
          }
          if (!data.time || data.time.trim().length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.timeRequired"),
              path: ["time"],
            });
          }
          if (!data.master_phone || data.master_phone.trim().length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.masterRequired"),
              path: ["master_phone"],
            });
          }
        }

        // Валидация для шага 2: данные клиента
        if (currentStep === 2) {
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
          if (!data.client_phone || data.client_phone.trim().length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.phoneRequired"),
              path: ["client_phone"],
            });
          } else if (!/^\+?[0-9\s().-]{7,}$/.test(data.client_phone)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.phoneInvalid"),
              path: ["client_phone"],
            });
          }
        }

        // Валидация для шага 3 (OTP): код
        if (currentStep === 3 && data.bagsy_id) {
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

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      service_id: undefined,
      date: undefined,
      time: undefined,
      master_phone: undefined,
      name: "",
      surname: "",
      client_phone: "",
      comment: "",
      bagsy_id: undefined,
      code: "",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
    shouldUnregister: false,
    shouldFocusError: false,
  });

  // Очищаем ошибки при смене шага
  useEffect(() => {
    form.clearErrors();
  }, [currentStep, form]);

  // Получаем данные для Aside
  const serviceId = form.watch("service_id");
  const selectedDate = form.watch("date");
  const selectedTime = form.watch("time");
  const selectedMasterPhone = form.watch("master_phone");
  const { data: services } = useServices(pointCode, true);
  const service = services?.find(s => s.id === serviceId);

  const { data: daySlotsData } = useDaySlots(
    selectedDate && serviceId && pointCode
      ? {
          date: toStartAtISO(selectedDate, "00:00"),
          service_id: serviceId,
          point_code: pointCode,
        }
      : null
  );

  // Шаги для степпера (без шага успеха)
  const steps = useMemo(
    () => [
      {
        label: t("steps.stepper.service"),
      },
      {
        label: t("steps.stepper.datetime"),
      },
      {
        label: t("steps.stepper.client"),
      },
      {
        label: t("steps.stepper.confirm"),
      },
    ],
    [t]
  );

  const handleNext = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    if (currentStep === 0) return;
    setCurrentStep(prev => Math.max(prev - 1, 0));
    if (currentStep === 3) {
      // При возврате с шага OTP очищаем код
      form.setValue("code", "");
    }
  };

  // Экран успеха показывается внутри appointment-step-otp после успешного подтверждения
  // Здесь не нужно проверять, так как логика уже в компоненте OTP

  return (
    <div className="space-y-2 md:space-y-4 lg:space-y-6">
      {/* Степпер - на мобилке только цифры */}
      <div className={isMobile ? "px-2" : ""}>
        <Stepper
          steps={steps.map(step => ({
            label: isMobile ? "" : step.label,
            description: undefined,
          }))}
          currentStep={currentStep}
        />
      </div>

      {/* Основной контент с Aside */}
      <div className="grid gap-3 md:gap-6 lg:grid-cols-[1fr_250px] xl:grid-cols-[1fr_400px]">
        {/* Основной блок с шагом */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 0 && t("steps.service.title")}
              {currentStep === 1 && t("steps.datetime.title")}
              {currentStep === 2 && t("steps.client.title")}
              {currentStep === 3 && t("steps.confirm.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-2 md:space-y-4 lg:space-y-6"
                onSubmit={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {currentStep === 0 && (
                  <AppointmentStepService pointCode={pointCode} />
                )}
                {currentStep === 1 && serviceId && (
                  <AppointmentStepDateTime
                    pointCode={pointCode}
                    serviceId={serviceId}
                  />
                )}
                {currentStep === 2 && <AppointmentStepClient />}
                {currentStep === 3 && (
                  <AppointmentStepConfirm
                    pointCode={pointCode}
                    service={service}
                    daySlotsData={daySlotsData}
                    handleBack={handleBack}
                  />
                )}

                {/* Навигация (кроме шага подтверждения, где кнопка внутри компонента) */}
                {currentStep !== 3 && (
                  <div className="flex items-center justify-between pt-2 md:pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={currentStep === 0}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft />
                      {t("buttons.back")}
                    </Button>

                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2"
                    >
                      {t("buttons.continue")}
                      <ArrowRight />
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Aside - справа на десктопе, внизу на мобилке */}
        <AppointmentAside
          pointCode={pointCode}
          service={service}
          daySlotsData={daySlotsData}
          date={selectedDate}
          time={selectedTime}
          masterPhone={selectedMasterPhone}
        />
      </div>
    </div>
  );
}
