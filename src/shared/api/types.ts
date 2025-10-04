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
