import { routing, defaultLocale } from "@/i18n/routing";
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

  // Build i18n alternates and canonical
  const base = process.env.NEXT_PUBLIC_DOMAIN || "https://bagsy.kz";
  const currentPath = `/${locale}`; // layout root
  const languages = Object.fromEntries(
    routing.locales.map(l => [l, `${base}/${l}`])
  );

  const isDefault = locale === defaultLocale;
  const canonical = `${base}/${locale}`;

  const description = t("description");

  const metadata: Metadata = {
    title: t("title"),
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: t("title"),
      description,
      url: canonical,
      locale,
      siteName: "Bagsy",
      images: [
        {
          url: "/logo-full-light.svg",
          width: 1200,
          height: 630,
          alt: "Bagsy",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description,
      images: ["/logo-full-light.svg"],
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
