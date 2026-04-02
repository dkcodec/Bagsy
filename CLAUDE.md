# CLAUDE.md — Bagsy Project

## Overview

Bagsy — платформа онлайн-записи и CRM. Next.js 16 + React 19 + TypeScript, два языка (ru, kz).

## Quick Commands

```bash
bun --bun next dev       # Dev-сервер
next build               # Production-сборка
jest                     # Тесты
jest --watch             # Тесты в watch-режиме
jest --coverage          # Покрытие
eslint --fix             # Линтинг
prettier --write .       # Форматирование
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: shadcn/ui (Radix UI) + Tailwind CSS 4 + CSS Variables
- **Forms**: React Hook Form + Zod 4
- **Server state**: TanStack React Query v5
- **i18n**: next-intl (locales: `ru`, `kz`)
- **Icons**: Lucide React, Tabler Icons
- **Toasts**: Sonner
- **Testing**: Jest + React Testing Library
- **Git hooks**: Husky (pre-commit: format + test, pre-push: format:check + build)

## Architecture

Feature-based (FSD-подобная):

```
src/
├── features/       # Бизнес-фичи (auth, appointment, landing)
│   └── {feature}/
│       ├── ui/           # Компоненты фичи
│       │   └── __tests__/
│       └── index.ts      # Barrel export
├── entities/       # UI-примитивы (shadcn/ui компоненты)
├── widgets/        # Составные компоненты (branding, controls, forms)
├── shared/
│   ├── api/
│   │   ├── client.ts     # HttpClient с авто-refresh токенов
│   │   ├── services/     # API-сервисы (auth.service.ts, appointment.service.ts)
│   │   └── types.ts      # Типы API
│   ├── hooks/            # Кастомные хуки (use-appointment, use-mobile, use-disclosure)
│   ├── utils/            # Утилиты (cookies, datetime, jwt, cn())
│   ├── constants.ts
│   └── types.ts
├── providers/      # QueryProvider, ThemeProvider
└── styles/         # shadcn.css (тема, переменные, брейкпоинты)

app/
├── api/            # API routes (appointments, invites, auth)
└── [locale]/       # i18n-роутинг
    ├── (auth)/         # Регистрация
    ├── (landing)/      # Лендинг
    ├── (policies)/     # Политики
    └── appointment/    # Запись

i18n/               # Конфиг next-intl (routing, request, navigation)
messages/           # Переводы (ru.json, kz.json)
```

## Conventions

### Naming

| Что               | Формат                               | Пример                              |
| ----------------- | ------------------------------------ | ----------------------------------- |
| Файлы компонентов | kebab-case                           | `appointment-flow.tsx`              |
| Сервисы           | `*.service.ts`                       | `auth.service.ts`                   |
| Тесты             | `__tests__/*.test.tsx`               | `__tests__/register-form.test.tsx`  |
| React-компоненты  | PascalCase                           | `AppointmentFlow`                   |
| Props             | `{Name}Props`                        | `AppointmentFlowProps`              |
| Хуки              | `use{Feature}`                       | `useLocation()`, `useCreateAppointment()` |
| API типы          | `{Action}{Resource}Request/Response` | `CreateAppointmentRequest`                |

### Patterns

**API-вызовы**: Сервис → React Query хук → Компонент

```typescript
// 1. Сервис (src/shared/api/services/)
appointmentService.getLocation(slug);
appointmentService.getServices(locationId);
appointmentService.getSlots(data);

// 2. Хук (src/shared/hooks/)
const { data: location } = useLocation(slug);
const { data: services } = useLocationServices(location?.id);
const { data: slots } = useSlots({ location_id, service_id, start_date, end_date });

// 3. Компонент использует хук
```

**API эндпоинты записи**:

| Метод | Путь | Описание |
| ----- | ---- | -------- |
| GET | `/v1/locations/slug/{slug}` | Локация по slug + расписание |
| GET | `/v1/services/{locationId}` | Услуги локации |
| POST | `/v1/appointments/slots` | Доступные слоты (по сотрудникам) |
| POST | `/v1/appointments` | Создание записи |
| POST | `/v1/appointments/{id}/confirm` | Подтверждение OTP |
| POST | `/v1/appointments/{id}/resend-otp` | Повторная отправка кода |

**Формы**: Многошаговые с Zod superRefine

```typescript
const schema = z.object({...}).superRefine((data, ctx) => {
  if (currentStep === 0) { /* валидация шага 0 */ }
})
```

**Стили**: Tailwind + `cn()` для мёржа классов

```typescript
import { cn } from "@/shared/utils/styles"
<div className={cn("base-class", condition && "conditional-class")} />
```

**Переводы**:

```typescript
const t = useTranslations("namespace");
// Ключи добавлять в messages/ru.json и messages/kz.json
```

## Key Files

| Файл                       | Назначение                                        |
| -------------------------- | ------------------------------------------------- |
| `src/shared/api/client.ts` | HTTP-клиент с token refresh и обработкой 401      |
| `proxy.ts`                 | Middleware next-intl (не прокси-сервер)           |
| `components.json`          | Конфиг shadcn/ui для генерации компонентов        |
| `jest.setup.js`            | Моки браузерных API + next/navigation + next-intl |
| `src/styles/shadcn.css`    | CSS-переменные темы, кастомные брейкпоинты        |

## Environment Variables

```env
NEXT_PUBLIC_API_URL    # URL бэкенда (e.g. http://localhost:3001/api)
NEXT_PUBLIC_DOMAIN     # Домен сайта (e.g. https://bagsy.kz)
```

## Testing

- Тесты рядом с кодом в `__tests__/` папках
- Моки сервисов и хуков через `jest.mock()`
- Описания тестов на русском языке
- Паттерн: Arrange → Act → Assert
- `jest.setup.js` мокает: `matchMedia`, `ResizeObserver`, `IntersectionObserver`, `useRouter`, `useTranslations`, `toast`

## Before Committing

Pre-commit хуки запускают автоматически:

1. `bun format` — форматирование
2. `bun run test` — тесты

Pre-push:

1. `bun run format:check`
2. `bun run build`
