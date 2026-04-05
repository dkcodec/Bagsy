"use client";

/**
 * Шаг 1: Выбор услуги
 * Отображает список доступных услуг для выбора
 */

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useLocationServices } from "@/shared/hooks/use-appointment";
import { FormField, FormItem, FormControl, FormMessage } from "@/entities/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/entities/card";
import { Loader2, Clock } from "lucide-react";
import { cn } from "@/shared/utils/styles";
import type { Service } from "@/shared/api/types";

interface AppointmentStepServiceProps {
  locationId: string;
  onNext?: () => void;
}

export function AppointmentStepService({
  locationId,
  onNext,
}: AppointmentStepServiceProps) {
  const t = useTranslations("AppointmentForm");
  const { data: services, isLoading } = useLocationServices(locationId);
  const form = useFormContext<{
    service_id?: string;
    date?: string;
    time?: string;
    employee_id?: string;
    appointment_id?: string;
    code?: string;
  }>();

  const selectedServiceId = form.watch("service_id");

  const handleServiceSelect = (serviceId: string) => {
    const currentServiceId = form.getValues("service_id");
    if (currentServiceId !== serviceId) {
      form.setValue("service_id", serviceId);
      form.setValue("date", undefined);
      form.setValue("time", undefined);
      form.setValue("employee_id", undefined);
      form.setValue("appointment_id", undefined);
      form.setValue("code", "");
    } else {
      form.setValue("service_id", serviceId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const pricedServices = services?.filter(
    service => service.min_price > 0 || service.max_price > 0
  );

  if (!pricedServices || pricedServices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("steps.service.noServices")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="service_id"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pricedServices.map(service => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    isSelected={field.value === service.id}
                    onClick={() => handleServiceSelect(service.id)}
                    onDoubleClick={() => {
                      handleServiceSelect(service.id);
                      onNext?.();
                    }}
                  />
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
}

function ServiceCard({
  service,
  isSelected,
  onClick,
  onDoubleClick,
}: ServiceCardProps) {
  const t = useTranslations("AppointmentForm");

  const priceText =
    service.min_price === service.max_price
      ? `${service.min_price?.toLocaleString()} ₸`
      : `${service.min_price?.toLocaleString()} - ${service.max_price.toLocaleString()} ₸`;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md flex flex-col",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{service.name}</CardTitle>
      </CardHeader>
      <CardContent className="grow py-0">
        {service.description && (
          <CardDescription className="line-clamp-2">
            {service.description}
          </CardDescription>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 pt-4 mt-auto text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="size-4" />
          <span>
            {service.duration_minutes} {t("steps.service.minutes")}
          </span>
        </div>
        <div className="font-semibold">{priceText}</div>
      </CardFooter>
    </Card>
  );
}
