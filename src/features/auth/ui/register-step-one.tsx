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
import { PhoneInput } from "@/widgets/forms/phone-input";
import type { PlanCode } from "@/shared/api/types";
import { cn } from "@/shared/utils/styles";

const PLANS: PlanCode[] = ["solo", "point", "network"];

export function RegisterStepOne() {
  const t = useTranslations("RegisterForm");
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{t("steps.step1.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("steps.step1.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="first_name"
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
          name="last_name"
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
        name="plan_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("fields.planCode.label")}</FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PLANS.map(plan => (
                  <button
                    key={plan}
                    type="button"
                    onClick={() => field.onChange(plan)}
                    className={cn(
                      "flex flex-col items-start rounded-xl border-2 p-4 text-left transition-colors",
                      field.value === plan
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-muted-foreground/30"
                    )}
                  >
                    <span className="font-semibold">
                      {t(`plans.${plan}.name`)}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {t(`plans.${plan}.description`)}
                    </span>
                  </button>
                ))}
              </div>
            </FormControl>
            <FormDescription>{t("fields.planCode.hint")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
