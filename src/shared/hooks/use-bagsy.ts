"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bagsyService } from "@/shared/api/services";
import type {
  GetSlotsRequest,
  GetDaySlotsRequest,
  CreateBagsyRequest,
  ConfirmBagsyRequest,
  ResendCodeRequest,
} from "@/shared/api/types";

/**
 * Хук для получения списка услуг
 */
export function useServices(pointCode: string) {
  return useQuery({
    queryKey: ["services", pointCode],
    queryFn: () => bagsyService.getServices(pointCode),
    enabled: !!pointCode,
    staleTime: 10 * 60 * 1000, // 10 минут
  });
}

/**
 * Хук для получения доступных дат
 */
export function useSlots(data: GetSlotsRequest | null) {
  return useQuery({
    queryKey: ["slots", data],
    queryFn: () => {
      if (!data) throw new Error("Data is required");
      return bagsyService.getSlots(data);
    },
    enabled: !!data && !!data.point_code && !!data.service_id,
    staleTime: 2 * 60 * 1000, // 2 минуты
  });
}

/**
 * Хук для получения слотов на конкретный день
 */
export function useDaySlots(data: GetDaySlotsRequest | null) {
  return useQuery({
    queryKey: ["daySlots", data],
    queryFn: () => {
      if (!data) throw new Error("Data is required");
      return bagsyService.getDaySlots(data);
    },
    enabled: !!data && !!data.date && !!data.point_code && !!data.service_id,
    staleTime: 1 * 60 * 1000, // 1 минута
  });
}

/**
 * Хук для создания брони
 */
export function useCreateBagsy() {
  return useMutation({
    mutationFn: (data: CreateBagsyRequest) => bagsyService.createBagsy(data),
    onError: (error: Error) => {
      toast.error(error.message || "Ошибка создания брони");
    },
  });
}

/**
 * Хук для подтверждения брони с OTP
 */
export function useConfirmBagsy() {
  return useMutation({
    mutationFn: (data: ConfirmBagsyRequest) => bagsyService.confirmBagsy(data),
    onError: (error: Error) => {
      toast.error(error.message || "Неверный код подтверждения");
    },
  });
}

/**
 * Хук для повторной отправки кода подтверждения
 */
export function useResendCode() {
  return useMutation({
    mutationFn: (data: ResendCodeRequest) => bagsyService.resendCode(data),
    onError: (error: Error) => {
      toast.error(error.message || "Неверный код подтверждения");
    },
  });
}
