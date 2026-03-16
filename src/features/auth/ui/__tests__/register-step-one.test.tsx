/**
 * Unit тесты для RegisterStepOne
 * Тестирование полей формы и выбора тарифа
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterStepOne } from "../register-step-one";
import { useForm, FormProvider } from "react-hook-form";
import type { PlanCode } from "@/shared/api/types";

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

function Wrapper({
  children,
  defaultPlan = "solo",
}: {
  children: React.ReactNode;
  defaultPlan?: PlanCode;
}) {
  const methods = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      password: "",
      confirmPassword: "",
      plan_code: defaultPlan,
      code: "",
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("RegisterStepOne", () => {
  describe("Отображение полей", () => {
    it("должен отображать заголовок шага", () => {
      render(
        <Wrapper>
          <RegisterStepOne />
        </Wrapper>
      );

      expect(screen.getByText("steps.step1.title")).toBeInTheDocument();
      expect(screen.getByText("steps.step1.subtitle")).toBeInTheDocument();
    });

    it("должен отображать поле имени", () => {
      render(
        <Wrapper>
          <RegisterStepOne />
        </Wrapper>
      );

      expect(screen.getByText("fields.name.label")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("fields.name.placeholder")
      ).toBeInTheDocument();
    });

    it("должен отображать поле фамилии", () => {
      render(
        <Wrapper>
          <RegisterStepOne />
        </Wrapper>
      );

      expect(screen.getByText("fields.surname.label")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("fields.surname.placeholder")
      ).toBeInTheDocument();
    });

    it("должен отображать поле телефона", () => {
      render(
        <Wrapper>
          <RegisterStepOne />
        </Wrapper>
      );

      expect(screen.getByText("fields.phone.label")).toBeInTheDocument();
      expect(screen.getByTestId("phone-input")).toBeInTheDocument();
    });

    it("должен отображать поле пароля", () => {
      render(
        <Wrapper>
          <RegisterStepOne />
        </Wrapper>
      );

      expect(screen.getByText("fields.password.label")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("fields.password.placeholder")
      ).toBeInTheDocument();
    });

    it("должен отображать поле подтверждения пароля", () => {
      render(
        <Wrapper>
          <RegisterStepOne />
        </Wrapper>
      );

      expect(
        screen.getByText("fields.confirmPassword.label")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("fields.confirmPassword.placeholder")
      ).toBeInTheDocument();
    });

    it("должен отображать лейбл тарифа", () => {
      render(
        <Wrapper>
          <RegisterStepOne />
        </Wrapper>
      );

      expect(screen.getByText("fields.planCode.label")).toBeInTheDocument();
    });

    it("должен отображать три карточки тарифов", () => {
      render(
        <Wrapper>
          <RegisterStepOne />
        </Wrapper>
      );

      expect(screen.getByText("plans.solo.name")).toBeInTheDocument();
      expect(screen.getByText("plans.point.name")).toBeInTheDocument();
      expect(screen.getByText("plans.network.name")).toBeInTheDocument();
    });

    it("должен отображать описания тарифов", () => {
      render(
        <Wrapper>
          <RegisterStepOne />
        </Wrapper>
      );

      expect(screen.getByText("plans.solo.description")).toBeInTheDocument();
      expect(screen.getByText("plans.point.description")).toBeInTheDocument();
      expect(
        screen.getByText("plans.network.description")
      ).toBeInTheDocument();
    });
  });

  describe("Выбор тарифа", () => {
    it("должен выделять тариф по умолчанию (solo)", () => {
      render(
        <Wrapper defaultPlan="solo">
          <RegisterStepOne />
        </Wrapper>
      );

      const soloButton = screen
        .getByText("plans.solo.name")
        .closest("button");
      expect(soloButton).toHaveClass("border-primary");
    });

    it("должен выделять предвыбранный тариф (point)", () => {
      render(
        <Wrapper defaultPlan="point">
          <RegisterStepOne />
        </Wrapper>
      );

      const pointButton = screen
        .getByText("plans.point.name")
        .closest("button");
      expect(pointButton).toHaveClass("border-primary");
    });

    it("должен менять выбранный тариф при клике", async () => {
      const user = userEvent.setup();

      render(
        <Wrapper defaultPlan="solo">
          <RegisterStepOne />
        </Wrapper>
      );

      const networkButton = screen
        .getByText("plans.network.name")
        .closest("button");
      await user.click(networkButton!);

      expect(networkButton).toHaveClass("border-primary");

      const soloButton = screen
        .getByText("plans.solo.name")
        .closest("button");
      expect(soloButton).toHaveClass("border-muted");
    });
  });

  describe("Ввод данных", () => {
    it("должен позволять вводить имя", async () => {
      const user = userEvent.setup();

      render(
        <Wrapper>
          <RegisterStepOne />
        </Wrapper>
      );

      const nameInput = screen.getByPlaceholderText("fields.name.placeholder");
      await user.type(nameInput, "Иван");

      expect(nameInput).toHaveValue("Иван");
    });

    it("должен позволять вводить фамилию", async () => {
      const user = userEvent.setup();

      render(
        <Wrapper>
          <RegisterStepOne />
        </Wrapper>
      );

      const surnameInput = screen.getByPlaceholderText(
        "fields.surname.placeholder"
      );
      await user.type(surnameInput, "Иванов");

      expect(surnameInput).toHaveValue("Иванов");
    });

    it("должен отображать поле пароля как password type", () => {
      render(
        <Wrapper>
          <RegisterStepOne />
        </Wrapper>
      );

      const passwordInput = screen.getByPlaceholderText(
        "fields.password.placeholder"
      );
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("должен отображать поле подтверждения пароля как password type", () => {
      render(
        <Wrapper>
          <RegisterStepOne />
        </Wrapper>
      );

      const confirmInput = screen.getByPlaceholderText(
        "fields.confirmPassword.placeholder"
      );
      expect(confirmInput).toHaveAttribute("type", "password");
    });
  });

  describe("Подсказки полей", () => {
    it("должен показывать подсказку для телефона", () => {
      render(
        <Wrapper>
          <RegisterStepOne />
        </Wrapper>
      );

      expect(screen.getByText("fields.phone.hint")).toBeInTheDocument();
    });

    it("должен показывать подсказку для пароля", () => {
      render(
        <Wrapper>
          <RegisterStepOne />
        </Wrapper>
      );

      expect(screen.getByText("fields.password.hint")).toBeInTheDocument();
    });

    it("должен показывать подсказку для подтверждения пароля", () => {
      render(
        <Wrapper>
          <RegisterStepOne />
        </Wrapper>
      );

      expect(
        screen.getByText("fields.confirmPassword.hint")
      ).toBeInTheDocument();
    });

    it("должен показывать подсказку для тарифа", () => {
      render(
        <Wrapper>
          <RegisterStepOne />
        </Wrapper>
      );

      expect(screen.getByText("fields.planCode.hint")).toBeInTheDocument();
    });
  });
});
