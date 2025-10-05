// app/[locale]/layout.tsx
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

import { Nunito } from "next/font/google";
import "@/src/styles/shadcn.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

type LayoutParams = { locale: "ru" | "kz" };

export async function generateMetadata({
  params,
}: {
  params: Promise<LayoutParams>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "LocaleLayout",
  });

  const base = process.env.NEXT_PUBLIC_DOMAIN || "https://bagsy.kz";
  const baseNormalized = base.replace(/\/+$/, "");
  const canonical = `${baseNormalized}/${locale}`;

  // hreflang карты
  const languages = routing.locales.reduce<Record<string, string>>((acc, l) => {
    const hreflang = localeToHreflang[l] || l; // ru -> ru-KZ, kz -> kk-KZ
    acc[hreflang] = `${baseNormalized}/${l}`;
    return acc;
  }, {});
  languages["x-default"] = `${baseNormalized}/${defaultLocale}`;

  const description = t("description");

  return {
    metadataBase: new URL(baseNormalized),
    alternates: {
      canonical,
      languages,
    },
    title: {
      default: "Bagsy",
      template: "%s | Bagsy",
    },
    description,
    robots: { index: true, follow: true },
    icons: {
      icon: [
        { url: "/logo-light.svg", media: "(prefers-color-scheme: light)" },
        { url: "/logo-dark.svg", media: "(prefers-color-scheme: dark)" },
      ],
      apple: [{ url: "/apple-touch-icon.png" }],
      shortcut: ["/logo-dark.svg"],
    },
    openGraph: {
      siteName: "Bagsy",
      type: "website",
      title: t("title"),
      description,
      url: canonical,
      locale: ogLocaleMap[locale] ?? "ru_KZ",
      alternateLocale: ["ru_KZ", "kk_KZ"],
      images: [
        {
          url: "/og/bagsy-og-1200x630.jpg",
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
      images: ["/og/bagsy-og-1200x630.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<LayoutParams>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  // HTML lang: 'ru' или 'kk'
  const htmlLang = locale === "kz" ? "kk" : "ru";

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="/logo-light.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/logo-dark.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body className={nunito.className} suppressHydrationWarning>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </ThemeProvider>

          <Toaster />
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
