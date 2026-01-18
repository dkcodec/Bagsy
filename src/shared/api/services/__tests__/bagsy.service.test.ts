/**
 * Unit тесты для bagsyService.createBagsy
 * Тестирование создания записи на прием
 */

import { bagsyService } from "../bagsy.service";
import { apiClient } from "../../client";
import type { CreateBagsyRequest, CreateBagsyResponse } from "../../types";

// Мокируем apiClient
jest.mock("../../client", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("bagsyService.createBagsy", () => {
  // Очищаем моки перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Валидные данные для создания записи
  const validRequestData: CreateBagsyRequest = {
    service_id: "0ff04d9f-72db-42d0-81f1-373706bff188",
    start_at: "2026-01-22T15:30:00Z",
    master_phone: "77012345111",
    name: "Иван",
    surname: "Иванов",
    client_phone: "77012345678",
    comment: "Комментарий к записи",
  };

  const validResponse: CreateBagsyResponse = {
    bagsy_id: "bagsy-456",
  };

  describe("Успешное создание записи", () => {
    it("должен успешно создать запись с валидными данными", async () => {
      // Arrange
      mockedApiClient.post.mockResolvedValueOnce(validResponse);

      // Act
      const result = await bagsyService.createBagsy(validRequestData);

      // Assert
      expect(result).toEqual(validResponse);
      expect(mockedApiClient.post).toHaveBeenCalledTimes(1);
      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "v1/bagsies",
        validRequestData
      );
    });

    it("должен правильно передать все обязательные поля", async () => {
      // Arrange
      const requestWithoutComment: CreateBagsyRequest = {
        service_id: "service-123",
        start_at: "2024-01-15T10:00:00Z",
        master_phone: "+77001234567",
        name: "Иван",
        surname: "Иванов",
        client_phone: "+77009876543",
      };
      mockedApiClient.post.mockResolvedValueOnce(validResponse);

      // Act
      await bagsyService.createBagsy(requestWithoutComment);

      // Assert
      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "v1/bagsies",
        requestWithoutComment
      );
    });

    it("должен правильно обработать опциональное поле comment", async () => {
      // Arrange
      mockedApiClient.post.mockResolvedValueOnce(validResponse);

      // Act
      await bagsyService.createBagsy(validRequestData);

      // Assert
      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "v1/bagsies",
        expect.objectContaining({
          comment: "Комментарий к записи",
        })
      );
    });

    it("должен правильно сформировать ISO формат start_at с Z окончанием", async () => {
      // Arrange
      const requestWithISO: CreateBagsyRequest = {
        ...validRequestData,
        start_at: "2026-01-22T15:30:00Z",
      };
      mockedApiClient.post.mockResolvedValueOnce(validResponse);

      // Act
      await bagsyService.createBagsy(requestWithISO);

      // Assert
      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "v1/bagsies",
        expect.objectContaining({
          start_at: "2026-01-22T15:30:00Z",
        })
      );
      // Проверяем, что формат соответствует ISO с Z
      expect(requestWithISO.start_at).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
      );
    });
  });

  describe("Обработка ошибок", () => {
    it("должен обработать ошибку 400 (невалидные данные)", async () => {
      // Arrange
      const error400 = new Error("Invalid request data") as Error & {
        status: number;
        body: unknown;
      };
      error400.status = 400;
      error400.body = { message: "Invalid request data" };
      mockedApiClient.post.mockRejectedValueOnce(error400);

      // Act & Assert
      await expect(bagsyService.createBagsy(validRequestData)).rejects.toThrow(
        "Invalid request data"
      );
      expect(mockedApiClient.post).toHaveBeenCalledTimes(1);
    });

    it("должен обработать ошибку 401 (неавторизован)", async () => {
      // Arrange
      const error401 = new Error("Unauthorized") as Error & {
        status: number;
        body: unknown;
      };
      error401.status = 401;
      error401.body = { message: "Unauthorized" };
      mockedApiClient.post.mockRejectedValueOnce(error401);

      // Act & Assert
      await expect(bagsyService.createBagsy(validRequestData)).rejects.toThrow(
        "Unauthorized"
      );
      expect(mockedApiClient.post).toHaveBeenCalledTimes(1);
    });

    it("должен обработать ошибку 500 (серверная ошибка)", async () => {
      // Arrange
      const error500 = new Error("Internal server error") as Error & {
        status: number;
        body: unknown;
      };
      error500.status = 500;
      error500.body = { message: "Internal server error" };
      mockedApiClient.post.mockRejectedValueOnce(error500);

      // Act & Assert
      await expect(bagsyService.createBagsy(validRequestData)).rejects.toThrow(
        "Internal server error"
      );
      expect(mockedApiClient.post).toHaveBeenCalledTimes(1);
    });

    it("должен обработать ошибку без сообщения", async () => {
      // Arrange
      const error = new Error("Request failed") as Error & {
        status: number;
        body: unknown;
      };
      error.status = 500;
      mockedApiClient.post.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(bagsyService.createBagsy(validRequestData)).rejects.toThrow(
        "Request failed"
      );
    });
  });

  describe("Правильная передача данных", () => {
    it("должен вызвать apiClient.post с правильным endpoint", async () => {
      // Arrange
      mockedApiClient.post.mockResolvedValueOnce(validResponse);

      // Act
      await bagsyService.createBagsy(validRequestData);

      // Assert
      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "v1/bagsies",
        expect.any(Object)
      );
    });

    it("должен передать все поля запроса в apiClient.post", async () => {
      // Arrange
      mockedApiClient.post.mockResolvedValueOnce(validResponse);

      // Act
      await bagsyService.createBagsy(validRequestData);

      // Assert
      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "v1/bagsies",
        expect.objectContaining({
          service_id: "0ff04d9f-72db-42d0-81f1-373706bff188",
          start_at: "2026-01-22T15:30:00Z",
          master_phone: "77012345111",
          name: "Иван",
          surname: "Иванов",
          client_phone: "77012345678",
          comment: "Комментарий к записи",
        })
      );
    });
  });
});
