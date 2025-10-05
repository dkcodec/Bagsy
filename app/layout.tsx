import { Nunito } from "next/font/google";
import { defaultLocale } from "@/i18n/routing";
import type { Metadata } from "next";
import "@/src/styles/shadcn.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { ogLocaleMap } from "@/src/shared/constants";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN || "https://bagsy.kz"),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_DOMAIN || "https://bagsy.kz",
    languages: {
      "ru-KZ": "https://bagsy.kz/ru",
      "kk-KZ": "https://bagsy.kz/kz",
      "x-default": "https://bagsy.kz/ru",
    },
  },
  title: {
    default: "Bagsy",
    template: "%s | Bagsy",
  },
  description:
    "Bagsy — онлайн‑сервис для управления записями. Быстро, удобно, локализовано.",
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
  openGraph: {
    siteName: "Bagsy",
    type: "website",
    title: "Bagsy",
    locale: ogLocaleMap[defaultLocale],
    alternateLocale: ["ru_KZ", "kk_KZ"],
    description:
      "Bagsy — онлайн‑сервис для управления записями. Быстро, удобно, локализовано.",
    images: [
      {
        url: "/logo-full-dark.svg",
        width: 1200,
        height: 630,
        alt: "Bagsy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bagsy",
    description:
      "Bagsy — онлайн‑сервис для управления записями. Быстро, удобно, локализовано.",
    images: ["/logo-full-dark.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning>
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
