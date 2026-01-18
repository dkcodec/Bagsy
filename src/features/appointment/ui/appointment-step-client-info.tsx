"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/entities/form";
import { Input } from "@/entities/input";
import { Textarea } from "@/entities/textarea";
import { PhoneInput } from "@/widgets/forms/phone-input";

/**
 * Шаг 3: Информация о клиенте
 */
export function AppointmentStepClientInfo() {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Заполните ваши контактные данные
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Имя */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя *</FormLabel>
              <FormControl>
                <Input placeholder="Введите имя" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Фамилия */}
        <FormField
          control={form.control}
          name="surname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Фамилия *</FormLabel>
              <FormControl>
                <Input placeholder="Введите фамилию" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Телефон */}
      <FormField
        control={form.control}
        name="client_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Телефон *</FormLabel>
            <FormControl>
              <PhoneInput
                value={field.value}
                onChange={field.onChange}
                placeholder="Введите номер телефона"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Комментарий */}
      <FormField
        control={form.control}
        name="comment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Комментарий (необязательно)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Дополнительная информация..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
