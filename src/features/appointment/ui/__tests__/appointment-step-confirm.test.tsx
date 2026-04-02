/**
 * Компонентные тесты для AppointmentStepConfirm
 * Тестирование компонента подтверждения записи
 */

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
import { AppointmentStepConfirm } from "../appointment-step-confirm";
import { useCreateAppointment } from "@/shared/hooks/use-appointment";
import { toast } from "sonner";
import type { Location, Service, GetSlotsResponse } from "@/shared/api/types";
import { render as customRender } from "@/src/__tests__/utils/test-utils";

// Мокируем зависимости
jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useFormContext: jest.fn(),
}));

jest.mock("@/shared/hooks/use-appointment", () => ({
  useCreateAppointment: jest.fn(),
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
  AppointmentStepOtp: ({ appointmentId }: { appointmentId: string }) => (
    <div data-testid="appointment-step-otp">OTP Step: {appointmentId}</div>
  ),
}));

const mockedUseFormContext = useFormContext as jest.MockedFunction<
  typeof useFormContext
>;
const mockedUseCreateAppointment = useCreateAppointment as jest.MockedFunction<
  typeof useCreateAppointment
>;
const mockedToast = toast as jest.Mocked<typeof toast>;

// Моковые данные
const mockLocation: Location = {
  active: true,
  address: { building: "1", city: "Алматы", details: "", street: "ул. Тест" },
  category_id: "cat-1",
  coordinates: { latitude: 43.238, longitude: 76.945 },
  created_at: "2024-01-01T00:00:00Z",
  description: "Тестовая локация",
  id: "location-123",
  name: "Тестовый салон",
  phone: "+77001234567",
  schedule: [],
  schedule_type: "weekly",
  slot_duration_minutes: 30,
  slug: "test_point",
};

const mockService: Service = {
  id: "service-123",
  category_id: "cat-1",
  color: "#000",
  name: "Тестовая услуга",
  description: "Описание услуги",
  duration_minutes: 60,
  active: true,
  min_price: 1000,
  max_price: 2000,
  sort_order: 0,
};

const mockSlotsData: GetSlotsResponse = {
  service_id: "service-123",
  location_id: "location-123",
  duration_minutes: 60,
  master_slots: [
    {
      employee_id: "emp-1",
      employee_name: "Иван Иванов",
      price: 1500,
      slots: [
        {
          start_at: "2024-01-15T10:00:00.000+05:00",
          end_at: "2024-01-15T11:00:00.000+05:00",
        },
        {
          start_at: "2024-01-15T11:00:00.000+05:00",
          end_at: "2024-01-15T12:00:00.000+05:00",
        },
      ],
    },
  ],
};

const mockFormValues = {
  service_id: "service-123",
  date: "2024-01-15",
  time: "10:00",
  employee_id: "emp-1",
  name: "Петр",
  surname: "Петров",
  client_phone: "+7 (700) 987-65-43",
  comment: "Комментарий",
  appointment_id: undefined,
  code: "",
} as {
  service_id?: string;
  date?: string;
  time?: string;
  employee_id?: string;
  name?: string;
  surname?: string;
  client_phone?: string;
  comment?: string;
  appointment_id?: string;
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
    mockMutation.isPending = false;
    mockMutation.isError = false;
    mockMutation.isSuccess = false;
    mockMutation.data = undefined;
    mockMutation.error = null;
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
    mockedUseCreateAppointment.mockReturnValue(mockMutation as any);
  });

  describe("Отображение данных записи", () => {
    it("должен отобразить бизнес (название локации)", () => {
      customRender(
        <AppointmentStepConfirm
          location={mockLocation}
          service={mockService}
          slotsData={mockSlotsData}
          handleBack={mockHandleBack}
        />
      );

      expect(screen.getByText("steps.confirm.business")).toBeInTheDocument();
      expect(screen.getByText("Тестовый салон")).toBeInTheDocument();
    });

    it("должен отобразить услугу", () => {
      customRender(
        <AppointmentStepConfirm
          location={mockLocation}
          service={mockService}
          slotsData={mockSlotsData}
          handleBack={mockHandleBack}
        />
      );

      expect(screen.getByText("steps.confirm.service")).toBeInTheDocument();
      expect(screen.getByText("Тестовая услуга")).toBeInTheDocument();
    });

    it("должен отобразить цену мастера", () => {
      customRender(
        <AppointmentStepConfirm
          location={mockLocation}
          service={mockService}
          slotsData={mockSlotsData}
          handleBack={mockHandleBack}
        />
      );

      expect(screen.getByText("1 500 ₸")).toBeInTheDocument();
    });

    it("должен отобразить дату и время", () => {
      customRender(
        <AppointmentStepConfirm
          location={mockLocation}
          service={mockService}
          slotsData={mockSlotsData}
          handleBack={mockHandleBack}
        />
      );

      expect(screen.getByText("steps.confirm.when")).toBeInTheDocument();
      expect(screen.getByText("10:00")).toBeInTheDocument();
    });

    it("должен отобразить мастера", () => {
      customRender(
        <AppointmentStepConfirm
          location={mockLocation}
          service={mockService}
          slotsData={mockSlotsData}
          handleBack={mockHandleBack}
        />
      );

      expect(screen.getByText("steps.confirm.master")).toBeInTheDocument();
      expect(screen.getByText("Иван Иванов")).toBeInTheDocument();
    });

    it("должен отобразить данные клиента", () => {
      customRender(
        <AppointmentStepConfirm
          location={mockLocation}
          service={mockService}
          slotsData={mockSlotsData}
          handleBack={mockHandleBack}
        />
      );

      expect(screen.getByText("steps.confirm.client")).toBeInTheDocument();
      expect(screen.getByText("Петр Петров")).toBeInTheDocument();
      expect(screen.getByText("+7 (700) 987-65-43")).toBeInTheDocument();
    });
  });

  describe("Успешное создание записи", () => {
    it("должен успешно создать запись при клике на кнопку подтверждения", async () => {
      const user = userEvent.setup();
      const mockResponse = { id: "appointment-456" };
      mockMutation.mutateAsync.mockResolvedValueOnce(mockResponse);

      customRender(
        <AppointmentStepConfirm
          location={mockLocation}
          service={mockService}
          slotsData={mockSlotsData}
          handleBack={mockHandleBack}
        />
      );

      const confirmButton = screen.getByText("steps.confirm.confirmButton");
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockMutation.mutateAsync).toHaveBeenCalledTimes(1);
      });
      expect(mockMutation.mutateAsync).toHaveBeenCalledWith({
        service_id: "service-123",
        start_at: "2024-01-15T10:00:00.000+05:00",
        employee_id: "emp-1",
        first_name: "Петр",
        last_name: "Петров",
        phone: "77009876543",
        location_id: "location-123",
        comment: "Комментарий",
      });
    });

    it("должен правильно сформировать start_at из date и time", async () => {
      const user = userEvent.setup();
      mockMutation.mutateAsync.mockResolvedValueOnce({ id: "appointment-456" });

      customRender(
        <AppointmentStepConfirm
          location={mockLocation}
          service={mockService}
          slotsData={mockSlotsData}
          handleBack={mockHandleBack}
        />
      );

      const confirmButton = screen.getByText("steps.confirm.confirmButton");
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockMutation.mutateAsync).toHaveBeenCalledWith(
          expect.objectContaining({
            start_at: "2024-01-15T10:00:00.000+05:00",
          })
        );
      });
    });

    it("должен очистить телефон от нецифровых символов", async () => {
      const user = userEvent.setup();
      mockGetValues.mockReturnValue({
        ...mockFormValues,
        client_phone: "+7 (700) 987-65-43",
      });
      mockMutation.mutateAsync.mockResolvedValueOnce({ id: "appointment-456" });

      customRender(
        <AppointmentStepConfirm
          location={mockLocation}
          service={mockService}
          slotsData={mockSlotsData}
          handleBack={mockHandleBack}
        />
      );

      const confirmButton = screen.getByText("steps.confirm.confirmButton");
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockMutation.mutateAsync).toHaveBeenCalledWith(
          expect.objectContaining({
            phone: "77009876543",
          })
        );
      });
    });

    it("должен сохранить appointment_id в форму после успешного создания", async () => {
      const user = userEvent.setup();
      const mockResponse = { id: "appointment-456" };
      mockMutation.mutateAsync.mockResolvedValueOnce(mockResponse);

      customRender(
        <AppointmentStepConfirm
          location={mockLocation}
          service={mockService}
          slotsData={mockSlotsData}
          handleBack={mockHandleBack}
        />
      );

      const confirmButton = screen.getByText("steps.confirm.confirmButton");
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockSetValue).toHaveBeenCalledWith(
          "appointment_id",
          "appointment-456"
        );
      });
    });

    it("должен показать OTP шаг после успешного создания", async () => {
      const user = userEvent.setup();
      mockMutation.mutateAsync.mockResolvedValueOnce({ id: "appointment-456" });

      customRender(
        <AppointmentStepConfirm
          location={mockLocation}
          service={mockService}
          slotsData={mockSlotsData}
          handleBack={mockHandleBack}
        />
      );

      const confirmButton = screen.getByText("steps.confirm.confirmButton");
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByTestId("appointment-step-otp")).toBeInTheDocument();
      });
    });

    it("должен показать toast.success при успешном создании", async () => {
      const user = userEvent.setup();
      mockMutation.mutateAsync.mockResolvedValueOnce({ id: "appointment-456" });

      customRender(
        <AppointmentStepConfirm
          location={mockLocation}
          service={mockService}
          slotsData={mockSlotsData}
          handleBack={mockHandleBack}
        />
      );

      const confirmButton = screen.getByText("steps.confirm.confirmButton");
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockedToast.success).toHaveBeenCalledWith(
          "success.bagsyCreated"
        );
      });
    });
  });

  describe("Валидация полей", () => {
    it("должен показать toast.error при незаполненных полях", async () => {
      const user = userEvent.setup();
      mockGetValues.mockReturnValue({
        ...mockFormValues,
        service_id: undefined,
      });

      customRender(
        <AppointmentStepConfirm
          location={mockLocation}
          service={mockService}
          slotsData={mockSlotsData}
          handleBack={mockHandleBack}
        />
      );

      const confirmButton = screen.getByText("steps.confirm.confirmButton");
      await user.click(confirmButton);

      expect(mockedToast.error).toHaveBeenCalledWith("errors.fillAllFields");
      expect(mockMutation.mutateAsync).not.toHaveBeenCalled();
    });
  });

  describe("Состояние загрузки", () => {
    it("должен заблокировать кнопку во время загрузки", () => {
      mockMutation.isPending = true;

      customRender(
        <AppointmentStepConfirm
          location={mockLocation}
          service={mockService}
          slotsData={mockSlotsData}
          handleBack={mockHandleBack}
        />
      );

      const confirmButton = screen.getByText("steps.confirm.creating");
      expect(confirmButton).toBeDisabled();
    });

    it("должен показать Loader2 во время загрузки", () => {
      mockMutation.isPending = true;

      customRender(
        <AppointmentStepConfirm
          location={mockLocation}
          service={mockService}
          slotsData={mockSlotsData}
          handleBack={mockHandleBack}
        />
      );

      expect(screen.getByText("steps.confirm.creating")).toBeInTheDocument();
    });
  });

  describe("Обработка ошибок", () => {
    it("должен обработать ошибку создания записи", async () => {
      const user = userEvent.setup();
      const error = new Error("Ошибка создания");
      mockGetValues.mockReturnValue(mockFormValues);
      mockMutation.mutateAsync.mockRejectedValueOnce(error);

      customRender(
        <AppointmentStepConfirm
          location={mockLocation}
          service={mockService}
          slotsData={mockSlotsData}
          handleBack={mockHandleBack}
        />
      );

      const confirmButton = screen.getByText("steps.confirm.confirmButton");
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockMutation.mutateAsync).toHaveBeenCalled();
      });
      expect(mockSetValue).not.toHaveBeenCalledWith(
        "appointment_id",
        expect.any(String)
      );
    });
  });

  describe("Навигация", () => {
    it("должен вызвать handleBack при клике на кнопку назад", async () => {
      const user = userEvent.setup();

      customRender(
        <AppointmentStepConfirm
          location={mockLocation}
          service={mockService}
          slotsData={mockSlotsData}
          handleBack={mockHandleBack}
        />
      );

      const backButton = screen.getByText("buttons.back");
      await user.click(backButton);

      expect(mockHandleBack).toHaveBeenCalledTimes(1);
    });
  });
});
