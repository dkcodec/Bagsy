
import createMiddleware from 'next-intl/middleware';

export const locales = ['ru', 'kz'] as const;
export const defaultLocale = 'ru' as const;

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
});

export const config = {
  matcher: ['/', '/(ru|kz)/:path*'],
};
