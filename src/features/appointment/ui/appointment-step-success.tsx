"use client";

/**
 * Шаг 6: Успешная запись
 * Поздравительный экран после успешного подтверждения записи
 */

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ru, kk } from "date-fns/locale";
import { useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/entities/card";
import { Button } from "@/entities/button";
import { CheckCircle2, Calendar, Clock, User } from "lucide-react";
import { Separator } from "@/entities/separator";
import type { GetSlotsResponse } from "@/shared/api/types";

interface AppointmentStepSuccessProps {
  slotsData?: GetSlotsResponse;
}

export function AppointmentStepSuccess({
  slotsData,
}: AppointmentStepSuccessProps) {
  const t = useTranslations("AppointmentForm");
  const router = useRouter();
  const locale = useLocale();
  const form = useFormContext<{
    date?: string;
    time?: string;
    employee_id?: string;
    name?: string;
    surname?: string;
  }>();

  const formValues = form.getValues();
  const dateFnsLocale = locale === "ru" ? ru : kk;

  const selectedMaster = slotsData?.master_slots.find(
    m => m.employee_id === formValues.employee_id
  );

  const formattedDate = formValues.date
    ? format(parseISO(formValues.date), "d MMMM yyyy", {
        locale: dateFnsLocale,
      })
    : "";
  const formattedTime = formValues.time || "";

  const handleGoHome = () => {
    router.push(`/${locale}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="size-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t("steps.success.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            {t("steps.success.description")}
          </p>

          <Separator />

          <div className="space-y-3">
            {(formattedDate || formattedTime) && (
              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{formattedDate}</p>
                  {formattedTime && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="size-3.5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {formattedTime}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

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
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleGoHome} className="w-full" size="lg">
        {t("steps.success.goHome")}
      </Button>
    </div>
  );
}
