import { Check, Phone } from "lucide-react";
import Button from "./Button";
import Container from "./Container";
import FadeIn from "./FadeIn";
import { PRICING, formatCurrency } from "@/lib/pricing";

const LISTING_FEATURES = [
  "Full professional profile with credentials & description",
  "Listed by city and legal support specialties",
  "Contact details, website link & social media",
  "TopParalegals.com verified badge for your website",
  "Invitation to the Annual Awards & Recognition Event",
  "Pre-launch special: balance of 2026 + all of 2027",
  "Reach law firms and clients actively searching in your area",
  "Showcase practice area support specialties",
  "Highlight certifications and professional credentials",
];

export default function Pricing() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <Container>
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-teal uppercase tracking-widest mb-3">
              Transparent Pricing
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-4">
              Simple, Transparent Pricing
            </h2>
            <div className="w-12 h-0.5 bg-teal mx-auto mb-5" />
            <p className="text-muted max-w-xl mx-auto text-lg leading-relaxed">
              One annual fee per city. Optional Featured Listing secures the top spot
              in your city — only one available per city, first-come, first-served.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-2xl mx-auto">
          <FadeIn delay={0.05}>
            <div className="rounded-2xl border border-sky-dark bg-white shadow-md p-8 flex flex-col h-full">
              <p className="text-xs font-semibold text-teal uppercase tracking-widest mb-3">
                City Listing
              </p>
              <h3 className="font-display text-2xl font-bold text-navy mb-6">
                Your Listing
              </h3>

              {/* Pricing tiers */}
              <div className="space-y-3 mb-8">
                {[
                  {
                    label: "Basic listing",
                    sub: "Per city — includes all legal support specialties",
                    price: PRICING.basicPerCity,
                    color: "text-navy",
                    prefix: "",
                  },
                  {
                    label: "Featured Listing — first city",
                    sub: "Top position above all ranked listings — 1 per city",
                    price: PRICING.featuredFirstCity,
                    color: "text-teal",
                    prefix: "+",
                  },
                  {
                    label: "Featured Listing — each additional city",
                    sub: "50% off for every city after the first",
                    price: PRICING.featuredAdditionalCity,
                    color: "text-teal",
                    prefix: "+",
                  },
                ].map(({ label, sub, price, color, prefix }) => (
                  <div key={label} className="flex flex-wrap items-center justify-between gap-2 p-4 rounded-xl bg-sky border border-sky-dark">
                    <div>
                      <p className="font-semibold text-navy text-sm">{label}</p>
                      <p className="text-xs text-muted mt-0.5">{sub}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted line-through">{prefix}{formatCurrency(price * 2)}</p>
                      <p className={`font-display text-xl sm:text-2xl font-bold ${color} whitespace-nowrap`}>
                        {prefix}{formatCurrency(price)}
                        <span className="text-sm font-normal text-muted">/yr</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Included features */}
              <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">
                Every listing includes
              </p>
              <ul className="space-y-2.5 flex-1 mb-8">
                {LISTING_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 flex-shrink-0 mt-0.5 text-teal" />
                    <span className="text-sm text-muted leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              <Button href="/apply" variant="secondary" size="md" className="w-full">
                Submit Your Professional Profile
              </Button>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <p className="text-center text-xs text-muted mt-8 max-w-lg mx-auto">
            Annual listing. All listings debut August 2026. Only one Featured Listing available per city.
          </p>
          <div className="flex justify-center mt-6">
            <a
              href="tel:+18660000000"
              className="inline-flex items-center gap-2.5 rounded-lg border border-navy/20 bg-sky px-5 py-3 text-sm font-semibold text-navy hover:bg-sky-dark hover:border-teal/50 transition-colors"
            >
              <Phone className="h-4 w-4 text-teal" />
              Questions? Call&nbsp;<span className="text-teal">(866) 000-0000</span>
            </a>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
