/**
 * Unit тесты для RegisterStepTwo
 * Тестирование OTP ввода и кнопки повторной отправки
 */

import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterStepTwo } from "../register-step-two";
import { useForm, FormProvider } from "react-hook-form";

// Мок для InputOTP — рендерим простой input
jest.mock("@/entities/input-otp", () => ({
  InputOTP: ({
    children,
    value,
    onChange,
    maxLength,
  }: {
    children: React.ReactNode;
    value: string;
    onChange: (val: string) => void;
    maxLength: number;
  }) => (
    <div data-testid="input-otp">
      <input
        data-testid="otp-input"
        value={value}
        onChange={e => onChange(e.target.value.slice(0, maxLength))}
        maxLength={maxLength}
      />
      {children}
    </div>
  ),
  InputOTPGroup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  InputOTPSlot: ({ index }: { index: number }) => (
    <span data-testid={`otp-slot-${index}`} />
  ),
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    defaultValues: { code: "" },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("RegisterStepTwo", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const defaultProps = {
    phone: "77001234567",
    retryAfter: 60,
    onResend: jest.fn(),
    isResending: false,
  };

  describe("Отображение", () => {
    it("должен отображать описание подтверждения", () => {
      render(
        <Wrapper>
          <RegisterStepTwo {...defaultProps} />
        </Wrapper>
      );

      // useTranslations мок возвращает ключ, phone не интерполируется
      expect(screen.getByText("confirm.description")).toBeInTheDocument();
    });

    it("должен отображать OTP ввод", () => {
      render(
        <Wrapper>
          <RegisterStepTwo {...defaultProps} />
        </Wrapper>
      );

      expect(screen.getByTestId("input-otp")).toBeInTheDocument();
    });

    it("должен отображать 4 слота для OTP", () => {
      render(
        <Wrapper>
          <RegisterStepTwo {...defaultProps} />
        </Wrapper>
      );

      expect(screen.getByTestId("otp-slot-0")).toBeInTheDocument();
      expect(screen.getByTestId("otp-slot-1")).toBeInTheDocument();
      expect(screen.getByTestId("otp-slot-2")).toBeInTheDocument();
      expect(screen.getByTestId("otp-slot-3")).toBeInTheDocument();
    });

    it("должен отображать лейбл кода подтверждения", () => {
      render(
        <Wrapper>
          <RegisterStepTwo {...defaultProps} />
        </Wrapper>
      );

      expect(screen.getByText("fields.code.label")).toBeInTheDocument();
    });
  });

  describe("Кнопка повторной отправки", () => {
    it("должна быть disabled при retryAfter > 0", () => {
      render(
        <Wrapper>
          <RegisterStepTwo {...defaultProps} retryAfter={30} />
        </Wrapper>
      );

      const resendButton = screen.getByRole("button");
      expect(resendButton).toBeDisabled();
    });

    it("должна показывать текст resendIn при активном отсчёте", () => {
      render(
        <Wrapper>
          <RegisterStepTwo {...defaultProps} retryAfter={30} />
        </Wrapper>
      );

      // Мок useTranslations возвращает ключ без интерполяции
      expect(screen.getByText("buttons.resendIn")).toBeInTheDocument();
    });

    it("должна стать enabled когда отсчёт достигнет 0", () => {
      render(
        <Wrapper>
          <RegisterStepTwo {...defaultProps} retryAfter={2} />
        </Wrapper>
      );

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      const resendButton = screen.getByRole("button");
      expect(resendButton).not.toBeDisabled();
    });

    it("должна показывать текст 'Отправить повторно' когда отсчёт завершён", () => {
      render(
        <Wrapper>
          <RegisterStepTwo {...defaultProps} retryAfter={0} />
        </Wrapper>
      );

      expect(screen.getByText("buttons.resend")).toBeInTheDocument();
    });

    it("должна вызывать onResend при клике", async () => {
      const onResend = jest.fn();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Wrapper>
          <RegisterStepTwo
            {...defaultProps}
            retryAfter={0}
            onResend={onResend}
          />
        </Wrapper>
      );

      const resendButton = screen.getByRole("button");
      await user.click(resendButton);

      expect(onResend).toHaveBeenCalledTimes(1);
    });

    it("должна быть disabled при isResending = true", () => {
      render(
        <Wrapper>
          <RegisterStepTwo
            {...defaultProps}
            retryAfter={0}
            isResending={true}
          />
        </Wrapper>
      );

      const resendButton = screen.getByRole("button");
      expect(resendButton).toBeDisabled();
    });

    it("должна показывать лоадер при isResending", () => {
      render(
        <Wrapper>
          <RegisterStepTwo
            {...defaultProps}
            retryAfter={0}
            isResending={true}
          />
        </Wrapper>
      );

      expect(screen.getByText("buttons.submitting")).toBeInTheDocument();
    });
  });

  describe("Обновление retryAfter", () => {
    it("должна сбросить таймер при изменении retryAfter — кнопка снова disabled", () => {
      const { rerender } = render(
        <Wrapper>
          <RegisterStepTwo {...defaultProps} retryAfter={2} />
        </Wrapper>
      );

      // Дожидаемся окончания отсчёта
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      const resendButton = screen.getByRole("button");
      expect(resendButton).not.toBeDisabled();

      // Обновляем retryAfter — кнопка снова должна стать disabled
      rerender(
        <Wrapper>
          <RegisterStepTwo {...defaultProps} retryAfter={10} />
        </Wrapper>
      );

      expect(resendButton).toBeDisabled();
    });
  });
});
