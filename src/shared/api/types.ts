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

// Типы для локации

export interface LocationAddress {
  building: string;
  city: string;
  details: string;
  street: string;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationScheduleEntry {
  date: string;
  end_time: string;
  id: string;
  start_time: string;
  type: string;
}

export interface Location {
  active: boolean;
  address: LocationAddress;
  category_id: string;
  coordinates: LocationCoordinates;
  created_at: string;
  description: string;
  id: string;
  name: string;
  phone: string;
  schedule: LocationScheduleEntry[];
  schedule_type: string;
  slot_duration_minutes: number;
  slug: string;
}

// Типы для услуг

export interface Service {
  active: boolean;
  category_id: string;
  color: string;
  description: string;
  duration_minutes: number;
  id: string;
  max_price: number;
  min_price: number;
  name: string;
  sort_order: number;
}

export interface ServicesResponse {
  services: Service[];
}

// Типы для слотов записи

export interface SlotTime {
  end_at: string;
  start_at: string;
}

export interface MasterSlot {
  employee_id: string;
  employee_name: string;
  price: number;
  slots: SlotTime[];
}

export interface GetSlotsRequest {
  employee_id?: string;
  end_date: string;
  location_id: string;
  service_id: string;
  start_date: string;
}

export interface GetSlotsResponse {
  duration_minutes: number;
  location_id: string;
  master_slots: MasterSlot[];
  service_id: string;
}

// Типы для записи (appointments)

export interface CreateAppointmentRequest {
  comment?: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  location_id: string;
  phone: string;
  service_id: string;
  start_at: string;
}

export interface CreateAppointmentResponse {
  id: string;
}

export interface ConfirmAppointmentRequest {
  code: string;
}
