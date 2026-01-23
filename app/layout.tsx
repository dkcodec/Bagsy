import { Nunito } from "next/font/google";
import { defaultLocale } from "@/i18n/routing";
import type { Metadata } from "next";
import "@/src/styles/shadcn.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { localeToHreflang, ogLocaleMap } from "@/src/shared/constants";
import { getLocale } from "next-intl/server";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata() {
  return {
    // metadataBase используется как базовый URL для всех относительных путей в метаданных
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN || "https://bagsy.kz"),
    title: {
      default: "Bagsy",
      template: "%s | Bagsy",
    },
    description:
      "Bagsy — онлайн запись клиентов и CRM для управления расписанием, мастерами и записями. Подходит для самозанятых, салонов, услуг и малого бизнеса.",
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: "/logo-light.svg", media: "(prefers-color-scheme: light)" },
        { url: "/logo-dark.svg", media: "(prefers-color-scheme: dark)" },
      ],
      apple: [{ url: "/apple-touch-icon.png" }],
      shortcut: ["/logo-dark.svg"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Bagsy",
      description:
        "Bagsy — онлайн‑сервис для управления записями. Быстро, удобно, локализовано.",
      images: ["/logo-full-dark.svg"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const htmlLang = localeToHreflang[locale] ?? "ru-KZ";
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
            {children}
          </ThemeProvider>

          <Toaster />
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
