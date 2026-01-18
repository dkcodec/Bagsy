"use client";

/**
 * Шаг 5: OTP подтверждение
 * Ввод 4-значного кода для подтверждения записи
 */

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useConfirmBagsy, useResendCode } from "@/shared/hooks/use-bagsy";
import { toast } from "sonner";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/entities/form";
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/entities/input-otp";
import { Button } from "@/entities/button";
import { Loader2 } from "lucide-react";
import { AppointmentStepSuccess } from "./appointment-step-success";
import type { GetDaySlotsResponse } from "@/shared/api/types";

interface AppointmentStepOtpProps {
  bagsyId: string;
  daySlotsData?: GetDaySlotsResponse;
}

export function AppointmentStepOtp({
  bagsyId,
  daySlotsData,
}: AppointmentStepOtpProps) {
  const t = useTranslations("AppointmentForm");
  const form = useFormContext<{
    code?: string;
  }>();
  const [showSuccess, setShowSuccess] = useState(false);
  const confirmBagsyMutation = useConfirmBagsy();
  const resendCodeMutation = useResendCode();

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

  const handleResendCode = () => {
    resendCodeMutation.mutateAsync({
      bagsy_id: bagsyId,
    });
  };

  if (showSuccess) {
    return <AppointmentStepSuccess daySlotsData={daySlotsData} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">{t("steps.otp.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("steps.otp.description")}
        </p>
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
                  onChange={value => {
                    field.onChange(value);
                    if (value.length === 4) {
                      handleOtpComplete(value);
                    }
                  }}
                  pattern={REGEXP_ONLY_DIGITS}
                  disabled={confirmBagsyMutation.isPending}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="md:h-18 md:w-18 md:text-xl" />
                    <InputOTPSlot index={1} className="md:h-18 md:w-18 md:text-xl" />
                    <InputOTPSlot index={2} className="md:h-18 md:w-18 md:text-xl" />
                    <InputOTPSlot index={3} className="md:h-18 md:w-18 md:text-xl" />
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

      <Button variant="outline" className="w-full" onClick={handleResendCode}>
        {resendCodeMutation.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t("steps.otp.resendCode")}
          </>
        ) : (
          t("steps.otp.resendCode")
        )}
      </Button>

    </div>
  );
}
