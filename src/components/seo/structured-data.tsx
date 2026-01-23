import { getLocale } from "next-intl/server";

// Типы для структурированных данных
interface OrganizationSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    "@type": string;
    contactType: string;
    email?: string;
  };
}

interface WebSiteSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  potentialAction?: {
    "@type": string;
    target: {
      "@type": string;
      urlTemplate: string;
    };
    "query-input": string;
  };
}

interface SoftwareApplicationSchema {
  "@context": string;
  "@type": string;
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    "@type": string;
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    "@type": string;
    ratingValue: string;
    reviewCount: string;
  };
}

interface FAQPageSchema {
  "@context": string;
  "@type": string;
  mainEntity: Array<{
    "@type": string;
    name: string;
    acceptedAnswer: {
      "@type": string;
      text: string;
    };
  }>;
}

interface StructuredDataProps {
  faqItems?: Array<{ question: string; answer: string }>;
}

/**
 * Компонент для добавления структурированных данных JSON-LD на страницу
 * Улучшает понимание контента поисковыми системами
 */
export async function StructuredData({ faqItems }: StructuredDataProps) {
  const locale = await getLocale();
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "https://bagsy.kz";
  const baseNormalized = baseUrl.replace(/\/+$/, "");

  // Схема Organization - информация о компании
  const organizationSchema: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bagsy",
    url: baseNormalized,
    logo: `${baseNormalized}/logo-full-dark.svg`,
    description:
      locale === "ru"
        ? "Bagsy — онлайн запись клиентов и CRM для управления расписанием, мастерами и записями. Подходит для самозанятых, салонов, услуг и малого бизнеса."
        : "Bagsy - кестелерді, техниктерді және кездесулерді басқаруға арналған онлайн-клиенттік жоспарлау және CRM жүйесі.",
    sameAs: [
      // Здесь можно добавить ссылки на соцсети, если они есть
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
    },
  };

  // Схема WebSite - информация о сайте с поисковым действием
  const webSiteSchema: WebSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bagsy",
    url: baseNormalized,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseNormalized}/${locale}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // Схема SoftwareApplication - описание приложения
  const softwareApplicationSchema: SoftwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bagsy",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KZT",
    },
  };

  // Схема FAQPage - структурированные вопросы и ответы
  let faqPageSchema: FAQPageSchema | null = null;
  if (faqItems && faqItems.length > 0) {
    faqPageSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map(item => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    };
  }

  return (
    <>
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      {/* WebSite Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSiteSchema),
        }}
      />

      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />

      {/* FAQPage Schema - только если есть FAQ */}
      {faqPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqPageSchema),
          }}
        />
      )}
    </>
  );
}
