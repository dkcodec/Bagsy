/**
 * Сервис для работы с бронированием (bagsies)
 * Управление записями на прием, слотами и услугами
 */

import { apiClient } from "../client";
import type {
  Service,
  GetSlotsRequest,
  GetSlotsResponse,
  GetDaySlotsRequest,
  GetDaySlotsResponse,
  CreateBagsyRequest,
  CreateBagsyResponse,
  ConfirmBagsyRequest,
  ConfirmBagsyResponse,
  ServicesResponse,
} from "../types";

/**
 * Сервис для работы с бронированием
 */
export const bagsyService = {
  /**
   * Получение списка услуг для точки
   */
  async getServices(pointCode: string): Promise<Service[]> {
    const response = await apiClient.get<ServicesResponse>(
      `v1/services/${pointCode}`
    );
    
    return response.services;
  },

  /**
   * Получение доступных дат для услуги
   */
  async getSlots(data: GetSlotsRequest): Promise<GetSlotsResponse> {
    const response = await apiClient.post<GetSlotsResponse>(
      "v1/bagsies/slots",
      data
    );
    return response;
  },

  /**
   * Получение доступных слотов на конкретный день
   */
  async getDaySlots(data: GetDaySlotsRequest): Promise<GetDaySlotsResponse> {
    const response = await apiClient.post<GetDaySlotsResponse>(
      "v1/bagsies/slots/day",
      data
    );
    return response;
  },

  /**
   * Создание новой брони
   */
  async createBagsy(data: CreateBagsyRequest): Promise<CreateBagsyResponse> {
    const response = await apiClient.post<CreateBagsyResponse>(
      "v1/bagsies",
      data
    );
    return response;
  },

  /**
   * Подтверждение брони с OTP кодом
   */
  async confirmBagsy(
    data: ConfirmBagsyRequest
  ): Promise<ConfirmBagsyResponse> {
    const response = await apiClient.post<ConfirmBagsyResponse>(
      "v1/bagsies/confirm",
      data
    );
    return response;
  },
};
