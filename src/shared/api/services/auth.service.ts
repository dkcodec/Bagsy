/**
 * Сервис для авторизации и регистрации
 * Работа с эндпоинтами аутентификации
 */

import { apiClient } from "../client";
import type {
  RegisterRequest,
  RegisterResponse,
  RegisterResendRequest,
  RegisterResendResponse,
  RegisterVerifyRequest,
  RegisterVerifyResponse,
} from "../types";

/**
 * Сервис для регистрации
 */
export const authService = {
  /**
   * Регистрация владельца организации
   * Создаёт pending-запрос и отправляет OTP-код
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>("v1/auth/register", data);
  },

  /**
   * Повторная отправка OTP-кода
   */
  async resend(data: RegisterResendRequest): Promise<RegisterResendResponse> {
    return apiClient.post<RegisterResendResponse>(
      "v1/auth/register/resend",
      data
    );
  },

  /**
   * Подтверждение регистрации OTP-кодом
   */
  async verify(data: RegisterVerifyRequest): Promise<RegisterVerifyResponse> {
    return apiClient.post<RegisterVerifyResponse>(
      "v1/auth/register/verify",
      data
    );
  },
};
