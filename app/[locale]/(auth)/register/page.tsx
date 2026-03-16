import { RegisterForm } from "@/features/auth/ui/register-form";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { landing } from "@/src/features";
import type { PlanCode } from "@/shared/api/types";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("RegisterForm");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const params = await searchParams;
  const validPlans: PlanCode[] = ["solo", "point", "network"];
  const defaultPlan = validPlans.includes(params.plan as PlanCode)
    ? (params.plan as PlanCode)
    : undefined;

  return (
    <div className="relative min-h-screen flex justify-center p-4 bg-linear-to-br from-background via-accent-50/50 to-background dark:from-background dark:via-accent-950/40 dark:to-background">
      <landing.LandingHeader />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 z-0" />
      <div className="z-10 w-full pt-16">
        <RegisterForm defaultPlan={defaultPlan} />
      </div>
    </div>
  );
}
