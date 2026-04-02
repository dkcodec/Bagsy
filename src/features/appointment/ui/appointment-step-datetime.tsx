"use client";

/**
 * Шаг 2: Выбор даты, времени и мастера
 * Объединяет календарь, выбор времени и выбор мастера
 */

import { useMemo, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { format, parseISO, isSameDay } from "date-fns";
import { useSlots } from "@/shared/hooks/use-appointment";
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
import {
  toStartAtISO,
  parseDateFromISO,
  parseTimeFromISO,
} from "@/shared/utils/datetime";
import { Separator } from "@/entities/separator";

interface AppointmentStepDateTimeProps {
  locationId: string;
  serviceId: string;
  onNext?: () => void;
}

export function AppointmentStepDateTime({
  locationId,
  serviceId,
  onNext,
}: AppointmentStepDateTimeProps) {
  const t = useTranslations("AppointmentForm");
  const form = useFormContext<{
    service_id?: string;
    date?: string;
    time?: string;
    employee_id?: string;
  }>();

  const selectedDate = form.watch("date");
  const selectedTime = form.watch("time");

  // Получаем слоты на 7 дней вперед
  const { data: slotsData, isLoading: isLoadingSlots } = useSlots(
    serviceId && locationId
      ? {
          location_id: locationId,
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

  // Доступные даты: извлекаем уникальные даты из всех слотов всех мастеров
  const availableDates = useMemo(() => {
    if (!slotsData?.master_slots) return [];
    const dateSet = new Set<string>();
    slotsData.master_slots.forEach(master => {
      master.slots.forEach(slot => {
        dateSet.add(parseDateFromISO(slot.start_at));
      });
    });
    return Array.from(dateSet)
      .sort()
      .map(d => parseISO(d));
  }, [slotsData]);

  // Автоматически выбираем первую доступную дату
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      const firstDate = availableDates[0];
      form.setValue("date", format(firstDate, "yyyy-MM-dd"));
    }
  }, [availableDates, selectedDate, form]);

  const isDateDisabled = (date: Date) => {
    return !availableDates.some(availableDate =>
      isSameDay(availableDate, date)
    );
  };

  // Слоты времени на выбранный день: уникальные, сортированные
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate || !slotsData?.master_slots) return [];
    const allSlots = new Set<string>();
    slotsData.master_slots.forEach(master => {
      master.slots.forEach(slot => {
        if (parseDateFromISO(slot.start_at) === selectedDate) {
          allSlots.add(parseTimeFromISO(slot.start_at));
        }
      });
    });
    return Array.from(allSlots).sort();
  }, [selectedDate, slotsData]);

  // Фильтруем мастеров по выбранному времени и дате
  const availableMasters = useMemo(() => {
    if (!selectedTime || !selectedDate || !slotsData?.master_slots) return [];
    return slotsData.master_slots.filter(master =>
      master.slots.some(slot => {
        return (
          parseDateFromISO(slot.start_at) === selectedDate &&
          parseTimeFromISO(slot.start_at) === selectedTime
        );
      })
    );
  }, [selectedTime, selectedDate, slotsData]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue("date", format(date, "yyyy-MM-dd"));
      form.setValue("time", undefined);
      form.setValue("employee_id", undefined);
    }
  };

  const handleTimeSelect = (time: string) => {
    form.setValue("time", time);
    form.setValue("employee_id", undefined);
  };

  const handleMasterSelect = (employeeId: string) => {
    form.setValue("employee_id", employeeId);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-6 md:flex-row flex-col md:h-92">
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
                    disabled={isDateDisabled}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator
          orientation="vertical"
          className="hidden md:block self-stretch"
        />

        {isLoadingSlots ? (
          <div className="flex-1 flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          availableDates.length === 0 && (
            <p className="flex-1 flex text-sm text-muted-foreground text-center justify-center items-center">
              {t("steps.datetime.noDates")}
            </p>
          )
        )}

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
                  {availableTimeSlots.length === 0 ? (
                    <p className="flex-1 flex text-sm text-muted-foreground py-4 text-center justify-center items-center">
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
          name="employee_id"
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
                        key={master.employee_id}
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-md",
                          field.value === master.employee_id &&
                            "ring-2 ring-primary"
                        )}
                        onClick={() => handleMasterSelect(master.employee_id)}
                        onDoubleClick={() => {
                          handleMasterSelect(master.employee_id);
                          onNext?.();
                        }}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <User className="size-4" />
                            {master.employee_name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm font-medium">
                            {master.price?.toLocaleString()} ₸
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
