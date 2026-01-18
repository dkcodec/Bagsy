/**
 * Сервис для авторизации и регистрации управления
 * Работа с эндпоинтами аутентификации
 */

import { apiClient } from "../client";
import type {
  ManagementRegisterRequest,
  ManagementRegisterResponse,
  ManagementConfirmRequest,
  ManagementConfirmResponse,
} from "../types";

/**
 * Сервис для регистрации управления
 */
export const managementAuthService = {
  /**
   * Регистрация владельца сети или сетевого менеджера
   * Отправляет данные и получает код подтверждения
   */
  async register(
    data: ManagementRegisterRequest
  ): Promise<ManagementRegisterResponse> {
    const response = await apiClient.post<ManagementRegisterResponse>(
      "v1/auth/management/register",
      data
    );
    return response;
  },

  /**
   * Подтверждение регистрации с кодом из SMS
   */
  async confirm(
    data: ManagementConfirmRequest
  ): Promise<ManagementConfirmResponse> {
    const response = await apiClient.post<ManagementConfirmResponse>(
      "v1/auth/management/register/confirm",
      data
    );
    return response;
  },
};
