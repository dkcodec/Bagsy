import { RegisterForm } from "@/features/auth/ui/register-form";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { landing } from "@/src/features";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("RegisterForm");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex justify-center p-4 bg-gradient-to-br from-background via-accent-50/50 to-background dark:from-background dark:via-accent-950/40 dark:to-background">
      <landing.LandingHeader />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 z-0" />
      <div className="z-10 w-full pt-16">
        <RegisterForm />
      </div>
    </div>
  );
}
