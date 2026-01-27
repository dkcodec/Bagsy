"use client";

import { format, parseISO, isSameDay } from "date-fns";
import { useSlots, useDaySlots } from "@/shared/hooks";
import {
  toStartAtISO,
  parseDateFromISO,
  parseTimeFromISO,
} from "@/shared/utils/datetime";
import { Calendar } from "@/entities/calendar";
import { Button } from "@/entities/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/entities/card";
import { Skeleton } from "@/entities/skeleton";
import { cn } from "@/shared/utils/styles";
import { Clock } from "lucide-react";

interface AppointmentStepCalendarProps {
  pointCode: string;
  serviceId: string;
  selectedDate: Date | null;
  selectedTime: string | null;
  onSelectDate: (date: Date | null) => void;
  onSelectTime: (time: string) => void;
}

/**
 * Шаг 2: Выбор даты и времени
 */
export function AppointmentStepCalendar({
  pointCode,
  serviceId,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: AppointmentStepCalendarProps) {
  // Получаем доступные даты
  const { data: slotsData, isLoading: isLoadingSlots } = useSlots({
    point_code: pointCode,
    service_id: serviceId,
  });

  // Получаем слоты на выбранный день (date в API — ISO+tz)
  const { data: daySlotsData, isLoading: isLoadingDaySlots } = useDaySlots(
    selectedDate
      ? {
          date: toStartAtISO(format(selectedDate, "yyyy-MM-dd"), "00:00"),
          point_code: pointCode,
          service_id: serviceId,
        }
      : null
  );

  // Доступные даты: из ISO+tz извлекаем yyyy-MM-dd, затем Date для календаря
  const availableDates =
    slotsData?.available_dates.map(s => parseISO(parseDateFromISO(s))) ?? [];

  // Функция для проверки, доступна ли дата
  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => isSameDay(availableDate, date));
  };

  // Обработчик выбора даты в календаре
  const handleDateSelect = (date: Date | undefined) => {
    if (date && isDateAvailable(date)) {
      onSelectDate(date);
    } else {
      onSelectDate(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Выберите удобную дату и время для записи
        </p>

        {/* Календарь */}
        <div className="flex justify-center mb-6">
          {isLoadingSlots ? (
            <Skeleton className="h-[350px] w-full max-w-[350px]" />
          ) : (
            <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={handleDateSelect}
              disabled={date => !isDateAvailable(date)}
              modifiers={{
                available: availableDates,
              }}
              modifiersClassNames={{
                available: "bg-primary/10 text-primary font-medium",
              }}
            />
          )}
        </div>

        {/* Слоты времени для выбранного дня */}
        {selectedDate && (
          <div className="space-y-4">
            {isLoadingDaySlots ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : daySlotsData &&
              daySlotsData.masters &&
              daySlotsData.masters.some(master => master.slots.length > 0) ? (
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Доступное время</CardTitle>
                  <CardDescription className="text-xs">
                    Выберите удобное время для записи
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {[
                      ...new Set(
                        daySlotsData.masters.flatMap(m =>
                          m.slots.map(parseTimeFromISO)
                        )
                      ),
                    ]
                      .sort()
                      .map(time => {
                        const isSelected = selectedTime === time;
                        return (
                          <Button
                            key={time}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "gap-2",
                              isSelected && "ring-2 ring-primary"
                            )}
                            onClick={() => onSelectTime(time)}
                          >
                            <Clock className="size-3" />
                            {time}
                          </Button>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Нет доступных слотов на выбранную дату
              </div>
            )}
          </div>
        )}

        {!selectedDate && !isLoadingSlots && (
          <div className="text-center py-8 text-muted-foreground">
            Выберите дату из календаря
          </div>
        )}
      </div>
    </div>
  );
}
