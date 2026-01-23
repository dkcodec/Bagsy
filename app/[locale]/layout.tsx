import { routing, defaultLocale } from "@/i18n/routing";
import { localeToHreflang, ogLocaleMap } from "@/src/shared/constants";
import type { Metadata } from "next";
import { hasLocale, Locale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata(
  props: Omit<LayoutProps<"/[locale]">, "children">
) {
  const { locale } = await props.params;

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "LocaleLayout",
  });

  const base = process.env.NEXT_PUBLIC_DOMAIN || "https://bagsy.kz";
  const baseNormalized = base.replace(/\/+$/, "");

  // Canonical для главной страницы (вложенные страницы должны переопределять его)
  // Используем только базовый путь с локалью, страницы могут добавить свой путь
  const canonical = `${baseNormalized}/${locale}`;

  // Hreflang теги для главной страницы
  // Для вложенных страниц нужно будет добавить полный путь в их generateMetadata
  const languages = routing.locales.reduce<Record<string, string>>((acc, l) => {
    const hreflang = localeToHreflang[l] || l;
    // Для главной страницы используем только /locale
    acc[hreflang] = `${baseNormalized}/${l}`;
    return acc;
  }, {});

  languages["x-default"] = `${baseNormalized}/${defaultLocale}`;

  const description = t("description");

  // Ключевые слова для SEO
  const keywords =
    locale === "ru"
      ? "онлайн запись, онлайн бронирование, система записи клиентов, CRM для записей, CRM для салонов, CRM для малого бизнеса, CRM для самозанятых, управление записями, управление расписанием, онлайн запись для салонов, запись клиентов онлайн, система онлайн записи, бронирование онлайн, CRM система, управление клиентами"
      : "онлайн тіркеу, онлайн брондау, клиенттерді тіркеу жүйесі, жазбаларға арналған CRM, салондарға арналған CRM, шағын бизнес үшін CRM, өзін-өзі жұмыспен қамтушыларға арналған CRM, жазбаларды басқару, кестені басқару, салондарға арналған онлайн тіркеу, клиенттерді онлайн тіркеу, онлайн тіркеу жүйесі, онлайн брондау, CRM жүйесі, клиенттерді басқару";

  const metadata: Metadata = {
    title: t("title"),
    description,
    keywords,
    applicationName: "Bagsy",
    category: "Business Software",
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: t("title"),
      description,
      url: canonical,
      locale: ogLocaleMap[locale] ?? "ru_KZ",
      alternateLocale: ["ru_KZ", "kk_KZ"],
      siteName: "Bagsy",
      type: "website",
      images: [
        {
          url: "/og/bagsy-og-1200x630.jpg",
          width: 1200,
          height: 630,
          alt: "Bagsy — онлайн запись клиентов и CRM для управления записями",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description,
      images: [`${process.env.NEXT_PUBLIC_DOMAIN}/og/bagsy-og-1200x630.jpg`],
    },
  };

  return metadata;
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
