/**
 * Unit тесты для хуков регистрации
 * Тестирование useRegister, useRegisterResend, useRegisterVerify
 */

import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import {
  useRegister,
  useRegisterResend,
  useRegisterVerify,
} from "../use-register";
import { authService } from "@/shared/api/services";
import { setAuthTokens } from "@/shared/utils/cookies";
import { toast } from "sonner";
import type {
  RegisterRequest,
  RegisterResponse,
  RegisterResendRequest,
  RegisterResendResponse,
  RegisterVerifyRequest,
  RegisterVerifyResponse,
} from "@/shared/api/types";

jest.mock("@/shared/api/services", () => ({
  authService: {
    register: jest.fn(),
    resend: jest.fn(),
    verify: jest.fn(),
  },
}));

jest.mock("@/shared/utils/cookies", () => ({
  setAuthTokens: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const mockedAuthService = authService as jest.Mocked<typeof authService>;
const mockedToast = toast as jest.Mocked<typeof toast>;
const mockedSetAuthTokens = setAuthTokens as jest.MockedFunction<
  typeof setAuthTokens
>;

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

describe("useRegister", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validRequest: RegisterRequest = {
    first_name: "Иван",
    last_name: "Иванов",
    phone: "77001234567",
    password: "password123",
    plan_code: "solo",
  };

  const validResponse: RegisterResponse = {
    expires_in: 300,
    message: "Код отправлен",
    phone: "77001234567",
    retry_after: 60,
  };

  describe("Структура хука", () => {
    it("должен возвращать корректную структуру мутации", () => {
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty("mutate");
      expect(result.current).toHaveProperty("mutateAsync");
      expect(result.current).toHaveProperty("isPending");
      expect(result.current).toHaveProperty("isError");
      expect(result.current).toHaveProperty("isSuccess");
    });

    it("должен иметь начальное состояние isPending = false", () => {
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);
    });
  });

  describe("Успешный вызов", () => {
    it("должен вызвать authService.register с правильными параметрами", async () => {
      mockedAuthService.register.mockResolvedValueOnce(validResponse);
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync(validRequest);

      expect(mockedAuthService.register).toHaveBeenCalledTimes(1);
      expect(mockedAuthService.register).toHaveBeenCalledWith(validRequest);
    });

    it("должен вернуть данные с retry_after и expires_in", async () => {
      mockedAuthService.register.mockResolvedValueOnce(validResponse);
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(validRequest);

      expect(response).toEqual(validResponse);
      expect(response.retry_after).toBe(60);
      expect(response.phone).toBe("77001234567");
    });

    it("должен установить isSuccess в true после успешного вызова", async () => {
      mockedAuthService.register.mockResolvedValueOnce(validResponse);
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync(validRequest);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });

  describe("Обработка ошибок", () => {
    it("должен вызвать toast.error при ошибке с сообщением", async () => {
      const error = new Error("Пользователь уже существует");
      mockedAuthService.register.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync(validRequest);
      } catch {
        // Ожидаем ошибку
      }

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith(
          "Пользователь уже существует"
        );
      });
    });

    it("должен вызвать toast.error с сообщением по умолчанию при ошибке без сообщения", async () => {
      const error = new Error();
      mockedAuthService.register.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync(validRequest);
      } catch {
        // Ожидаем ошибку
      }

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith("errors.register");
      });
    });

    it("должен установить isError в true при ошибке", async () => {
      const error = new Error("Ошибка");
      mockedAuthService.register.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync(validRequest);
      } catch {
        // Ожидаем ошибку
      }

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe("Состояние isPending", () => {
    it("должен установить isPending в true во время выполнения", async () => {
      let resolvePromise: (value: RegisterResponse) => void;
      const promise = new Promise<RegisterResponse>(resolve => {
        resolvePromise = resolve;
      });
      mockedAuthService.register.mockReturnValueOnce(promise);
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      result.current.mutateAsync(validRequest);

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

describe("useRegisterResend", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validRequest: RegisterResendRequest = {
    phone: "77001234567",
  };

  const validResponse: RegisterResendResponse = {
    expires_in: 300,
    message: "Код отправлен повторно",
    retry_after: 60,
  };

  describe("Структура хука", () => {
    it("должен возвращать корректную структуру мутации", () => {
      const { result } = renderHook(() => useRegisterResend(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty("mutate");
      expect(result.current).toHaveProperty("mutateAsync");
      expect(result.current).toHaveProperty("isPending");
    });
  });

  describe("Успешный вызов", () => {
    it("должен вызвать authService.resend с правильными параметрами", async () => {
      mockedAuthService.resend.mockResolvedValueOnce(validResponse);
      const { result } = renderHook(() => useRegisterResend(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync(validRequest);

      expect(mockedAuthService.resend).toHaveBeenCalledTimes(1);
      expect(mockedAuthService.resend).toHaveBeenCalledWith(validRequest);
    });

    it("должен показать toast.success при успехе", async () => {
      mockedAuthService.resend.mockResolvedValueOnce(validResponse);
      const { result } = renderHook(() => useRegisterResend(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync(validRequest);

      await waitFor(() => {
        expect(mockedToast.success).toHaveBeenCalledWith("success.codeResent");
      });
    });

    it("должен вернуть retry_after из ответа", async () => {
      mockedAuthService.resend.mockResolvedValueOnce(validResponse);
      const { result } = renderHook(() => useRegisterResend(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(validRequest);

      expect(response.retry_after).toBe(60);
    });
  });

  describe("Обработка ошибок", () => {
    it("должен вызвать toast.error при ошибке", async () => {
      const error = new Error("Слишком рано для повторной отправки");
      mockedAuthService.resend.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useRegisterResend(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync(validRequest);
      } catch {
        // Ожидаем ошибку
      }

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith(
          "Слишком рано для повторной отправки"
        );
      });
    });

    it("должен вызвать toast.error с сообщением по умолчанию", async () => {
      const error = new Error();
      mockedAuthService.resend.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useRegisterResend(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync(validRequest);
      } catch {
        // Ожидаем ошибку
      }

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith("errors.resend");
      });
    });
  });
});

describe("useRegisterVerify", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).location;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).location = { href: "" };
  });

  const validRequest: RegisterVerifyRequest = {
    phone: "77001234567",
    code: "1234",
  };

  const validResponse: RegisterVerifyResponse = {
    access_token: "access-token-123",
    refresh_token: "refresh-token-456",
  };

  describe("Структура хука", () => {
    it("должен возвращать корректную структуру мутации", () => {
      const { result } = renderHook(() => useRegisterVerify(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty("mutate");
      expect(result.current).toHaveProperty("mutateAsync");
      expect(result.current).toHaveProperty("isPending");
    });
  });

  describe("Успешный вызов", () => {
    it("должен вызвать authService.verify с правильными параметрами", async () => {
      mockedAuthService.verify.mockResolvedValueOnce(validResponse);
      const { result } = renderHook(() => useRegisterVerify(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync(validRequest);

      expect(mockedAuthService.verify).toHaveBeenCalledTimes(1);
      expect(mockedAuthService.verify).toHaveBeenCalledWith(validRequest);
    });

    it("должен вызвать setAuthTokens с правильными токенами", async () => {
      mockedAuthService.verify.mockResolvedValueOnce(validResponse);
      const { result } = renderHook(() => useRegisterVerify(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync(validRequest);

      await waitFor(() => {
        expect(mockedSetAuthTokens).toHaveBeenCalledWith(
          "access-token-123",
          "refresh-token-456"
        );
      });
    });

    it("должен показать toast.success при успехе", async () => {
      mockedAuthService.verify.mockResolvedValueOnce(validResponse);
      const { result } = renderHook(() => useRegisterVerify(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync(validRequest);

      await waitFor(() => {
        expect(mockedToast.success).toHaveBeenCalledWith(
          "success.registration"
        );
      });
    });

    it("должен выполнить редирект после успешной верификации", async () => {
      mockedAuthService.verify.mockResolvedValueOnce(validResponse);
      const { result } = renderHook(() => useRegisterVerify(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync(validRequest);

      await waitFor(() => {
        expect(window.location.href).toContain("/ru/login");
      });
    });
  });

  describe("Обработка ошибок", () => {
    it("должен вызвать toast.error при неверном коде", async () => {
      const error = new Error("Неверный код");
      mockedAuthService.verify.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useRegisterVerify(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync(validRequest);
      } catch {
        // Ожидаем ошибку
      }

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith("Неверный код");
      });
    });

    it("не должен вызывать setAuthTokens при ошибке", async () => {
      const error = new Error("Неверный код");
      mockedAuthService.verify.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useRegisterVerify(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync(validRequest);
      } catch {
        // Ожидаем ошибку
      }

      expect(mockedSetAuthTokens).not.toHaveBeenCalled();
    });

    it("должен вызвать toast.error с сообщением по умолчанию", async () => {
      const error = new Error();
      mockedAuthService.verify.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useRegisterVerify(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync(validRequest);
      } catch {
        // Ожидаем ошибку
      }

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith("errors.confirm");
      });
    });
  });
});
