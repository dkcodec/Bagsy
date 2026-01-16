"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { managementAuthService } from "@/shared/api/services";
import type {
  ManagementRegisterRequest,
  ManagementConfirmRequest,
} from "@/shared/api/types";
import { useTranslations, useLocale } from "next-intl";

/**
 * Хук для регистрации управления (первый шаг)
 */
export function useManagementRegister() {
  const t = useTranslations("RegisterForm.messages");
  return useMutation({
    mutationFn: (data: ManagementRegisterRequest) =>
      managementAuthService.register(data),
    onError: (error: Error) => {
      toast.error(error.message || t("errors.register"));
    },
  });
}

/**
 * Хук для подтверждения регистрации (второй шаг)
 */
export function useManagementConfirm() {
  const locale = useLocale();
  const t = useTranslations("RegisterForm.messages");
  return useMutation({
    mutationFn: (data: ManagementConfirmRequest) =>
      managementAuthService.confirm(data),
    onSuccess: () => {
      toast.success(t("success.registration"));
      window.location.href = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/${locale}/login`;
    },
    onError: (error: Error) => {
      toast.error(error.message || t("errors.confirm"));
    },
  });
}
