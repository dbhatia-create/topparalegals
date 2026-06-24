import type { Metadata } from "next";
import Container from "@/components/Container";
import FadeIn from "@/components/FadeIn";
import Button from "@/components/Button";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Browse the legal support specialties available on TopParalegals.com — from litigation support and document preparation to family law, immigration, estate planning, and more.",
};

export default function ServicesPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-navy py-14">
        <Container>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">Legal Support Services</h1>
          <p className="text-white/70 text-lg max-w-lg leading-relaxed">
            TopParalegals.com covers the full spectrum of paralegal and legal support services — so law firms and clients can find the right professional that matches their exact needs.
          </p>
        </Container>
      </div>

      <Container>
        <div className="py-16 lg:py-20">
          <FadeIn>
            <p className="text-muted text-lg leading-relaxed max-w-2xl mb-14">
              When you apply, select all the legal support specialties your practice offers. These appear on your listing
              and help law firms and clients instantly understand your capabilities. Your specialty selections do not
              affect pricing — the basic listing fee covers all specialties.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {services.map((service, i) => (
              <FadeIn key={service.id} delay={i * 0.05}>
                <div className="rounded-2xl border border-sky-dark bg-sky p-6 h-full">
                  <h2 className="font-display text-xl font-bold text-navy mb-2">{service.label}</h2>
                  <p className="text-sm text-muted mb-4 leading-relaxed">{service.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.specialties.map((s) => (
                      <span key={s} className="text-xs bg-white border border-sky-dark text-navy px-2.5 py-1 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="rounded-2xl bg-navy p-8 text-center">
              <h2 className="font-display text-2xl font-bold text-white mb-3">Ready to Get Listed?</h2>
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                Select your legal support specialties when you apply. Every qualifying paralegal professional is accepted.
              </p>
              <Button href="/apply" variant="primary" size="lg">Apply Now</Button>
            </div>
          </FadeIn>
        </div>
      </Container>
    </div>
  );
}
