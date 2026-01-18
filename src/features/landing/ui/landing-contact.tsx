import { getLocale, getTranslations } from "next-intl/server";
import { Button } from "@/entities/button";
import { Badge } from "@/entities/badge";
import { Handshake, Rocket, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export async function LandingContact() {
  const t = await getTranslations("Landing.contact");
  const locale = await getLocale();

  // Получаем преимущества партнерства
  const benefits = [
    t("benefits.earlyAccess"),
    t("benefits.influence"),
    t("benefits.specialConditions"),
  ];

  return (
    <section
      id="contact"
      className="relative py-24 bg-linear-to-br from-background via-accent-50/50 to-background dark:from-background dark:via-accent-950/40 dark:to-background overflow-hidden"
    >
      {/* Декоративные элементы */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок секции */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Badge
                variant="secondary"
                className="text-sm flex items-center gap-2 px-4 py-1.5"
              >
                <Handshake className="h-4 w-4" />
                {t("badge")}
              </Badge>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t("title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          {/* Преимущества партнерства */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 rounded-xl border border-accent-200/60 dark:border-accent-800/60 bg-white/80 dark:bg-accent-950/50 backdrop-blur-xs hover:border-accent-500/60 dark:hover:border-accent-700/60 transition-all duration-300"
              >
                <div className="shrink-0 p-2 rounded-lg bg-accent-100 dark:bg-accent-900">
                  <CheckCircle className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                </div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {benefit}
                </p>
              </div>
            ))}
          </div>

          {/* Призыв к действию */}
          <div className="relative bg-linear-to-r from-accent-500 via-accent-600 to-accent-500 rounded-2xl p-8 sm:p-12 shadow-2xl overflow-hidden">
            {/* Декоративный фон */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="relative text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-white/20 backdrop-blur-xs">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {t("cta.title")}
              </h3>
              <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
                {t("cta.description")}
              </p>
              <Link href={`/${locale}/register`} hrefLang={locale}>
                <Button
                  size="lg"
                  className="bg-white text-accent-600 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  <span className="flex items-center gap-2">
                    {t("cta.button")}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
