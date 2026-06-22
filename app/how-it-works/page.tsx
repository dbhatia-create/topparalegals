import type { Metadata } from "next";
import { Phone } from "lucide-react";
import Container from "@/components/Container";
import Faq from "@/components/Faq";
import FadeIn from "@/components/FadeIn";
import Button from "@/components/Button";
import { howItWorksFaqItems } from "@/content/faq";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Learn how TopMortgageCompanies.com works — apply, get listed, and connect with borrowers in your city.",
};

const steps = [
  {
    num: "01",
    title: "Tell Us About Your Company",
    description:
      "Tell us about your company, your loan officers, and the cities you serve. The profile submission takes about 5 minutes and includes a transparent pricing estimate.",
  },
  {
    num: "02",
    title: "Get Reviewed",
    description:
      "Our team verifies your company's standing and credentials. Every qualifying company is accepted. If we need anything to finalize your listing, we'll reach out directly.",
  },
  {
    num: "03",
    title: "Go Live",
    description:
      "Your listing debuts in August 2026 alongside all listed companies — a coordinated national launch with press coverage and borrower awareness campaigns.",
  },
  {
    num: "04",
    title: "Be Recognized",
    description:
      "Receive your custom award plaque, attend the Summer 2027 Awards & Recognition Event, and display the Top Mortgage Companies 2027 badge on your own company website.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-navy py-14 text-center">
        <Container>
          <p className="text-xs font-semibold text-teal uppercase tracking-widest mb-3">The Process</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">How It Works</h1>
          <p className="text-white/70 text-lg max-w-lg leading-relaxed mx-auto">
            Four steps from submission to recognition. The process is simple — we handle the rest.
          </p>
        </Container>
      </div>

      <Container>
        <div className="py-16 lg:py-20 max-w-3xl mx-auto">

          {/* Steps */}
          <div className="space-y-10 mb-14">
            {steps.map(({ num, title, description }) => (
              <FadeIn key={num}>
                <div className="flex gap-6 items-start">
                  <span className="font-display text-4xl font-bold text-teal/30 leading-none flex-shrink-0 w-12 text-right">
                    {num}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-display text-xl font-bold text-navy mb-2">{title}</h3>
                    <p className="text-muted leading-relaxed">{description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* CTA strip */}
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
              <Button href="/apply" variant="primary" size="lg">
                Submit Your Profile
              </Button>
              <span className="text-muted text-sm">
                Questions? Call{" "}
                <a href="tel:+18665206592" className="text-teal font-semibold hover:underline">
                  (866) 520-6592
                </a>
              </span>
            </div>
          </FadeIn>

          {/* Pricing */}
          <FadeIn>
            <div className="rounded-2xl border border-sky-dark bg-sky p-8 mb-16">
              <h2 className="font-display text-2xl font-bold text-navy mb-8 text-center">Pricing</h2>

              <div className="space-y-6 mb-6">
                {/* Standard Listing — per city */}
                <div className="bg-white rounded-xl border border-sky-dark p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-display text-lg font-bold text-navy">Listing — per city</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-muted line-through">$578 / city</p>
                      <p className="font-display text-2xl font-bold text-navy">$289 / city</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {[
                      "Full company profile with photo & description",
                      "Custom recognition plaque",
                      "Invitation to the Awards & Recognition Event",
                      "Eligibility for the Top Mortgage Companies Recognition Award",
                      "Full listing in every city you serve",
                      "Expands your reach to all borrowers in your market",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted">
                        <span className="text-teal font-bold mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Featured Listing */}
                <div className="bg-white rounded-xl border border-teal/30 p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-display text-lg font-bold text-navy">Featured Listing (city page banner)</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-muted line-through">+$1,378 / city</p>
                      <p className="font-display text-2xl font-bold text-teal">+$689 / city</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {[
                      "Banner placement at the top of your city page",
                      "Displayed above all ranked listings",
                      "First-come — limited per city",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted">
                        <span className="text-teal font-bold mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="text-xs text-muted text-center mb-6">
                Annual listing. All listings debut August 2026. Featured Listing is subject to availability on a first-come basis per city.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href="/apply" variant="primary" size="lg">
                  Submit Your Profile
                </Button>
                <a
                  href="tel:+18665206592"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-teal transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  (866) 520-6592
                </a>
              </div>
            </div>
          </FadeIn>

          {/* FAQ */}
          <FadeIn>
            <h2 className="font-display text-2xl font-bold text-navy mb-8 text-center">Common Questions</h2>
            <Faq items={howItWorksFaqItems} />
          </FadeIn>
        </div>
      </Container>
    </div>
  );
}
