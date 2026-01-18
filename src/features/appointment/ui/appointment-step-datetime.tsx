"use client";

/**
 * Шаг 2: Выбор даты, времени и мастера
 * Объединяет календарь, выбор времени и выбор мастера
 */

import { useMemo, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { format, parseISO, isSameDay } from "date-fns";
import { ru, kk } from "date-fns/locale";
import { useLocale } from "next-intl";
import { useSlots, useDaySlots } from "@/shared/hooks/use-bagsy";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/entities/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/entities/card";
import { Button } from "@/entities/button";
import { Calendar } from "@/entities/calendar";
import { Loader2, Clock, User } from "lucide-react";
import { cn } from "@/shared/utils/styles";
import { Separator } from "@/entities/separator";

interface AppointmentStepDateTimeProps {
  pointCode: string;
  serviceId: string;
}

export function AppointmentStepDateTime({
  pointCode,
  serviceId,
}: AppointmentStepDateTimeProps) {
  const t = useTranslations("AppointmentForm");
  const locale = useLocale();
  const form = useFormContext<{
    service_id?: string;
    date?: string;
    time?: string;
    master_phone?: string;
  }>();

  const selectedDate = form.watch("date");
  const selectedTime = form.watch("time");
  const selectedMasterPhone = form.watch("master_phone");

  // Получаем доступные даты
  const { data: slotsData, isLoading: isLoadingSlots } = useSlots(
    serviceId && pointCode
      ? { service_id: serviceId, point_code: pointCode }
      : null
  );

  // Получаем слоты на выбранный день
  const { data: daySlotsData, isLoading: isLoadingDaySlots } = useDaySlots(
    selectedDate && serviceId && pointCode
      ? {
          date: selectedDate,
          service_id: serviceId,
          point_code: pointCode,
        }
      : null
  );

  // Форматируем доступные даты для календаря
  const availableDates = useMemo(() => {
    if (!slotsData?.available_dates) return [];
    return slotsData.available_dates.map(dateStr => parseISO(dateStr));
  }, [slotsData]);

  // Автоматически выбираем первую доступную дату при загрузке
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      const firstDate = availableDates[0];
      form.setValue("date", format(firstDate, "yyyy-MM-dd"));
    }
  }, [availableDates, selectedDate, form]);

  // Функция для проверки, доступна ли дата
  const isDateDisabled = (date: Date) => {
    return !availableDates.some(availableDate =>
      isSameDay(availableDate, date)
    );
  };

  // Собираем все уникальные слоты времени из всех мастеров
  const availableTimeSlots = useMemo(() => {
    if (!daySlotsData?.masters) return [];
    const allSlots = new Set<string>();
    daySlotsData.masters.forEach(master => {
      master.slots.forEach(slot => allSlots.add(slot));
    });
    return Array.from(allSlots).sort();
  }, [daySlotsData]);

  // Фильтруем мастеров по выбранному времени
  const availableMasters = useMemo(() => {
    if (!selectedTime || !daySlotsData?.masters) return [];
    return daySlotsData.masters.filter(master =>
      master.slots.includes(selectedTime)
    );
  }, [selectedTime, daySlotsData]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue("date", format(date, "yyyy-MM-dd"));
      // Сбрасываем время и мастера при смене даты
      form.setValue("time", undefined);
      form.setValue("master_phone", undefined);
    }
  };

  const handleTimeSelect = (time: string) => {
    form.setValue("time", time);
    // Сбрасываем мастера при смене времени
    form.setValue("master_phone", undefined);
  };

  const handleMasterSelect = (masterPhone: string) => {
    form.setValue("master_phone", masterPhone);
  };

  const dateFnsLocale = locale === "ru" ? ru : kk;

  return (
    <div className="space-y-6">
      <div className="flex gap-6 md:flex-row flex-col md:h-80">
        {/* Календарь */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                {t("steps.datetime.date")}
              </FormLabel>
              <FormControl>
                <div className="flex justify-start">
                  <Calendar
                    mode="single"
                    selected={field.value ? parseISO(field.value) : undefined}
                    onSelect={handleDateSelect}
                    className="rounded-md border"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Сепаратор видим только на десктопе при горизонтальном расположении */}
        <Separator
          orientation="vertical"
          className="hidden md:block self-stretch"
        />

        {/* Выбор времени */}
        {selectedDate && (
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-base">
                  {t("steps.datetime.time")}
                </FormLabel>
                <FormControl>
                  {isLoadingDaySlots ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : availableTimeSlots.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      {t("steps.datetime.noSlots")}
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {availableTimeSlots.map(timeSlot => (
                        <Button
                          key={timeSlot}
                          type="button"
                          variant={
                            field.value === timeSlot ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handleTimeSelect(timeSlot)}
                          className="flex items-center gap-1.5"
                        >
                          <Clock className="size-3.5" />
                          {timeSlot}
                        </Button>
                      ))}
                    </div>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Выбор мастера */}
      {selectedTime && (
        <FormField
          control={form.control}
          name="master_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                {t("steps.datetime.master")}
              </FormLabel>
              <FormControl>
                {availableMasters.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    {t("steps.datetime.noMasters")}
                  </p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {availableMasters.map(master => (
                      <Card
                        key={master.master_phone}
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-md",
                          field.value === master.master_phone &&
                            "ring-2 ring-primary"
                        )}
                        onClick={() => handleMasterSelect(master.master_phone)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <User className="size-4" />
                            {master.master_name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm font-medium">
                            {master?.master_service_price?.toLocaleString()} ₸
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
