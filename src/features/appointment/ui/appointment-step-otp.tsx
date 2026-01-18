"use client";

/**
 * Шаг 5: OTP подтверждение
 * Ввод 4-значного кода для подтверждения записи
 */

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useConfirmBagsy } from "@/shared/hooks/use-bagsy";
import { toast } from "sonner";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/entities/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/entities/input-otp";
import { Button } from "@/entities/button";
import { Loader2 } from "lucide-react";
import { AppointmentStepSuccess } from "./appointment-step-success";

interface AppointmentStepOtpProps {
  bagsyId: string;
}

export function AppointmentStepOtp({ bagsyId }: AppointmentStepOtpProps) {
  const t = useTranslations("AppointmentForm");
  const form = useFormContext<{
    code?: string;
  }>();
  const [showSuccess, setShowSuccess] = useState(false);
  const confirmBagsyMutation = useConfirmBagsy();

  const handleOtpComplete = async (value: string) => {
    if (value.length !== 4) return;

    try {
      await confirmBagsyMutation.mutateAsync({
        bagsy_id: bagsyId,
        code: value,
      });
      form.setValue("code", value);
      setShowSuccess(true);
      toast.success(t("success.bagsyConfirmed"));
    } catch (error) {
      // Ошибка уже обработана в хуке
      form.setValue("code", "");
    }
  };

  if (showSuccess) {
    return <AppointmentStepSuccess />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">{t("steps.otp.title")}</h3>
        <p className="text-sm text-muted-foreground">{t("steps.otp.description")}</p>
      </div>

      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-center w-full block">
              {t("steps.otp.codeLabel")}
            </FormLabel>
            <FormControl>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={4}
                  value={field.value || ""}
                  onChange={(value) => {
                    field.onChange(value);
                    if (value.length === 4) {
                      handleOtpComplete(value);
                    }
                  }}
                  disabled={confirmBagsyMutation.isPending}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {confirmBagsyMutation.isPending && (
        <div className="flex justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
