"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/entities/select";
import { PhoneInput } from "@/widgets/forms/phone-input";
import type { ManagementRole } from "@/shared/api/types";

interface RegisterStepOneProps {
  roles: Array<{ value: ManagementRole; label: string }>;
}

export function RegisterStepOne({ roles }: RegisterStepOneProps) {
  const t = useTranslations("RegisterForm");
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{t("steps.step2.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("steps.step2.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.name.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("fields.name.placeholder")}
                  autoComplete="given-name"
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
              <FormLabel>{t("fields.surname.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("fields.surname.placeholder")}
                  autoComplete="family-name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("fields.phone.label")}</FormLabel>
            <FormControl>
              <PhoneInput
                placeholder={t("fields.phone.placeholder")}
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormDescription>{t("fields.phone.hint")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("fields.password.label")}</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder={t("fields.password.placeholder")}
                autoComplete="new-password"
                {...field}
              />
            </FormControl>
            <FormDescription>{t("fields.password.hint")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("fields.confirmPassword.label")}</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder={t("fields.confirmPassword.placeholder")}
                autoComplete="new-password"
                {...field}
              />
            </FormControl>
            <FormDescription>
              {t("fields.confirmPassword.hint")}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("fields.role.label")}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("fields.role.placeholder")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>{t("fields.role.hint")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
