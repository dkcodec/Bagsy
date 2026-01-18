"use client";

/**
 * Шаг 3: Данные клиента
 * Форма для ввода имени, фамилии и телефона клиента
 */

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/entities/form";
import { Input } from "@/entities/input";
import { Textarea } from "@/entities/textarea";
import PhoneInput from "@/widgets/forms/phone-input";

export function AppointmentStepClient() {
  const t = useTranslations("AppointmentForm");
  const form = useFormContext<{
    name?: string;
    surname?: string;
    client_phone?: string;
    comment?: string;
  }>();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("steps.client.name")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("steps.client.namePlaceholder")}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="surname"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("steps.client.surname")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("steps.client.surnamePlaceholder")}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="client_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("steps.client.phone")}</FormLabel>
            <FormControl>
              <PhoneInput
                value={field.value || ""}
                onChange={field.onChange}
                placeholder={t("steps.client.phonePlaceholder")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="comment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("steps.client.comment")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t("steps.client.commentPlaceholder")}
                className="min-h-[100px] resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              {t("steps.client.commentDescription")}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
