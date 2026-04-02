/**
 * Unit тесты для appointmentService.createAppointment
 * Тестирование создания записи на прием
 */

import { appointmentService } from "../appointment.service";
import { apiClient } from "../../client";
import type {
  CreateAppointmentRequest,
  CreateAppointmentResponse,
} from "../../types";

jest.mock("../../client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("appointmentService.createAppointment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validRequestData: CreateAppointmentRequest = {
    service_id: "0ff04d9f-72db-42d0-81f1-373706bff188",
    start_at: "2026-01-22T15:30:00.000+05:00",
    employee_id: "emp-123",
    first_name: "Иван",
    last_name: "Иванов",
    phone: "77012345678",
    location_id: "location-123",
    comment: "Комментарий к записи",
  };

  const validResponse: CreateAppointmentResponse = {
    id: "appointment-456",
  };

  describe("Успешное создание записи", () => {
    it("должен успешно создать запись с валидными данными", async () => {
      mockedApiClient.post.mockResolvedValueOnce(validResponse);

      const result =
        await appointmentService.createAppointment(validRequestData);

      expect(result).toEqual(validResponse);
      expect(mockedApiClient.post).toHaveBeenCalledTimes(1);
      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "v1/appointments",
        validRequestData
      );
    });

    it("должен правильно передать все обязательные поля", async () => {
      const requestWithoutComment: CreateAppointmentRequest = {
        service_id: "service-123",
        start_at: "2024-01-15T10:00:00.000+05:00",
        employee_id: "emp-1",
        first_name: "Иван",
        last_name: "Иванов",
        phone: "77009876543",
        location_id: "location-123",
      };
      mockedApiClient.post.mockResolvedValueOnce(validResponse);

      await appointmentService.createAppointment(requestWithoutComment);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "v1/appointments",
        requestWithoutComment
      );
    });

    it("должен правильно обработать опциональное поле comment", async () => {
      mockedApiClient.post.mockResolvedValueOnce(validResponse);

      await appointmentService.createAppointment(validRequestData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "v1/appointments",
        expect.objectContaining({
          comment: "Комментарий к записи",
        })
      );
    });

    it("должен правильно сформировать ISO формат start_at с таймзоной", async () => {
      const requestWithISO: CreateAppointmentRequest = {
        ...validRequestData,
        start_at: "2026-01-22T15:30:00.000+05:00",
      };
      mockedApiClient.post.mockResolvedValueOnce(validResponse);

      await appointmentService.createAppointment(requestWithISO);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "v1/appointments",
        expect.objectContaining({
          start_at: "2026-01-22T15:30:00.000+05:00",
        })
      );
      expect(requestWithISO.start_at).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/
      );
    });
  });

  describe("Обработка ошибок", () => {
    it("должен обработать ошибку 400 (невалидные данные)", async () => {
      const error400 = new Error("Invalid request data") as Error & {
        status: number;
        body: unknown;
      };
      error400.status = 400;
      error400.body = { message: "Invalid request data" };
      mockedApiClient.post.mockRejectedValueOnce(error400);

      await expect(
        appointmentService.createAppointment(validRequestData)
      ).rejects.toThrow("Invalid request data");
      expect(mockedApiClient.post).toHaveBeenCalledTimes(1);
    });

    it("должен обработать ошибку 401 (неавторизован)", async () => {
      const error401 = new Error("Unauthorized") as Error & {
        status: number;
        body: unknown;
      };
      error401.status = 401;
      error401.body = { message: "Unauthorized" };
      mockedApiClient.post.mockRejectedValueOnce(error401);

      await expect(
        appointmentService.createAppointment(validRequestData)
      ).rejects.toThrow("Unauthorized");
      expect(mockedApiClient.post).toHaveBeenCalledTimes(1);
    });

    it("должен обработать ошибку 500 (серверная ошибка)", async () => {
      const error500 = new Error("Internal server error") as Error & {
        status: number;
        body: unknown;
      };
      error500.status = 500;
      error500.body = { message: "Internal server error" };
      mockedApiClient.post.mockRejectedValueOnce(error500);

      await expect(
        appointmentService.createAppointment(validRequestData)
      ).rejects.toThrow("Internal server error");
      expect(mockedApiClient.post).toHaveBeenCalledTimes(1);
    });
  });

  describe("Правильная передача данных", () => {
    it("должен вызвать apiClient.post с правильным endpoint", async () => {
      mockedApiClient.post.mockResolvedValueOnce(validResponse);

      await appointmentService.createAppointment(validRequestData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "v1/appointments",
        expect.any(Object)
      );
    });

    it("должен передать все поля запроса в apiClient.post", async () => {
      mockedApiClient.post.mockResolvedValueOnce(validResponse);

      await appointmentService.createAppointment(validRequestData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "v1/appointments",
        expect.objectContaining({
          service_id: "0ff04d9f-72db-42d0-81f1-373706bff188",
          start_at: "2026-01-22T15:30:00.000+05:00",
          employee_id: "emp-123",
          first_name: "Иван",
          last_name: "Иванов",
          phone: "77012345678",
          location_id: "location-123",
          comment: "Комментарий к записи",
        })
      );
    });
  });
});
