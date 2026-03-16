"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/entities/button";
import { Loader2 } from "lucide-react";

interface RegisterStepTwoProps {
  phone: string;
  retryAfter: number;
  onResend: () => void;
  isResending: boolean;
}

export function RegisterStepTwo({
  phone,
  retryAfter,
  onResend,
  isResending,
}: RegisterStepTwoProps) {
  const t = useTranslations("RegisterForm");
  const form = useFormContext();
  const [countdown, setCountdown] = useState(retryAfter);

  useEffect(() => {
    setCountdown(retryAfter);
  }, [retryAfter]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          {t("confirm.description", { phone })}
        </p>
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

      <div className="flex justify-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={countdown > 0 || isResending}
          onClick={onResend}
        >
          {isResending ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              {t("buttons.submitting")}
            </>
          ) : countdown > 0 ? (
            t("buttons.resendIn", { seconds: countdown })
          ) : (
            t("buttons.resend")
          )}
        </Button>
      </div>
    </div>
  );
}
