import {
  LandingHeader,
  LandingHero,
  LandingFeatures,
  LandingCTA,
  LandingFooter,
  LandingPricing,
} from "@/src/feature";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />

      <main>
        <div id="hero">
          <LandingHero />
        </div>

        <div id="features">
          <LandingFeatures />
        </div>

        <div id="pricing">
          <LandingPricing />
        </div>

        <div id="cta">
          <LandingCTA />
        </div>
      </main>

      {/* Footer */}
      <div id="contact">
        <LandingFooter />
      </div>
    </div>
  );
}
