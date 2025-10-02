import { landing } from "@/features";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
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

        <div id="cta">
          <landing.LandingCTA />
        </div>
      </main>

      {/* Footer */}
      <div id="contact">
        <landing.LandingFooter />
      </div>
    </div>
  );
}
