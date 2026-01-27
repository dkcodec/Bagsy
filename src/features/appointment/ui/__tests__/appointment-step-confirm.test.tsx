/**
 * Компонентные тесты для AppointmentStepConfirm
 * Тестирование компонента подтверждения записи
 */

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
import { AppointmentStepConfirm } from "../appointment-step-confirm";
import { useCreateBagsy } from "@/shared/hooks/use-bagsy";
import { toast } from "sonner";
import type { Service, GetDaySlotsResponse } from "@/shared/api/types";
import { render as customRender } from "@/src/__tests__/utils/test-utils";

// Мокируем зависимости
jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useFormContext: jest.fn(),
}));

jest.mock("@/shared/hooks/use-bagsy", () => ({
  useCreateBagsy: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/shared/utils/datetime", () => ({
  toStartAtISO: (d: string, t: string) => `${d}T${t}:00.000+05:00`,
}));

jest.mock("../appointment-step-otp", () => ({
  AppointmentStepOtp: ({ bagsyId }: { bagsyId: string }) => (
    <div data-testid="appointment-step-otp">OTP Step: {bagsyId}</div>
  ),
}));

const mockedUseFormContext = useFormContext as jest.MockedFunction<
  typeof useFormContext
>;
const mockedUseCreateBagsy = useCreateBagsy as jest.MockedFunction<
  typeof useCreateBagsy
>;
const mockedToast = toast as jest.Mocked<typeof toast>;

// Моковые данные
const mockService: Service = {
  id: "service-123",
  point_code: "test_point",
  category_id: 1,
  subcategory_id: 1,
  name: "Тестовая услуга",
  description: "Описание услуги",
  duration_minutes: 60,
  active: true,
  min_price: 1000,
  max_price: 2000,
};

const mockDaySlotsData: GetDaySlotsResponse = {
  service_id: "service-123",
  point_code: "test_point",
  date: "2024-01-15T00:00:00.000+05:00",
  duration_minutes: 60,
  masters: [
    {
      master_name: "Иван Иванов",
      master_phone: "+77001234567",
      master_service_price: 1500,
      slots: [
        "2024-01-15T10:00:00.000+05:00",
        "2024-01-15T11:00:00.000+05:00",
        "2024-01-15T12:00:00.000+05:00",
      ],
    },
  ],
};

const mockFormValues = {
  service_id: "service-123",
  date: "2024-01-15",
  time: "10:00",
  master_phone: "+77001234567",
  name: "Петр",
  surname: "Петров",
  client_phone: "+7 (700) 987-65-43",
  comment: "Комментарий",
  bagsy_id: undefined,
  code: "",
} as {
  service_id?: string;
  date?: string;
  time?: string;
  master_phone?: string;
  name?: string;
  surname?: string;
  client_phone?: string;
  comment?: string;
  bagsy_id?: string;
  code?: string;
};

describe("AppointmentStepConfirm", () => {
  const mockHandleBack = jest.fn();
  const mockSetValue = jest.fn();
  const mockGetValues = jest.fn(() => mockFormValues);

  const mockMutation = {
    mutateAsync: jest.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
    data: undefined,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Сбрасываем состояние мутации
    mockMutation.isPending = false;
    mockMutation.isError = false;
    mockMutation.isSuccess = false;
    mockMutation.data = undefined;
    mockMutation.error = null;
    // Сбрасываем мок функции mutateAsync
    mockMutation.mutateAsync.mockClear();
    mockedUseFormContext.mockReturnValue({
      getValues: mockGetValues,
      setValue: mockSetValue,
      watch: jest.fn(),
      control: {} as any,
      formState: {} as any,
      register: jest.fn(),
      unregister: jest.fn(),
      reset: jest.fn(),
      handleSubmit: jest.fn(),
      resetField: jest.fn(),
      setError: jest.fn(),
      clearErrors: jest.fn(),
      trigger: jest.fn(),
      getFieldState: jest.fn(),
      setFocus: jest.fn(),
    } as any);
    mockedUseCreateBagsy.mockReturnValue(mockMutation as any);
  });

  describe("Отображение данных записи", () => {
    it("должен отобразить бизнес (pointCode)", () => {
      // Arrange & Act
      customRender(
        <AppointmentStepConfirm
          pointCode="test_point_code"
          service={mockService}
          daySlotsData={mockDaySlotsData}
          handleBack={mockHandleBack}
        />
      );

      // Assert
      expect(screen.getByText("steps.confirm.business")).toBeInTheDocument();
      expect(screen.getByText("Test Point Code")).toBeInTheDocument();
    });

    it("должен отобразить услугу", () => {
      // Arrange & Act
      customRender(
        <AppointmentStepConfirm
          pointCode="test_point"
          service={mockService}
          daySlotsData={mockDaySlotsData}
          handleBack={mockHandleBack}
        />
      );

      // Assert
      expect(screen.getByText("steps.confirm.service")).toBeInTheDocument();
      expect(screen.getByText("Тестовая услуга")).toBeInTheDocument();
    });

    it("должен отобразить цену услуги мастера", () => {
      // Arrange & Act
      customRender(
        <AppointmentStepConfirm
          pointCode="test_point"
          service={mockService}
          daySlotsData={mockDaySlotsData}
          handleBack={mockHandleBack}
        />
      );

      // Assert
      expect(screen.getByText("1 500 ₸")).toBeInTheDocument();
    });

    it("должен отобразить дату и время", () => {
      // Arrange & Act
      customRender(
        <AppointmentStepConfirm
          pointCode="test_point"
          service={mockService}
          daySlotsData={mockDaySlotsData}
          handleBack={mockHandleBack}
        />
      );

      // Assert
      expect(screen.getByText("steps.confirm.when")).toBeInTheDocument();
      expect(screen.getByText("10:00")).toBeInTheDocument();
    });

    it("должен отобразить мастера", () => {
      // Arrange & Act
      customRender(
        <AppointmentStepConfirm
          pointCode="test_point"
          service={mockService}
          daySlotsData={mockDaySlotsData}
          handleBack={mockHandleBack}
        />
      );

      // Assert
      expect(screen.getByText("steps.confirm.master")).toBeInTheDocument();
      expect(screen.getByText("Иван Иванов")).toBeInTheDocument();
    });

    it("должен отобразить данные клиента", () => {
      // Arrange & Act
      customRender(
        <AppointmentStepConfirm
          pointCode="test_point"
          service={mockService}
          daySlotsData={mockDaySlotsData}
          handleBack={mockHandleBack}
        />
      );

      // Assert
      expect(screen.getByText("steps.confirm.client")).toBeInTheDocument();
      expect(screen.getByText("Петр Петров")).toBeInTheDocument();
      expect(screen.getByText("+7 (700) 987-65-43")).toBeInTheDocument();
    });
  });

  describe("Успешное создание записи", () => {
    it("должен успешно создать запись при клике на кнопку подтверждения", async () => {
      // Arrange
      const user = userEvent.setup();
      const mockResponse = { bagsy_id: "bagsy-456" };
      mockMutation.mutateAsync.mockResolvedValueOnce(mockResponse);

      customRender(
        <AppointmentStepConfirm
          pointCode="test_point"
          service={mockService}
          daySlotsData={mockDaySlotsData}
          handleBack={mockHandleBack}
        />
      );

      // Act
      const confirmButton = screen.getByText("steps.confirm.confirmButton");
      await user.click(confirmButton);

      // Assert
      await waitFor(() => {
        expect(mockMutation.mutateAsync).toHaveBeenCalledTimes(1);
      });
      expect(mockMutation.mutateAsync).toHaveBeenCalledWith({
        service_id: "service-123",
        start_at: "2024-01-15T10:00:00.000+05:00",
        master_phone: "+77001234567",
        name: "Петр",
        surname: "Петров",
        client_phone: "77009876543",
        comment: "Комментарий",
      });
    });

    it("должен правильно сформировать start_at из date и time", async () => {
      // Arrange
      const user = userEvent.setup();
      mockMutation.mutateAsync.mockResolvedValueOnce({ bagsy_id: "bagsy-456" });

      customRender(
        <AppointmentStepConfirm
          pointCode="test_point"
          service={mockService}
          daySlotsData={mockDaySlotsData}
          handleBack={mockHandleBack}
        />
      );

      // Act
      const confirmButton = screen.getByText("steps.confirm.confirmButton");
      await user.click(confirmButton);

      // Assert
      await waitFor(() => {
        expect(mockMutation.mutateAsync).toHaveBeenCalledWith(
          expect.objectContaining({
            start_at: "2024-01-15T10:00:00.000+05:00",
          })
        );
      });
    });

    it("должен очистить телефон от нецифровых символов", async () => {
      // Arrange
      const user = userEvent.setup();
      mockGetValues.mockReturnValue({
        ...mockFormValues,
        client_phone: "+7 (700) 987-65-43",
      });
      mockMutation.mutateAsync.mockResolvedValueOnce({ bagsy_id: "bagsy-456" });

      customRender(
        <AppointmentStepConfirm
          pointCode="test_point"
          service={mockService}
          daySlotsData={mockDaySlotsData}
          handleBack={mockHandleBack}
        />
      );

      // Act
      const confirmButton = screen.getByText("steps.confirm.confirmButton");
      await user.click(confirmButton);

      // Assert
      await waitFor(() => {
        expect(mockMutation.mutateAsync).toHaveBeenCalledWith(
          expect.objectContaining({
            client_phone: "77009876543",
          })
        );
      });
    });

    it("должен сохранить bagsy_id в форму после успешного создания", async () => {
      // Arrange
      const user = userEvent.setup();
      const mockResponse = { bagsy_id: "bagsy-456" };
      mockMutation.mutateAsync.mockResolvedValueOnce(mockResponse);

      customRender(
        <AppointmentStepConfirm
          pointCode="test_point"
          service={mockService}
          daySlotsData={mockDaySlotsData}
          handleBack={mockHandleBack}
        />
      );

      // Act
      const confirmButton = screen.getByText("steps.confirm.confirmButton");
      await user.click(confirmButton);

      // Assert
      await waitFor(() => {
        expect(mockSetValue).toHaveBeenCalledWith("bagsy_id", "bagsy-456");
      });
    });

    it("должен показать OTP шаг после успешного создания", async () => {
      // Arrange
      const user = userEvent.setup();
      mockMutation.mutateAsync.mockResolvedValueOnce({ bagsy_id: "bagsy-456" });

      customRender(
        <AppointmentStepConfirm
          pointCode="test_point"
          service={mockService}
          daySlotsData={mockDaySlotsData}
          handleBack={mockHandleBack}
        />
      );

      // Act
      const confirmButton = screen.getByText("steps.confirm.confirmButton");
      await user.click(confirmButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId("appointment-step-otp")).toBeInTheDocument();
      });
    });

    it("должен показать toast.success при успешном создании", async () => {
      // Arrange
      const user = userEvent.setup();
      mockMutation.mutateAsync.mockResolvedValueOnce({ bagsy_id: "bagsy-456" });

      customRender(
        <AppointmentStepConfirm
          pointCode="test_point"
          service={mockService}
          daySlotsData={mockDaySlotsData}
          handleBack={mockHandleBack}
        />
      );

      // Act
      const confirmButton = screen.getByText("steps.confirm.confirmButton");
      await user.click(confirmButton);

      // Assert
      await waitFor(() => {
        expect(mockedToast.success).toHaveBeenCalledWith(
          "success.bagsyCreated"
        );
      });
    });
  });

  describe("Валидация полей", () => {
    it("должен показать toast.error при незаполненных полях", async () => {
      // Arrange
      const user = userEvent.setup();
      mockGetValues.mockReturnValue({
        ...mockFormValues,
        service_id: undefined,
      });

      customRender(
        <AppointmentStepConfirm
          pointCode="test_point"
          service={mockService}
          daySlotsData={mockDaySlotsData}
          handleBack={mockHandleBack}
        />
      );

      // Act
      const confirmButton = screen.getByText("steps.confirm.confirmButton");
      await user.click(confirmButton);

      // Assert
      expect(mockedToast.error).toHaveBeenCalledWith("errors.fillAllFields");
      expect(mockMutation.mutateAsync).not.toHaveBeenCalled();
    });
  });

  describe("Состояние загрузки", () => {
    it("должен заблокировать кнопку во время загрузки", () => {
      // Arrange
      mockMutation.isPending = true;

      customRender(
        <AppointmentStepConfirm
          pointCode="test_point"
          service={mockService}
          daySlotsData={mockDaySlotsData}
          handleBack={mockHandleBack}
        />
      );

      // Assert
      const confirmButton = screen.getByText("steps.confirm.creating");
      expect(confirmButton).toBeDisabled();
    });

    it("должен показать Loader2 во время загрузки", () => {
      // Arrange
      mockMutation.isPending = true;

      customRender(
        <AppointmentStepConfirm
          pointCode="test_point"
          service={mockService}
          daySlotsData={mockDaySlotsData}
          handleBack={mockHandleBack}
        />
      );

      // Assert
      expect(screen.getByText("steps.confirm.creating")).toBeInTheDocument();
    });
  });

  describe("Обработка ошибок", () => {
    it("должен обработать ошибку создания записи", async () => {
      // Arrange
      const user = userEvent.setup();
      const error = new Error("Ошибка создания");
      // Убеждаемся, что mockGetValues возвращает правильные данные
      mockGetValues.mockReturnValue(mockFormValues);
      mockMutation.mutateAsync.mockRejectedValueOnce(error);

      customRender(
        <AppointmentStepConfirm
          pointCode="test_point"
          service={mockService}
          daySlotsData={mockDaySlotsData}
          handleBack={mockHandleBack}
        />
      );

      // Act
      const confirmButton = screen.getByText("steps.confirm.confirmButton");
      await user.click(confirmButton);

      // Assert
      await waitFor(() => {
        expect(mockMutation.mutateAsync).toHaveBeenCalled();
      });
      // Ошибка обрабатывается в хуке, здесь просто проверяем что не упало
      expect(mockSetValue).not.toHaveBeenCalledWith(
        "bagsy_id",
        expect.any(String)
      );
    });
  });

  describe("Форматирование", () => {
    it("должен правильно отформатировать pointCode (заглавные буквы)", () => {
      // Arrange & Act
      customRender(
        <AppointmentStepConfirm
          pointCode="test_point_code"
          service={mockService}
          daySlotsData={mockDaySlotsData}
          handleBack={mockHandleBack}
        />
      );

      // Assert
      expect(screen.getByText("Test Point Code")).toBeInTheDocument();
    });
  });

  describe("Навигация", () => {
    it("должен вызвать handleBack при клике на кнопку назад", async () => {
      // Arrange
      const user = userEvent.setup();

      customRender(
        <AppointmentStepConfirm
          pointCode="test_point"
          service={mockService}
          daySlotsData={mockDaySlotsData}
          handleBack={mockHandleBack}
        />
      );

      // Act
      const backButton = screen.getByText("buttons.back");
      await user.click(backButton);

      // Assert
      expect(mockHandleBack).toHaveBeenCalledTimes(1);
    });
  });
});
