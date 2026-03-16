import { landing } from "@/features";
import { StructuredData } from "@/src/components/seo";
import { getFAQDataForJSONLD } from "@/features/landing";

export default async function LandingPage() {
  // Получаем FAQ данные для JSON-LD структурированных данных
  const faqData = await getFAQDataForJSONLD();

  return (
    <div className="min-h-screen">
      {/* Структурированные данные JSON-LD для SEO */}
      <StructuredData faqItems={faqData} />

      <landing.LandingHeader />

      <main>
        <div id="hero">
          <landing.LandingHero />
        </div>

        <div id="features">
          <landing.LandingFeatures />
        </div>

        <div id="pricing">
          <landing.LandingPricing />
        </div>

        <div id="contact">
          <landing.LandingContact />
        </div>

        {/* FAQ секция для SEO и пользователей */}
        <div id="faq">
          <landing.LandingFAQ />
        </div>

        {/* <div id="cta">
          <landing.LandingCTA />
        </div> */}
      </main>

      <landing.LandingFooter />
    </div>
  );
}
