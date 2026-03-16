/**
 * Unit тесты для RegisterForm
 * Тестирование многошаговой формы регистрации
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "../register-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Мок для хуков регистрации
const mockRegisterMutateAsync = jest.fn();
const mockResendMutateAsync = jest.fn();
const mockVerifyMutateAsync = jest.fn();

jest.mock("@/shared/hooks/use-register", () => ({
  useRegister: () => ({
    mutateAsync: mockRegisterMutateAsync,
    isPending: false,
  }),
  useRegisterResend: () => ({
    mutateAsync: mockResendMutateAsync,
    isPending: false,
  }),
  useRegisterVerify: () => ({
    mutateAsync: mockVerifyMutateAsync,
    isPending: false,
  }),
}));

// Мок для PhoneInput
jest.mock("@/widgets/forms/phone-input", () => ({
  PhoneInput: ({
    placeholder,
    value,
    onChange,
  }: {
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
  }) => (
    <input
      data-testid="phone-input"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  ),
}));

// Мок для InputOTP
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

// Мок для Stepper
jest.mock("@/entities/stepper", () => ({
  Stepper: ({
    steps,
    currentStep,
  }: {
    steps: Array<{ label: string }>;
    currentStep: number;
  }) => (
    <div data-testid="stepper" data-current-step={currentStep}>
      {steps.map((step, i) => (
        <span key={i} data-testid={`step-${i}`}>
          {step.label}
        </span>
      ))}
    </div>
  ),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
}

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Рендер формы", () => {
    it("должен отображать заголовок и описание", () => {
      render(<RegisterForm />, { wrapper: createWrapper() });

      expect(screen.getByText("title")).toBeInTheDocument();
      expect(screen.getByText("description")).toBeInTheDocument();
    });

    it("должен отображать степпер с 2 шагами", () => {
      render(<RegisterForm />, { wrapper: createWrapper() });

      const stepper = screen.getByTestId("stepper");
      expect(stepper).toBeInTheDocument();
      expect(screen.getByTestId("step-0")).toBeInTheDocument();
      expect(screen.getByTestId("step-1")).toBeInTheDocument();
    });

    it("должен начинать с шага 0", () => {
      render(<RegisterForm />, { wrapper: createWrapper() });

      const stepper = screen.getByTestId("stepper");
      expect(stepper).toHaveAttribute("data-current-step", "0");
    });
  });

  describe("Шаг 0 — Данные пользователя", () => {
    it("должен отображать все поля формы", () => {
      render(<RegisterForm />, { wrapper: createWrapper() });

      expect(screen.getByText("fields.name.label")).toBeInTheDocument();
      expect(screen.getByText("fields.surname.label")).toBeInTheDocument();
      expect(screen.getByText("fields.phone.label")).toBeInTheDocument();
      expect(screen.getByText("fields.password.label")).toBeInTheDocument();
      expect(
        screen.getByText("fields.confirmPassword.label")
      ).toBeInTheDocument();
      expect(screen.getByText("fields.planCode.label")).toBeInTheDocument();
    });

    it("должен отображать 3 карточки тарифов", () => {
      render(<RegisterForm />, { wrapper: createWrapper() });

      expect(screen.getByText("plans.solo.name")).toBeInTheDocument();
      expect(screen.getByText("plans.point.name")).toBeInTheDocument();
      expect(screen.getByText("plans.network.name")).toBeInTheDocument();
    });

    it("должен выбрать тариф solo по умолчанию", () => {
      render(<RegisterForm />, { wrapper: createWrapper() });

      const soloButton = screen.getByText("plans.solo.name").closest("button");
      expect(soloButton).toHaveClass("border-primary");
    });

    it("должен предвыбрать тариф из пропса defaultPlan", () => {
      render(<RegisterForm defaultPlan="network" />, {
        wrapper: createWrapper(),
      });

      const networkButton = screen
        .getByText("plans.network.name")
        .closest("button");
      expect(networkButton).toHaveClass("border-primary");
    });

    it("должен использовать solo при невалидном defaultPlan", () => {
      render(<RegisterForm defaultPlan="invalid" />, {
        wrapper: createWrapper(),
      });

      const soloButton = screen.getByText("plans.solo.name").closest("button");
      expect(soloButton).toHaveClass("border-primary");
    });

    it("должен отображать кнопку 'Продолжить'", () => {
      render(<RegisterForm />, { wrapper: createWrapper() });

      expect(screen.getByText("buttons.continue")).toBeInTheDocument();
    });

    it("должен отображать disabled кнопку 'Назад' на первом шаге", () => {
      render(<RegisterForm />, { wrapper: createWrapper() });

      const backButton = screen.getByText("buttons.back").closest("button");
      expect(backButton).toBeDisabled();
    });
  });

  describe("Смена тарифа", () => {
    it("должен менять тариф при клике на другую карточку", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />, { wrapper: createWrapper() });

      const pointButton = screen
        .getByText("plans.point.name")
        .closest("button");
      await user.click(pointButton!);

      expect(pointButton).toHaveClass("border-primary");
      const soloButton = screen.getByText("plans.solo.name").closest("button");
      expect(soloButton).toHaveClass("border-muted");
    });
  });

  describe("Переход между шагами", () => {
    it("должен вызвать registerMutateAsync при сабмите с правильными данными", async () => {
      const user = userEvent.setup();
      mockRegisterMutateAsync.mockResolvedValueOnce({
        expires_in: 300,
        message: "OK",
        phone: "77001234567",
        retry_after: 60,
      });

      render(<RegisterForm />, { wrapper: createWrapper() });

      // Заполняем обязательные поля
      await user.type(
        screen.getByPlaceholderText("fields.name.placeholder"),
        "Иван"
      );
      await user.type(
        screen.getByPlaceholderText("fields.surname.placeholder"),
        "Иванов"
      );
      await user.type(screen.getByTestId("phone-input"), "+77001234567");
      await user.type(
        screen.getByPlaceholderText("fields.password.placeholder"),
        "password123"
      );
      await user.type(
        screen.getByPlaceholderText("fields.confirmPassword.placeholder"),
        "password123"
      );

      // Сабмит формы
      const submitButton = screen
        .getByText("buttons.continue")
        .closest("button");
      await user.click(submitButton!);

      // Ждём вызова мутации — zod валидация может быть асинхронной
      await waitFor(() => {
        expect(mockRegisterMutateAsync).toHaveBeenCalledTimes(1);
      });

      // Проверяем что мутация вызвана с правильными данными
      expect(mockRegisterMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: "Иван",
          last_name: "Иванов",
          password: "password123",
          plan_code: "solo",
        })
      );

      // После успеха должен показаться OTP шаг
      await waitFor(() => {
        expect(screen.getByTestId("input-otp")).toBeInTheDocument();
      });

      // Кнопка "Подтвердить" вместо "Продолжить"
      expect(screen.getByText("buttons.confirm")).toBeInTheDocument();
      expect(screen.queryByText("buttons.continue")).not.toBeInTheDocument();
    });

    it("не должен вызывать registerMutateAsync если confirmPassword не совпадает", async () => {
      const user = userEvent.setup();

      render(<RegisterForm />, { wrapper: createWrapper() });

      await user.type(
        screen.getByPlaceholderText("fields.name.placeholder"),
        "Иван"
      );
      await user.type(
        screen.getByPlaceholderText("fields.surname.placeholder"),
        "Иванов"
      );
      await user.type(screen.getByTestId("phone-input"), "+77001234567");
      await user.type(
        screen.getByPlaceholderText("fields.password.placeholder"),
        "password123"
      );
      await user.type(
        screen.getByPlaceholderText("fields.confirmPassword.placeholder"),
        "different456"
      );

      const submitButton = screen
        .getByText("buttons.continue")
        .closest("button");
      await user.click(submitButton!);

      // Даём время для валидации
      await new Promise(resolve => setTimeout(resolve, 100));

      // Мутация НЕ должна быть вызвана — валидация не пройдена
      expect(mockRegisterMutateAsync).not.toHaveBeenCalled();
    });
  });

  describe("Кнопки навигации", () => {
    it("кнопка 'Назад' должна быть disabled на шаге 0", () => {
      render(<RegisterForm />, { wrapper: createWrapper() });

      const backButton = screen.getByText("buttons.back").closest("button");
      expect(backButton).toBeDisabled();
    });

    it("кнопка 'Продолжить' должна быть типа submit", () => {
      render(<RegisterForm />, { wrapper: createWrapper() });

      const submitButton = screen
        .getByText("buttons.continue")
        .closest("button");
      expect(submitButton).toHaveAttribute("type", "submit");
    });
  });
});
