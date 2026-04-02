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
import {
  Calendar,
  Clock,
  User,
  BriefcaseBusiness,
  ClipboardList,
  Banknote,
  MapPin,
  Phone,
} from "lucide-react";
import type { Location, Service, GetSlotsResponse } from "@/shared/api/types";

interface AppointmentAsideProps {
  location: Location;
  service: Service | undefined;
  slotsData: GetSlotsResponse | undefined;
  date?: string;
  time?: string;
  employeeId?: string;
}

export function AppointmentAside({
  location,
  service,
  slotsData,
  date,
  time,
  employeeId,
}: AppointmentAsideProps) {
  const t = useTranslations("AppointmentForm");
  const locale = useLocale();
  const dateFnsLocale = locale === "ru" ? ru : kk;

  const formattedDate = date
    ? format(parseISO(date), "d MMMM yyyy", { locale: dateFnsLocale })
    : null;

  const selectedMaster = slotsData?.master_slots.find(
    m => m.employee_id === employeeId
  );

  const hasSpecificPrice = !!selectedMaster?.price;
  const specificPrice = selectedMaster?.price;
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
            <BriefcaseBusiness className="size-4 text-muted-foreground" />
            <span>{t("aside.business")}</span>
          </div>
          <p className="text-sm pl-6">{location.name}</p>
          {location.address && (
            <div className="flex items-start gap-1.5 pl-6">
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
            <div className="flex items-center gap-1.5 pl-6">
              <Phone className="size-3.5 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground">{location.phone}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Услуга */}
        {service && (
          <>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ClipboardList className="size-4 text-muted-foreground" />
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

        {/* Мастер */}
        {selectedMaster && (
          <>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="size-4" />
                <span>{t("aside.master")}</span>
              </div>
              <div className="pl-6 space-y-1">
                <p className="text-sm">{selectedMaster.employee_name}</p>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Тотал */}
        {(hasSpecificPrice || priceRange) && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Banknote className="size-4" />
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
