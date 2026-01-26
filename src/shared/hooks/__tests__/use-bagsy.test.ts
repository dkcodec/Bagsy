/**
 * Unit тесты для useCreateBagsy хука
 * Тестирование React Query мутации для создания записи
 */

import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { useCreateBagsy } from "../use-bagsy";
import { bagsyService } from "@/shared/api/services";
import { toast } from "sonner";
import type {
  CreateBagsyRequest,
  CreateBagsyResponse,
} from "@/shared/api/types";

// Мокируем bagsyService
jest.mock("@/shared/api/services", () => ({
  bagsyService: {
    createBagsy: jest.fn(),
  },
}));

// Мокируем toast
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const mockedBagsyService = bagsyService as jest.Mocked<typeof bagsyService>;
const mockedToast = toast as jest.Mocked<typeof toast>;

// Вспомогательная функция для создания QueryClient и wrapper
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
}

describe("useCreateBagsy", () => {
  // Очищаем моки перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validRequestData: CreateBagsyRequest = {
    service_id: "service-123",
    start_at: "2024-01-15T10:00:00.000+05:00",
    master_phone: "77001234567",
    name: "Иван",
    surname: "Иванов",
    client_phone: "77009876543",
    comment: "Комментарий",
  };

  const validResponse: CreateBagsyResponse = {
    bagsy_id: "bagsy-456",
  };

  describe("Структура хука", () => {
    it("должен возвращать корректную структуру мутации", () => {
      // Arrange & Act
      const { result } = renderHook(() => useCreateBagsy(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current).toHaveProperty("mutate");
      expect(result.current).toHaveProperty("mutateAsync");
      expect(result.current).toHaveProperty("isPending");
      expect(result.current).toHaveProperty("isError");
      expect(result.current).toHaveProperty("isSuccess");
      expect(result.current).toHaveProperty("data");
      expect(result.current).toHaveProperty("error");
    });

    it("должен иметь начальное состояние isPending = false", () => {
      // Arrange & Act
      const { result } = renderHook(() => useCreateBagsy(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isPending).toBe(false);
    });
  });

  describe("Успешный вызов", () => {
    it("должен успешно вызвать createBagsy с правильными параметрами", async () => {
      // Arrange
      mockedBagsyService.createBagsy.mockResolvedValueOnce(validResponse);
      const { result } = renderHook(() => useCreateBagsy(), {
        wrapper: createWrapper(),
      });

      // Act
      await result.current.mutateAsync(validRequestData);

      // Assert
      expect(mockedBagsyService.createBagsy).toHaveBeenCalledTimes(1);
      expect(mockedBagsyService.createBagsy).toHaveBeenCalledWith(
        validRequestData
      );
    });

    it("должен установить isSuccess в true после успешного вызова", async () => {
      // Arrange
      mockedBagsyService.createBagsy.mockResolvedValueOnce(validResponse);
      const { result } = renderHook(() => useCreateBagsy(), {
        wrapper: createWrapper(),
      });

      // Act
      await result.current.mutateAsync(validRequestData);

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(result.current.data).toEqual(validResponse);
    });
  });

  describe("Обработка ошибок", () => {
    it("должен вызвать toast.error при ошибке с сообщением", async () => {
      // Arrange
      const errorMessage = "Ошибка создания брони";
      const error = new Error(errorMessage);
      mockedBagsyService.createBagsy.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useCreateBagsy(), {
        wrapper: createWrapper(),
      });

      // Act
      try {
        await result.current.mutateAsync(validRequestData);
      } catch (e) {
        // Ожидаем ошибку
      }

      // Assert
      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    it("должен вызвать toast.error с сообщением по умолчанию при ошибке без сообщения", async () => {
      // Arrange
      const error = new Error();
      mockedBagsyService.createBagsy.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useCreateBagsy(), {
        wrapper: createWrapper(),
      });

      // Act
      try {
        await result.current.mutateAsync(validRequestData);
      } catch (e) {
        // Ожидаем ошибку
      }

      // Assert
      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith("Ошибка создания брони");
      });
    });

    it("должен установить isError в true при ошибке", async () => {
      // Arrange
      const error = new Error("Ошибка создания брони");
      mockedBagsyService.createBagsy.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useCreateBagsy(), {
        wrapper: createWrapper(),
      });

      // Act
      try {
        await result.current.mutateAsync(validRequestData);
      } catch (e) {
        // Ожидаем ошибку
      }

      // Assert
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      expect(result.current.error).toEqual(error);
    });
  });

  describe("Интеграция с React Query", () => {
    it("должен вызвать onError callback при ошибке", async () => {
      // Arrange
      const error = new Error("Ошибка создания брони");
      mockedBagsyService.createBagsy.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useCreateBagsy(), {
        wrapper: createWrapper(),
      });

      // Act
      try {
        await result.current.mutateAsync(validRequestData);
      } catch (e) {
        // Ожидаем ошибку
      }

      // Assert
      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalled();
      });
      // Проверяем, что onError был вызван через toast.error
      expect(mockedToast.error).toHaveBeenCalledWith("Ошибка создания брони");
    });

    it("должен установить isPending в true во время выполнения", async () => {
      // Arrange
      let resolvePromise: (value: CreateBagsyResponse) => void;
      const promise = new Promise<CreateBagsyResponse>(resolve => {
        resolvePromise = resolve;
      });
      mockedBagsyService.createBagsy.mockReturnValueOnce(promise);
      const { result } = renderHook(() => useCreateBagsy(), {
        wrapper: createWrapper(),
      });

      // Act
      result.current.mutateAsync(validRequestData);

      // Assert
      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      // Завершаем промис
      resolvePromise!(validResponse);
      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });
    });
  });
});
