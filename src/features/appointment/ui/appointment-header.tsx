import { Link } from "@/i18n/navigation";
import { LandingLogo } from "@/src/widgets/branding/landing-logo";
import { LocaleSwitcher } from "@/src/widgets/controls/locale-switcher";
import { ThemeToggle } from "@/src/widgets/controls/theme-toggle";
import { getLocale } from "next-intl/server";

export async function AppointmentHeader() {
  const locale = await getLocale();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/40 dark:bg-background/40 backdrop-blur-md border-b border-backgroung dark:border-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" hrefLang={locale}>
            <LandingLogo className="h-8 w-auto" />
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
