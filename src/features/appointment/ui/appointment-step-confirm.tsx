"use client";

/**
 * Шаг 4: Подтверждение записи
 * Отображает всю информацию о записи и кнопку подтверждения
 * После успешного создания показывает OTP инпут
 */

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { format, parseISO } from "date-fns";
import { ru, kk } from "date-fns/locale";
import { useLocale } from "next-intl";
import { useCreateAppointment } from "@/shared/hooks/use-appointment";
import { toast } from "sonner";
import { Card, CardContent } from "@/entities/card";
import { Button } from "@/entities/button";
import { Separator } from "@/entities/separator";
import {
  Loader2,
  Calendar,
  Clock,
  User,
  Phone,
  ClipboardList,
  BriefcaseBusiness,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import { AppointmentStepOtp } from "./appointment-step-otp";
import { toStartAtISO } from "@/shared/utils/datetime";
import type { Location, Service, GetSlotsResponse } from "@/shared/api/types";

interface AppointmentStepConfirmProps {
  location: Location;
  service: Service | undefined;
  slotsData: GetSlotsResponse | undefined;
  handleBack: () => void;
}

export function AppointmentStepConfirm({
  location,
  service,
  slotsData,
  handleBack,
}: AppointmentStepConfirmProps) {
  const t = useTranslations("AppointmentForm");
  const locale = useLocale();
  const form = useFormContext<{
    service_id?: string;
    date?: string;
    time?: string;
    employee_id?: string;
    name?: string;
    surname?: string;
    client_phone?: string;
    comment?: string;
    appointment_id?: string;
  }>();

  const [showOtp, setShowOtp] = useState(false);
  const createAppointmentMutation = useCreateAppointment();

  const formValues = form.getValues();
  const dateFnsLocale = locale === "ru" ? ru : kk;

  // Находим выбранного мастера
  const selectedMaster = slotsData?.master_slots.find(
    m => m.employee_id === formValues.employee_id
  );

  // Форматируем дату и время
  const formattedDate = formValues.date
    ? format(parseISO(formValues.date), "d MMMM yyyy", {
        locale: dateFnsLocale,
      })
    : "";
  const formattedTime = formValues.time || "";

  const handleConfirm = async () => {
    if (
      !formValues.service_id ||
      !formValues.date ||
      !formValues.time ||
      !formValues.employee_id ||
      !formValues.name ||
      !formValues.surname ||
      !formValues.client_phone
    ) {
      toast.error(t("errors.fillAllFields"));
      return;
    }

    try {
      const startAt = toStartAtISO(formValues.date!, formValues.time!);
      const phone = formValues.client_phone!.replace(/[^\d]/g, "");

      const response = await createAppointmentMutation.mutateAsync({
        service_id: formValues.service_id!,
        start_at: startAt,
        employee_id: formValues.employee_id!,
        first_name: formValues.name!,
        last_name: formValues.surname!,
        phone,
        location_id: location.id,
        comment: formValues.comment || undefined,
      });

      form.setValue("appointment_id", response.id);
      setShowOtp(true);
      toast.success(t("success.bagsyCreated"));
    } catch {
      // Ошибка уже обработана в хуке
    }
  };

  if (showOtp || formValues.appointment_id) {
    return (
      <AppointmentStepOtp
        appointmentId={formValues.appointment_id!}
        slotsData={slotsData}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-3 md:p-6">
          {/* Бизнес */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <BriefcaseBusiness className="size-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {t("steps.confirm.business")}
              </p>
              <p className="text-sm text-muted-foreground">{location.name}</p>
              {location.address && (
                <div className="flex items-start gap-1.5 mt-1">
                  <MapPin className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    {[
                      location.address.city,
                      location.address.street,
                      location.address.building,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}
              {location.phone && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Phone className="size-3.5 text-muted-foreground shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    {location.phone}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Услуга */}
          {service && (
            <>
              <Separator />

              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <ClipboardList className="size-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {t("steps.confirm.service")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {service.name}
                  </p>
                  {selectedMaster && (
                    <p className="text-sm font-medium mt-1">
                      {selectedMaster.price?.toLocaleString()} ₸
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Дата и время */}
          {(formattedDate || formattedTime) && (
            <>
              <Separator />

              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Calendar className="size-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {t("steps.confirm.when")}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">
                      {formattedDate}
                    </p>
                    {formattedTime && (
                      <>
                        <span className="text-muted-foreground">&bull;</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3.5 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {formattedTime}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Мастер */}
          {selectedMaster && (
            <>
              <Separator />

              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <User className="size-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {t("steps.confirm.master")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedMaster.employee_name}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Данные клиента */}
          {(formValues.name ||
            formValues.surname ||
            formValues.client_phone) && (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="text-sm font-medium">
                  {t("steps.confirm.client")}
                </p>
                <div className="space-y-2 pl-8">
                  {formValues.name && (
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {formValues.name} {formValues.surname}
                      </p>
                    </div>
                  )}
                  {formValues.client_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="size-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {formValues.client_phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <div className="flex items-center justify-between pt-2 md:pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft />
          {t("buttons.back")}
        </Button>

        <Button
          type="button"
          onClick={handleConfirm}
          disabled={createAppointmentMutation.isPending}
        >
          {createAppointmentMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {t("steps.confirm.creating")}
            </>
          ) : (
            t("steps.confirm.confirmButton")
          )}
        </Button>
      </div>
    </div>
  );
}
