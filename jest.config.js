const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Путь к Next.js приложению для загрузки next.config.js и .env файлов
  dir: "./",
});

// Кастомная конфигурация Jest
const customJestConfig = {
  // Тестовая среда
  testEnvironment: "jest-environment-jsdom",

  // Файлы для настройки перед запуском тестов
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Расширения файлов для тестирования
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  // Исключаем утилиты и файлы типов из тестов
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/.out/",
    "/__tests__/utils/",
    // Исключаем файлы типов TypeScript (.d.ts)
    ".*\\.d\\.ts$",
  ],

  // Трансформация модулей
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },

  // Игнорируемые паттерны для трансформации
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],

  // Моки для статических файлов и алиасы
  // Важно: более специфичные паттерны должны идти первыми
  moduleNameMapper: {
    "^@/entities/(.*)$": "<rootDir>/src/entities/$1",
    "^@/features/(.*)$": "<rootDir>/src/features/$1",
    "^@/widgets/(.*)$": "<rootDir>/src/widgets/$1",
    "^@/providers/(.*)$": "<rootDir>/src/providers/$1",
    "^@/shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@/styles/(.*)$": "<rootDir>/src/styles/$1",
    "^@/all-pages/(.*)$": "<rootDir>/src/all-pages/$1",
    "^@/src/(.*)$": "<rootDir>/src/$1",
    "^@/__tests__/(.*)$": "<rootDir>/src/__tests__/$1",
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  // Коллектор покрытия
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/**/__tests__/**",
  ],
};

// Создаем и экспортируем конфигурацию
module.exports = createJestConfig(customJestConfig);
