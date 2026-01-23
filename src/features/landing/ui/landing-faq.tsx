import { getTranslations } from "next-intl/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/entities/accordion";
import { Badge } from "@/entities/badge";
import { HelpCircle } from "lucide-react";

/**
 * FAQ секция для главной страницы
 * Улучшает SEO через структурированные вопросы и ответы с ключевыми словами
 */
export async function LandingFAQ() {
  const t = await getTranslations("Landing.faq");

  // Получаем все вопросы из переводов
  const faqItems = [
    {
      key: "howItWorks",
      question: t("items.howItWorks.question"),
      answer: t("items.howItWorks.answer"),
    },
    {
      key: "whatIsCRM",
      question: t("items.whatIsCRM.question"),
      answer: t("items.whatIsCRM.answer"),
    },
    {
      key: "forSalons",
      question: t("items.forSalons.question"),
      answer: t("items.forSalons.answer"),
    },
    {
      key: "howToStart",
      question: t("items.howToStart.question"),
      answer: t("items.howToStart.answer"),
    },
    {
      key: "freeOrPaid",
      question: t("items.freeOrPaid.question"),
      answer: t("items.freeOrPaid.answer"),
    },
    {
      key: "mobileApp",
      question: t("items.mobileApp.question"),
      answer: t("items.mobileApp.answer"),
    },
    {
      key: "dataSecurity",
      question: t("items.dataSecurity.question"),
      answer: t("items.dataSecurity.answer"),
    },
  ];

  return (
    <section id="faq" className="py-24 bg-background relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок секции */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Badge
              variant="default"
              className="text-sm flex items-center gap-2 px-4 py-1.5"
            >
              <HelpCircle className="h-4 w-4" />
              FAQ
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Аккордеон с вопросами */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={item.key}
              value={`item-${index}`}
              className="border border-accent-200 dark:border-accent-800 rounded-lg px-6 bg-white/50 dark:bg-accent-950/30 backdrop-blur-sm hover:border-accent-500 dark:hover:border-accent-700 transition-colors"
            >
              <AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-white py-6 hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed pb-6">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/**
 * Функция для получения FAQ данных для JSON-LD
 * Используется в компоненте структурированных данных
 */
export async function getFAQDataForJSONLD() {
  const t = await getTranslations("Landing.faq");

  return [
    {
      question: t("items.howItWorks.question"),
      answer: t("items.howItWorks.answer"),
    },
    {
      question: t("items.whatIsCRM.question"),
      answer: t("items.whatIsCRM.answer"),
    },
    {
      question: t("items.forSalons.question"),
      answer: t("items.forSalons.answer"),
    },
    {
      question: t("items.howToStart.question"),
      answer: t("items.howToStart.answer"),
    },
    {
      question: t("items.freeOrPaid.question"),
      answer: t("items.freeOrPaid.answer"),
    },
    {
      question: t("items.mobileApp.question"),
      answer: t("items.mobileApp.answer"),
    },
    {
      question: t("items.integrations.question"),
      answer: t("items.integrations.answer"),
    },
    {
      question: t("items.dataSecurity.question"),
      answer: t("items.dataSecurity.answer"),
    },
  ];
}
