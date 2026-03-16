/**
 * Базовые типы для API
 * Определяют структуру запросов и ответов
 */

// Базовый тип для API ответа
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

// Тип для ошибки API (базовый интерфейс)
export interface ApiErrorData {
  message: string;
  status: number;
  code?: string;
}

// Типы для авторизации
export interface FormRequest {
  phone: string;
  password: string;
}

export interface FormResponse {
  user: {
    phone: string;
    name: string;
    role: string;
  };
  message: string;
}

// Типы для регистрации
export type PlanCode = "solo" | "point" | "network";

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  password: string;
  phone: string;
  plan_code: PlanCode;
}

export interface RegisterResponse {
  expires_in: number;
  message: string;
  phone: string;
  retry_after: number;
}

export interface RegisterResendRequest {
  phone: string;
}

export interface RegisterResendResponse {
  expires_in: number;
  message: string;
  retry_after: number;
}

export interface RegisterVerifyRequest {
  code: string;
  phone: string;
}

export interface RegisterVerifyResponse {
  access_token: string;
  refresh_token: string;
}

// Типы для бронирования (bagsies)
export interface ServicesResponse {
  services: Service[];
}

export interface Service {
  id: string;
  point_code: string;
  category_id: number;
  subcategory_id: number;
  name: string;
  description: string;
  duration_minutes: number;
  active: boolean;
  min_price: number;
  max_price: number;
}

export interface GetSlotsRequest {
  point_code: string;
  service_id: string;
}

export interface GetSlotsResponse {
  service_id: string;
  point_code: string;
  duration_minutes: number;
  /** ISO datetime с таймзоной, напр. 2025-01-15T00:00:00.000+05:00 */
  available_dates: string[];
}

export interface GetDaySlotsRequest {
  /** ISO 8601 с таймзоной, напр. 2025-01-15T00:00:00.000+05:00 */
  date: string;
  point_code: string;
  service_id: string;
}

// Старый тип для обратной совместимости (если понадобится)
export interface MasterSlot {
  phone: string;
  name: string;
  /** ISO datetime с таймзоной, напр. 2025-01-15T15:00:00.000+05:00 */
  slots: string[];
}

export interface GetDaySlotsResponse {
  service_id: string;
  point_code: string;
  /** ISO datetime с таймзоной */
  date: string;
  duration_minutes: number;
  masters: [
    {
      master_name: string;
      master_phone: string;
      master_service_price: number;
      /** ISO datetime с таймзоной, напр. 2025-01-15T15:00:00.000+05:00 */
      slots: string[];
    },
  ];
}

export interface CreateBagsyRequest {
  client_phone: string;
  comment?: string;
  master_phone: string;
  name: string;
  service_id: string;
  /** ISO 8601 с таймзоной, напр. 2025-01-15T15:00:00.000+05:00 */
  start_at: string;
  surname: string;
}

export interface ResendCodeRequest {
  bagsy_id: string;
}

export interface ResendCodeResponse {
  message: string;
}

export interface CreateBagsyResponse {
  bagsy_id: string;
}

export interface ConfirmBagsyRequest {
  bagsy_id: string;
  code: string;
}

export interface ConfirmBagsyResponse {
  message: string;
}
