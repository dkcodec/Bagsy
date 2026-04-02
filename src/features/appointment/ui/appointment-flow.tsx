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
import {
  useLocation,
  useLocationServices,
  useSlots,
} from "@/shared/hooks/use-appointment";
import { Form } from "@/entities/form";
import { Stepper } from "@/entities/stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/entities/card";
import { Button } from "@/entities/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
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
  employee_id?: string;
  name?: string;
  surname?: string;
  client_phone?: string;
  comment?: string;
  appointment_id?: string;
  code?: string;
};

export function AppointmentFlow({ pointCode }: AppointmentFlowProps) {
  const t = useTranslations("AppointmentForm");
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState(0);

  // Получаем локацию по slug
  const { data: location, isLoading: isLoadingLocation } =
    useLocation(pointCode);

  // Схема валидации с условной валидацией по шагам
  const schema = useMemo(() => {
    return z
      .object({
        service_id: z.string().optional(),
        date: z.string().optional(),
        time: z.string().optional(),
        employee_id: z.string().optional(),
        name: z.string().optional(),
        surname: z.string().optional(),
        client_phone: z.string().optional(),
        appointment_id: z.string().optional(),
        code: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        if (currentStep === 0) {
          if (!data.service_id || data.service_id.trim().length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.serviceRequired"),
              path: ["service_id"],
            });
          }
        }

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
          if (!data.employee_id || data.employee_id.trim().length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("errors.masterRequired"),
              path: ["employee_id"],
            });
          }
        }

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

        if (currentStep === 3 && data.appointment_id) {
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
      employee_id: undefined,
      name: "",
      surname: "",
      client_phone: "",
      comment: "",
      appointment_id: undefined,
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

  // Получаем данные для Aside и слотов
  const serviceId = form.watch("service_id");
  const selectedDate = form.watch("date");
  const selectedTime = form.watch("time");
  const selectedEmployeeId = form.watch("employee_id");

  const { data: services } = useLocationServices(location?.id);
  const service = services?.find(s => s.id === serviceId);

  const { data: slotsData } = useSlots(
    location?.id && serviceId
      ? {
          location_id: location.id,
          service_id: serviceId,
          start_date: toStartAtISO(
            new Date().toISOString().slice(0, 10),
            "00:00"
          ),
          end_date: toStartAtISO(
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .slice(0, 10),
            "00:00"
          ),
        }
      : null
  );

  // Шаги для степпера
  const steps = useMemo(
    () => [
      { label: t("steps.stepper.service") },
      { label: t("steps.stepper.datetime") },
      { label: t("steps.stepper.client") },
      { label: t("steps.stepper.confirm") },
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
      form.setValue("code", "");
    }
  };

  if (isLoadingLocation) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!location) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("errors.locationNotFound")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 md:space-y-4 lg:space-y-6">
      {/* Степпер */}
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
                  <AppointmentStepService
                    locationId={location.id}
                    onNext={handleNext}
                  />
                )}
                {currentStep === 1 && serviceId && (
                  <AppointmentStepDateTime
                    locationId={location.id}
                    serviceId={serviceId}
                    onNext={handleNext}
                  />
                )}
                {currentStep === 2 && <AppointmentStepClient />}
                {currentStep === 3 && (
                  <AppointmentStepConfirm
                    location={location}
                    service={service}
                    slotsData={slotsData}
                    handleBack={handleBack}
                  />
                )}

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

        <AppointmentAside
          location={location}
          service={service}
          slotsData={slotsData}
          date={selectedDate}
          time={selectedTime}
          employeeId={selectedEmployeeId}
        />
      </div>
    </div>
  );
}
