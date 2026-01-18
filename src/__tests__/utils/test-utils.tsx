/**
 * Вспомогательные утилиты для тестирования
 * Провайдеры и функции для упрощения написания тестов
 */

import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";

// Создаем новый QueryClient для каждого теста (изоляция)
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Отключаем retry в тестах для быстрого фейла
        gcTime: 0, // Не кэшируем в тестах
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// Тип для кастомного рендера
interface AllTheProvidersProps {
  children: React.ReactNode;
  locale?: string;
}

/**
 * Провайдер со всеми необходимыми контекстами для тестов
 */
function AllTheProviders({ children, locale = "ru" }: AllTheProvidersProps) {
  const queryClient = createTestQueryClient();

  // Моковые переводы (можно расширить при необходимости)
  const messages = {
    AppointmentForm: {
      steps: {
        service: { title: "Выбор услуги" },
        datetime: { title: "Дата и время" },
        client: { title: "Данные клиента" },
        confirm: {
          title: "Подтверждение",
          business: "Бизнес",
          service: "Услуга",
          when: "Когда",
          master: "Мастер",
          client: "Клиент",
          confirmButton: "Подтвердить",
          creating: "Создание...",
        },
        otp: {
          title: "Подтверждение",
          description: "Введите код",
          codeLabel: "Код",
          resendCode: "Отправить код повторно",
        },
      },
      buttons: {
        back: "Назад",
        continue: "Продолжить",
      },
      errors: {
        serviceRequired: "Выберите услугу",
        dateRequired: "Выберите дату",
        timeRequired: "Выберите время",
        masterRequired: "Выберите мастера",
        nameRequired: "Введите имя",
        surnameRequired: "Введите фамилию",
        phoneRequired: "Введите телефон",
        phoneInvalid: "Неверный формат телефона",
        codeLength: "Код должен содержать 4 цифры",
        codeInvalid: "Неверный код",
        fillAllFields: "Заполните все поля",
      },
      success: {
        bagsyCreated: "Запись создана",
        bagsyConfirmed: "Запись подтверждена",
      },
    },
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextIntlClientProvider>
  );
}

/**
 * Кастомный рендер с провайдерами
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { locale?: string }
) {
  const { locale, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders locale={locale}>{children}</AllTheProviders>
    ),
    ...renderOptions,
  });
}

// Экспортируем все из @testing-library/react
export * from "@testing-library/react";
export { customRender as render };

// Экспортируем функцию для создания QueryClient
export { createTestQueryClient };
