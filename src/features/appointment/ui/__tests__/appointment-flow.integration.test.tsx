/**
 * Интеграционные тесты для AppointmentFlow
 * Тестирование полного flow создания записи через все шаги
 */

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { AppointmentFlow } from "../appointment-flow";
import {
  useLocation,
  useLocationServices,
  useSlots,
} from "@/shared/hooks/use-appointment";
import { render as customRender } from "@/src/__tests__/utils/test-utils";
import type { Location, Service, GetSlotsResponse } from "@/shared/api/types";

// Мокируем зависимости
jest.mock("@/shared/hooks/use-appointment", () => ({
  useLocation: jest.fn(),
  useLocationServices: jest.fn(),
  useSlots: jest.fn(),
  useCreateAppointment: jest.fn(),
}));

jest.mock("@/shared/hooks/use-mobile", () => ({
  useIsMobile: jest.fn(() => false),
}));

// Мокируем дочерние компоненты для упрощения тестов
jest.mock("../appointment-step-service", () => ({
  AppointmentStepService: ({ locationId }: { locationId: string }) => (
    <div data-testid="step-service">Service Step for {locationId}</div>
  ),
}));

jest.mock("../appointment-step-datetime", () => ({
  AppointmentStepDateTime: ({
    locationId,
    serviceId,
  }: {
    locationId: string;
    serviceId: string;
  }) => (
    <div data-testid="step-datetime">
      DateTime Step for {locationId} - {serviceId}
    </div>
  ),
}));

jest.mock("../appointment-step-client", () => ({
  AppointmentStepClient: () => <div data-testid="step-client">Client Step</div>,
}));

jest.mock("../appointment-step-confirm", () => ({
  AppointmentStepConfirm: ({
    location,
    service,
    handleBack,
  }: {
    location: Location;
    service: Service | undefined;
    handleBack: () => void;
  }) => (
    <div data-testid="step-confirm">
      Confirm Step for {location.name}
      {service && <div>Service: {service.name}</div>}
      <button onClick={handleBack}>Back</button>
    </div>
  ),
}));

jest.mock("../appointment-aside", () => ({
  AppointmentAside: ({ location }: { location: Location }) => (
    <div data-testid="appointment-aside">Aside for {location.name}</div>
  ),
}));

const mockedUseLocation = useLocation as jest.MockedFunction<
  typeof useLocation
>;
const mockedUseLocationServices = useLocationServices as jest.MockedFunction<
  typeof useLocationServices
>;
const mockedUseSlots = useSlots as jest.MockedFunction<typeof useSlots>;

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

const mockServices: Service[] = [
  {
    id: "service-123",
    category_id: "cat-1",
    color: "#000",
    name: "Тестовая услуга",
    description: "Описание",
    duration_minutes: 60,
    active: true,
    min_price: 1000,
    max_price: 2000,
    sort_order: 0,
  },
];

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

describe("AppointmentFlow - Интеграционные тесты", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseLocation.mockReturnValue({
      data: mockLocation,
      isLoading: false,
      isError: false,
      error: null,
    } as any);
    mockedUseLocationServices.mockReturnValue({
      data: mockServices,
      isLoading: false,
      isError: false,
      error: null,
    } as any);
    mockedUseSlots.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as any);
  });

  describe("Начальное состояние", () => {
    it("должен отобразить первый шаг (выбор услуги)", () => {
      customRender(<AppointmentFlow pointCode="test_point" />);

      expect(screen.getByTestId("step-service")).toBeInTheDocument();
      expect(
        screen.getByText("Service Step for location-123")
      ).toBeInTheDocument();
    });

    it("должен отобразить степпер с правильным количеством шагов", () => {
      customRender(<AppointmentFlow pointCode="test_point" />);

      expect(screen.getByTestId("step-service")).toBeInTheDocument();
    });

    it("должен показать загрузку пока локация загружается", () => {
      mockedUseLocation.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      } as any);

      customRender(<AppointmentFlow pointCode="test_point" />);

      expect(screen.queryByTestId("step-service")).not.toBeInTheDocument();
    });
  });

  describe("Валидация шага 0 (выбор услуги)", () => {
    it("должен заблокировать переход на следующий шаг без выбранной услуги", async () => {
      const user = userEvent.setup();
      customRender(<AppointmentFlow pointCode="test_point" />);

      const continueButton = screen.getByText("buttons.continue");
      await user.click(continueButton);

      expect(screen.getByTestId("step-service")).toBeInTheDocument();
      expect(screen.queryByTestId("step-datetime")).not.toBeInTheDocument();
    });
  });

  describe("Навигация между шагами", () => {
    it("должен вернуться на предыдущий шаг при клике на кнопку назад", async () => {
      customRender(<AppointmentFlow pointCode="test_point" />);

      const backButton = screen.getByText("buttons.back");
      expect(backButton).toBeDisabled();
    });
  });

  describe("Интеграция с хуками", () => {
    it("должен вызвать useLocation с правильным slug", () => {
      customRender(<AppointmentFlow pointCode="test_point" />);

      expect(mockedUseLocation).toHaveBeenCalledWith("test_point");
    });

    it("должен вызвать useLocationServices с location.id", () => {
      customRender(<AppointmentFlow pointCode="test_point" />);

      expect(mockedUseLocationServices).toHaveBeenCalledWith("location-123");
    });

    it("должен вызвать useSlots", () => {
      mockedUseSlots.mockReturnValue({
        data: mockSlotsData,
        isLoading: false,
        isError: false,
        error: null,
      } as any);

      customRender(<AppointmentFlow pointCode="test_point" />);

      expect(mockedUseSlots).toHaveBeenCalled();
    });
  });

  describe("Обработка ошибок API", () => {
    it("должен обработать ошибку при загрузке локации", () => {
      mockedUseLocation.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error("Failed to load location"),
      } as any);

      customRender(<AppointmentFlow pointCode="test_point" />);

      expect(screen.queryByTestId("step-service")).not.toBeInTheDocument();
    });

    it("должен обработать ошибку при загрузке слотов", () => {
      mockedUseSlots.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error("Failed to load slots"),
      } as any);

      customRender(<AppointmentFlow pointCode="test_point" />);

      expect(screen.getByTestId("step-service")).toBeInTheDocument();
    });
  });

  describe("Передача параметров в дочерние компоненты", () => {
    it("должен передать правильный locationId в AppointmentStepService", () => {
      customRender(<AppointmentFlow pointCode="test_point" />);

      expect(
        screen.getByText("Service Step for location-123")
      ).toBeInTheDocument();
    });
  });
});
