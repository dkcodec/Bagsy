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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/entities/input-otp";

interface RegisterStepTwoProps {
  phone: string;
  attemptsLeft: number;
}

export function RegisterStepTwo({ phone, attemptsLeft }: RegisterStepTwoProps) {
  const t = useTranslations("RegisterForm");
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          {t("confirm.description", { phone })}
        </p>
        {attemptsLeft < 3 && (
          <p className="text-sm font-medium text-destructive">
            {t("confirm.attemptsLeft", { count: attemptsLeft })}
          </p>
        )}
      </div>

      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center">
            <FormLabel>{t("fields.code.label")}</FormLabel>
            <FormControl>
              <InputOTP
                maxLength={4}
                value={field.value}
                onChange={field.onChange}
                autoFocus
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormDescription>{t("fields.code.hint")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
