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
import { useCreateBagsy } from "@/shared/hooks/use-bagsy";
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
} from "lucide-react";
import { AppointmentStepOtp } from "./appointment-step-otp";
import type { Service, GetDaySlotsResponse } from "@/shared/api/types";

interface AppointmentStepConfirmProps {
  pointCode: string;
  service: Service | undefined;
  daySlotsData: GetDaySlotsResponse | undefined;
  handleBack: () => void;
}

export function AppointmentStepConfirm({
  pointCode,
  service,
  daySlotsData,
  handleBack,
}: AppointmentStepConfirmProps) {
  const t = useTranslations("AppointmentForm");
  const locale = useLocale();
  const form = useFormContext<{
    service_id?: string;
    date?: string;
    time?: string;
    master_phone?: string;
    name?: string;
    surname?: string;
    client_phone?: string;
    comment?: string;
    bagsy_id?: string;
  }>();

  const [showOtp, setShowOtp] = useState(false);
  const createBagsyMutation = useCreateBagsy();

  const formValues = form.getValues();
  const dateFnsLocale = locale === "ru" ? ru : kk;

  // Находим выбранного мастера
  const selectedMaster = daySlotsData?.masters.find(
    m => m.master_phone === formValues.master_phone
  );

  // Форматируем дату и время
  const formattedDate = formValues.date
    ? format(parseISO(formValues.date), "d MMMM yyyy", {
        locale: dateFnsLocale,
      })
    : "";
  const formattedTime = formValues.time || "";

  // Форматируем pointCode для отображения
  const formattedPointCode = pointCode
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const handleConfirm = async () => {
    if (
      !formValues.service_id ||
      !formValues.date ||
      !formValues.time ||
      !formValues.master_phone ||
      !formValues.name ||
      !formValues.surname ||
      !formValues.client_phone
    ) {
      toast.error(t("errors.fillAllFields"));
      return;
    }

    try {
      // Формируем start_at в ISO формате с Z окончанием
      const startAt = `${formValues.date}T${formValues.time}:00Z`;
      const clientPhone = formValues.client_phone!.replace(/[^\d]/g, "");

      const response = await createBagsyMutation.mutateAsync({
        service_id: formValues.service_id!,
        start_at: startAt,
        master_phone: formValues.master_phone!,
        name: formValues.name!,
        surname: formValues.surname!,
        client_phone: clientPhone,
        comment: formValues.comment || undefined,
      });

      // Сохраняем bagsy_id и показываем OTP
      form.setValue("bagsy_id", response.bagsy_id);
      setShowOtp(true);
      toast.success(t("success.bagsyCreated"));
    } catch (error) {
      // Ошибка уже обработана в хуке
    }
  };

  // Если OTP уже показан, отображаем его
  if (showOtp || formValues.bagsy_id) {
    return <AppointmentStepOtp bagsyId={formValues.bagsy_id!} />;
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
              <p className="text-sm text-muted-foreground">
                {formattedPointCode}
              </p>
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
                      {selectedMaster?.master_service_price?.toLocaleString()} ₸
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
                        <span className="text-muted-foreground">•</span>
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
                    {selectedMaster.master_name}
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
          disabled={createBagsyMutation.isPending}
        >
          {createBagsyMutation.isPending ? (
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
