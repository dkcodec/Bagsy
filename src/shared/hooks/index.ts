/**
 * Экспорты хуков
 * Централизованный импорт для всех хуков
 *
 * Примечание: use-mobile-server не экспортируется здесь,
 * так как это серверная функция (использует next/headers).
 * Импортируйте её напрямую в Server Components:
 * import { getIsMobile } from "@/shared/hooks/use-mobile-server";
 */

export * from "./use-disclosure";
export * from "./use-mobile";
export * from "./use-bagsy";
