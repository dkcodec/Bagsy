import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale} from '../middleware';

export default getRequestConfig(async ({locale}) => {
  // Валидация локали
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});