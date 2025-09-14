import createMiddleware from 'next-intl/middleware';

// Поддерживаемые локали
export const locales = ['ru', 'kz'] as const;
export const defaultLocale = 'ru' as const;

export default createMiddleware({
  // Список поддерживаемых локалей
  locales,
  
  // Локаль по умолчанию
  defaultLocale
});

export const config = {
  // Применять middleware ко всем путям кроме статических файлов и API
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
