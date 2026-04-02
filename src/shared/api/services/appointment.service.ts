/**
 * Сервис для работы с записью на прием (appointments)
 * Локации, услуги, слоты, создание и подтверждение записей
 */

import { apiClient } from "../client";
import type {
  Location,
  ServicesResponse,
  Service,
  GetSlotsRequest,
  GetSlotsResponse,
  CreateAppointmentRequest,
  CreateAppointmentResponse,
  ConfirmAppointmentRequest,
} from "../types";

export const appointmentService = {
  /**
   * Получение локации по slug
   */
  async getLocation(slug: string): Promise<Location> {
    return apiClient.get<Location>(`v1/locations/slug/${slug}`);
  },

  /**
   * Получение списка услуг для локации
   */
  async getServices(locationId: string): Promise<Service[]> {
    const response = await apiClient.get<ServicesResponse>(
      `v1/services/${locationId}`
    );
    return response.services;
  },

  /**
   * Получение доступных слотов для записи
   */
  async getSlots(data: GetSlotsRequest): Promise<GetSlotsResponse> {
    return apiClient.post<GetSlotsResponse>("v1/appointments/slots", data);
  },

  /**
   * Создание новой записи
   */
  async createAppointment(
    data: CreateAppointmentRequest
  ): Promise<CreateAppointmentResponse> {
    return apiClient.post<CreateAppointmentResponse>("v1/appointments", data);
  },

  /**
   * Подтверждение записи с OTP кодом
   */
  async confirmAppointment(
    id: string,
    data: ConfirmAppointmentRequest
  ): Promise<void> {
    await apiClient.post(`v1/appointments/${id}/confirm`, data);
  },

  /**
   * Повторная отправка кода подтверждения
   */
  async resendOtp(id: string): Promise<void> {
    await apiClient.post(`v1/appointments/${id}/resend-otp`);
  },
};
