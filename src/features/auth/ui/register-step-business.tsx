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
import { Textarea } from "@/entities/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/entities/tooltip";
import { InfoIcon } from "lucide-react";

export function RegisterStepBusiness() {
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

      <FormField
        control={form.control}
        name="network_info.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              {t("fields.networkName.label")}
            </FormLabel>
            <FormControl>
              <Input
                placeholder={t("fields.networkName.placeholder")}
                {...field}
              />
            </FormControl>
            <FormDescription>{t("fields.networkName.hint")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="network_info.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("fields.networkDescription.label")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t("fields.networkDescription.placeholder")}
                rows={4}
                {...field}
              />
            </FormControl>
            <FormDescription>
              {t("fields.networkDescription.hint")}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
