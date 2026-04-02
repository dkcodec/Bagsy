"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { appointmentService } from "@/shared/api/services";
import type {
  GetSlotsRequest,
  CreateAppointmentRequest,
} from "@/shared/api/types";

/**
 * Хук для получения локации по slug
 */
export function useLocation(slug: string) {
  return useQuery({
    queryKey: ["location", slug],
    queryFn: () => appointmentService.getLocation(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Хук для получения списка услуг по ID локации
 */
export function useLocationServices(locationId: string | undefined) {
  return useQuery({
    queryKey: ["services", locationId],
    queryFn: () => appointmentService.getServices(locationId!),
    enabled: !!locationId,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Хук для получения доступных слотов
 */
export function useSlots(data: GetSlotsRequest | null) {
  return useQuery({
    queryKey: ["slots", data],
    queryFn: () => {
      if (!data) throw new Error("Data is required");
      return appointmentService.getSlots(data);
    },
    enabled:
      !!data && !!data.location_id && !!data.service_id && !!data.start_date,
    staleTime: 0,
  });
}

/**
 * Хук для создания записи
 */
export function useCreateAppointment() {
  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) =>
      appointmentService.createAppointment(data),
    onError: (error: Error) => {
      toast.error(error.message || "Ошибка создания записи");
    },
  });
}

/**
 * Хук для подтверждения записи с OTP
 */
export function useConfirmAppointment() {
  return useMutation({
    mutationFn: ({ id, code }: { id: string; code: string }) =>
      appointmentService.confirmAppointment(id, { code }),
    onError: (error: Error) => {
      toast.error(error.message || "Неверный код подтверждения");
    },
  });
}

/**
 * Хук для повторной отправки кода подтверждения
 */
export function useResendOtp() {
  return useMutation({
    mutationFn: (id: string) => appointmentService.resendOtp(id),
    onError: (error: Error) => {
      toast.error(error.message || "Ошибка отправки кода");
    },
  });
}
