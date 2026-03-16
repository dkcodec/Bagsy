import { getTranslations, getLocale } from "next-intl/server";
import { Button } from "@/entities/button";
import { Badge } from "@/entities/badge";
import { Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/utils/styles";

interface Feature {
  text: string;
  muted?: boolean;
}

interface Plan {
  name: string;
  price: string;
  currentPrice: string;
  period: string;
  trial: string;
  description: string;
  features: Feature[];
  cta: string;
  href: string;
  highlighted?: boolean;
  badge?: string;
}

function PlanCard({ plan }: { plan: Plan }) {
  const isHighlighted = plan.highlighted;

  const card = (
    <div
      className={cn(
        "flex flex-col rounded-2xl p-8 h-full",
        isHighlighted
          ? "bg-foreground text-background"
          : "bg-muted dark:bg-muted/50 text-foreground"
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        {plan.badge && (
          <Badge
            className={cn(
              "text-xs font-medium",
              isHighlighted
                ? "bg-accent-500 text-white border-accent-500 hover:bg-accent-500"
                : "bg-accent-100 text-accent-700 border-accent-200 hover:bg-accent-100 dark:bg-accent-900 dark:text-accent-300 dark:border-accent-800"
            )}
          >
            {plan.badge}
          </Badge>
        )}
      </div>

      <p
        className={cn(
          "text-sm mb-6",
          isHighlighted ? "text-background/60" : "text-muted-foreground"
        )}
      >
        {plan.description}
      </p>

      <div className="mb-1">
        <span
          className={cn(
            "text-lg line-through",
            isHighlighted ? "text-background/40" : "text-muted-foreground/60"
          )}
        >
          {plan.price}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight">
            {plan.currentPrice}
          </span>
          <span
            className={cn(
              "text-sm",
              isHighlighted ? "text-background/60" : "text-muted-foreground"
            )}
          >
            {plan.period}
          </span>
        </div>
      </div>

      <p
        className={cn(
          "text-sm font-medium mb-8",
          isHighlighted ? "text-accent-400" : "text-accent-600"
        )}
      >
        {plan.trial}
      </p>

      <ul className="flex-1 space-y-3 mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check
              className={cn(
                "h-4 w-4 mt-0.5 shrink-0",
                feature.muted
                  ? isHighlighted
                    ? "text-background/40"
                    : "text-muted-foreground/50"
                  : isHighlighted
                    ? "text-accent-400"
                    : "text-accent-600"
              )}
            />
            <span
              className={cn(
                "text-sm",
                feature.muted
                  ? isHighlighted
                    ? "text-background/40"
                    : "text-muted-foreground/50"
                  : ""
              )}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        size="lg"
        className={cn(
          "w-full rounded-xl",
          isHighlighted
            ? "bg-background text-foreground hover:bg-background/90"
            : "bg-foreground text-background hover:bg-foreground/90"
        )}
      >
        <Link href={plan.href}>{plan.cta}</Link>
      </Button>
    </div>
  );

  if (isHighlighted) {
    return (
      <div className="relative rounded-2xl p-[2px] overflow-hidden">{card}</div>
    );
  }

  return card;
}

export async function LandingPricing() {
  const t = await getTranslations("Landing.pricing");
  const locale = await getLocale();

  const plans: Plan[] = [
    {
      name: t("solo.title"),
      price: t("solo.price"),
      currentPrice: t("solo.currentPrice"),
      period: t("solo.period"),
      trial: t("solo.trial"),
      description: t("solo.description"),
      cta: t("solo.cta"),
      href: `/${locale}/register?plan=solo`,
      features: [
        { text: t("solo.features.point") },
        { text: t("solo.features.records") },
        { text: t("solo.features.crm") },
        { text: t("solo.features.notifications") },
        { text: t("solo.features.booking") },
        { text: t("solo.features.reminders") },
      ],
    },
    {
      name: t("point.title"),
      price: t("point.price"),
      currentPrice: t("point.currentPrice"),
      period: t("point.period"),
      trial: t("point.trial"),
      description: t("point.description"),
      badge: t("point.badge"),
      highlighted: true,
      cta: t("point.cta"),
      href: `/${locale}/register?plan=point`,
      features: [
        { text: t("point.features.masters") },
        { text: t("point.features.allSolo") },
        { text: t("point.features.crm") },
        { text: t("point.features.analytics"), muted: true },
        { text: t("point.features.finance"), muted: true },
        { text: t("point.features.inventory"), muted: true },
      ],
    },
    {
      name: t("network.title"),
      price: t("network.price"),
      currentPrice: t("network.currentPrice"),
      period: t("network.period"),
      trial: t("network.trial"),
      description: t("network.description"),
      cta: t("network.cta"),
      href: `/${locale}/register?plan=network`,
      features: [
        { text: t("network.features.points") },
        { text: t("network.features.masters") },
        { text: t("network.features.allPoint") },
        { text: t("network.features.multi"), muted: true },
        { text: t("network.features.analytics"), muted: true },
        { text: t("network.features.api"), muted: true },
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(plan => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
