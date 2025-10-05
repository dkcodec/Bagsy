"use client";

import { Button } from "@/entities/button";
import { ThemeToggle } from "@/widgets/controls/theme-toggle";
import { LandingLogo } from "@/widgets/branding/landing-logo";
import { LocaleSwitcher } from "@/widgets/controls/locale-switcher";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("Landing.header");
  const locale = useLocale();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/40 dark:bg-background/40 backdrop-blur-md border-b border-backgroung dark:border-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="#hero" hrefLang={locale}>
              <LandingLogo className="h-8 w-auto" />
            </Link>
          </div>

          {/* Навигация для десктопа */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-gray-600 dark:text-gray-300 dark:hover:text-accent hover:text-accent transition-colors"
              hrefLang={locale}
            >
              {t("features")}
            </Link>
            <Link
              href="#contact"
              className="text-gray-600 dark:text-gray-300 dark:hover:text-accent hover:text-accent transition-colors"
              hrefLang={locale}
            >
              {t("pricing")}
            </Link>
            <Link
              href="#contact"
              className="text-gray-600 dark:text-gray-300 dark:hover:text-accent hover:text-accent transition-colors"
              hrefLang={locale}
            >
              {t("contact")}
            </Link>
          </nav>

          {/* Кнопки действий */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}${locale}/login`}
              hrefLang={locale}
            >
              <Button variant="ghost" size="sm">
                {t("login")}
              </Button>
            </Link>

            <Link href="#contact" hrefLang={locale}>
              <Button size="sm">{t("startFree")}</Button>
            </Link>
            <LocaleSwitcher />
            <ThemeToggle />
          </div>

          {/* Мобильное меню */}
          <div className="md:hidden flex items-center space-x-2">
            <LocaleSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-background py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
                hrefLang={locale}
              >
                {t("features")}
              </Link>
              <Link
                href="#contact"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
                hrefLang={locale}
              >
                {t("pricing")}
              </Link>
              <Link
                href="#contact"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
                hrefLang={locale}
              >
                {t("contact")}
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-background">
                <Link
                  href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}${locale}/login`}
                  hrefLang={locale}
                >
                  {t("login")}
                </Link>
                <Link href="#contact" hrefLang={locale}>
                  {t("startFree")}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
