"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "@/shared/api/services";
import type {
  RegisterRequest,
  RegisterResendRequest,
  RegisterVerifyRequest,
} from "@/shared/api/types";
import { setAuthTokens } from "@/shared/utils/cookies";
import { useTranslations, useLocale } from "next-intl";

/**
 * Хук для регистрации (первый шаг — отправка данных и получение OTP)
 */
export function useRegister() {
  const t = useTranslations("RegisterForm.messages");
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onError: (error: Error) => {
      toast.error(error.message || t("errors.register"));
    },
  });
}

/**
 * Хук для повторной отправки OTP-кода
 */
export function useRegisterResend() {
  const t = useTranslations("RegisterForm.messages");
  return useMutation({
    mutationFn: (data: RegisterResendRequest) => authService.resend(data),
    onSuccess: () => {
      toast.success(t("success.codeResent"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("errors.resend"));
    },
  });
}

/**
 * Хук для подтверждения регистрации OTP-кодом
 */
export function useRegisterVerify() {
  const locale = useLocale();
  const t = useTranslations("RegisterForm.messages");
  return useMutation({
    mutationFn: (data: RegisterVerifyRequest) => authService.verify(data),
    onSuccess: async data => {
      await setAuthTokens(data.access_token, data.refresh_token);
      toast.success(t("success.registration"));
      window.location.href = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/${locale}/login`;
    },
    onError: (error: Error) => {
      toast.error(error.message || t("errors.confirm"));
    },
  });
}
