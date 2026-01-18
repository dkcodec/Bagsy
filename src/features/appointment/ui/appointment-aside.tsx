"use client";

/**
 * Боковая панель с информацией о записи
 * Отображается справа на десктопе, внизу на мобилке
 */

import { useTranslations } from "next-intl";
import { format, parseISO } from "date-fns";
import { ru, kk } from "date-fns/locale";
import { useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/entities/card";
import { Separator } from "@/entities/separator";
import { CreditCard, Calendar, Clock, User } from "lucide-react";
import type { Service, GetDaySlotsResponse } from "@/shared/api/types";

interface AppointmentAsideProps {
  pointCode: string;
  service: Service | undefined;
  daySlotsData: GetDaySlotsResponse | undefined;
  date?: string;
  time?: string;
  masterPhone?: string;
}

export function AppointmentAside({
  pointCode,
  service,
  daySlotsData,
  date,
  time,
  masterPhone,
}: AppointmentAsideProps) {
  const t = useTranslations("AppointmentForm");
  const locale = useLocale();
  const dateFnsLocale = locale === "ru" ? ru : kk;

  // Форматируем pointCode для отображения
  const formattedPointCode = pointCode
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Форматируем дату
  const formattedDate = date
    ? format(parseISO(date), "d MMMM yyyy", { locale: dateFnsLocale })
    : null;

  // Находим выбранного мастера и его цену
  const selectedMaster = daySlotsData?.masters.find(
    m => m.master_phone === masterPhone
  );

  // Определяем отображаемую цену: конкретная цена мастера или диапазон цен услуги
  const hasSpecificPrice = !!selectedMaster?.master_service_price;
  const specificPrice = selectedMaster?.master_service_price;
  const priceRange =
    service?.min_price && service?.max_price
      ? service.min_price === service.max_price
        ? `${service.min_price?.toLocaleString()} ₸`
        : `${service.min_price?.toLocaleString()} - ${service.max_price.toLocaleString()} ₸`
      : null;

  return (
    <Card className="sticky top-4 h-fit">
      <CardHeader>
        <CardTitle className="text-lg">{t("aside.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Бизнес */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CreditCard className="size-4" />
            <span>{t("aside.business")}</span>
          </div>
          <p className="text-sm pl-6">{formattedPointCode}</p>
        </div>

        <Separator />

        {/* Услуга */}
        {service && (
          <>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CreditCard className="size-4" />
                <span>{t("aside.service")}</span>
              </div>
              <p className="text-sm pl-6">{service.name}</p>
            </div>
            <Separator />
          </>
        )}

        {/* Когда */}
        {(formattedDate || time) && (
          <>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="size-4" />
                <span>{t("aside.when")}</span>
              </div>
              <div className="pl-6 space-y-1">
                {formattedDate && <p className="text-sm">{formattedDate}</p>}
                {time && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-muted-foreground" />
                    <p className="text-sm">{time}</p>
                  </div>
                )}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Тотал */}
        {(hasSpecificPrice || priceRange) && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CreditCard className="size-4" />
              <span>{t("aside.total")}</span>
            </div>
            <p className="text-lg font-semibold pl-6">
              {hasSpecificPrice
                ? `${specificPrice?.toLocaleString()} ₸`
                : priceRange}
            </p>
          </div>
        )}

        {/* Если ничего не выбрано */}
        {!service &&
          !formattedDate &&
          !time &&
          !hasSpecificPrice &&
          !priceRange && (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t("aside.empty")}
            </p>
          )}
      </CardContent>
    </Card>
  );
}
