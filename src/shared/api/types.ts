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

// Типы для регистрации управления
export type ManagementRole = "net_manager" | "self_owner";

export interface NetworkInfo {
  name: string;
  description: string;
}

export interface ManagementRegisterRequest {
  name: string;
  surname: string;
  phone: string;
  password: string;
  role: ManagementRole;
  network_info: NetworkInfo;
}

export interface ManagementRegisterResponse {
  message: string;
  phone: string;
  expires_at: string;
}

export interface ManagementConfirmRequest {
  phone: string;
  code: string;
}

export interface ManagementConfirmResponse {
  message: string;
  user: {
    id: string;
    name: string;
    surname: string;
    phone: string;
    role: string;
  };
}
