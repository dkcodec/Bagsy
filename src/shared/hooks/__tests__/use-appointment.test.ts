/**
 * Unit тесты для useCreateAppointment хука
 * Тестирование React Query мутации для создания записи
 */

import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { useCreateAppointment } from "../use-appointment";
import { appointmentService } from "@/shared/api/services";
import { toast } from "sonner";
import type {
  CreateAppointmentRequest,
  CreateAppointmentResponse,
} from "@/shared/api/types";

jest.mock("@/shared/api/services", () => ({
  appointmentService: {
    createAppointment: jest.fn(),
  },
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const mockedAppointmentService = appointmentService as jest.Mocked<
  typeof appointmentService
>;
const mockedToast = toast as jest.Mocked<typeof toast>;

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

describe("useCreateAppointment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validRequestData: CreateAppointmentRequest = {
    service_id: "service-123",
    start_at: "2024-01-15T10:00:00.000+05:00",
    employee_id: "emp-1",
    first_name: "Иван",
    last_name: "Иванов",
    phone: "77009876543",
    location_id: "location-123",
    comment: "Комментарий",
  };

  const validResponse: CreateAppointmentResponse = {
    id: "appointment-456",
  };

  describe("Структура хука", () => {
    it("должен возвращать корректную структуру мутации", () => {
      const { result } = renderHook(() => useCreateAppointment(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty("mutate");
      expect(result.current).toHaveProperty("mutateAsync");
      expect(result.current).toHaveProperty("isPending");
      expect(result.current).toHaveProperty("isError");
      expect(result.current).toHaveProperty("isSuccess");
      expect(result.current).toHaveProperty("data");
      expect(result.current).toHaveProperty("error");
    });

    it("должен иметь начальное состояние isPending = false", () => {
      const { result } = renderHook(() => useCreateAppointment(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);
    });
  });

  describe("Успешный вызов", () => {
    it("должен успешно вызвать createAppointment с правильными параметрами", async () => {
      mockedAppointmentService.createAppointment.mockResolvedValueOnce(
        validResponse
      );
      const { result } = renderHook(() => useCreateAppointment(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync(validRequestData);

      expect(mockedAppointmentService.createAppointment).toHaveBeenCalledTimes(
        1
      );
      expect(mockedAppointmentService.createAppointment).toHaveBeenCalledWith(
        validRequestData
      );
    });

    it("должен установить isSuccess в true после успешного вызова", async () => {
      mockedAppointmentService.createAppointment.mockResolvedValueOnce(
        validResponse
      );
      const { result } = renderHook(() => useCreateAppointment(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync(validRequestData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(result.current.data).toEqual(validResponse);
    });
  });

  describe("Обработка ошибок", () => {
    it("должен вызвать toast.error при ошибке с сообщением", async () => {
      const errorMessage = "Ошибка создания записи";
      const error = new Error(errorMessage);
      mockedAppointmentService.createAppointment.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useCreateAppointment(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync(validRequestData);
      } catch {
        // Ожидаем ошибку
      }

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    it("должен вызвать toast.error с сообщением по умолчанию при ошибке без сообщения", async () => {
      const error = new Error();
      mockedAppointmentService.createAppointment.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useCreateAppointment(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync(validRequestData);
      } catch {
        // Ожидаем ошибку
      }

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith(
          "Ошибка создания записи"
        );
      });
    });

    it("должен установить isError в true при ошибке", async () => {
      const error = new Error("Ошибка создания записи");
      mockedAppointmentService.createAppointment.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useCreateAppointment(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync(validRequestData);
      } catch {
        // Ожидаем ошибку
      }

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      expect(result.current.error).toEqual(error);
    });
  });

  describe("Интеграция с React Query", () => {
    it("должен вызвать onError callback при ошибке", async () => {
      const error = new Error("Ошибка создания записи");
      mockedAppointmentService.createAppointment.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useCreateAppointment(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync(validRequestData);
      } catch {
        // Ожидаем ошибку
      }

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalled();
      });
      expect(mockedToast.error).toHaveBeenCalledWith("Ошибка создания записи");
    });

    it("должен установить isPending в true во время выполнения", async () => {
      let resolvePromise: (value: CreateAppointmentResponse) => void;
      const promise = new Promise<CreateAppointmentResponse>(resolve => {
        resolvePromise = resolve;
      });
      mockedAppointmentService.createAppointment.mockReturnValueOnce(promise);
      const { result } = renderHook(() => useCreateAppointment(), {
        wrapper: createWrapper(),
      });

      result.current.mutateAsync(validRequestData);

      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      resolvePromise!(validResponse);
      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });
    });
  });
});
