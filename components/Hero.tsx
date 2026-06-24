import Image from "next/image";
import { Scale } from "lucide-react";
import Button from "./Button";
import Container from "./Container";
import FadeIn from "./FadeIn";
import { IMAGES } from "@/content/images";

export default function Hero() {
  return (
    <section className="relative bg-navy overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={IMAGES.heroCityBackground}
          alt=""
          fill
          className="object-cover object-center opacity-[0.18]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/60" />
      </div>

      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal via-transparent to-transparent pointer-events-none" />

      <Container>
        <div className="relative py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left: headline */}
          <FadeIn direction="left">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-4 py-1.5 mb-6">
              <Scale className="h-3.5 w-3.5 text-teal" />
              <span className="text-xs font-semibold text-teal uppercase tracking-widest">
                Applications Open — 2026/2027 Listings
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              Get Your Services
              <br />
              <span className="text-teal">In Front of</span>
              <br />
              More Clients.
            </h1>

            <p className="text-lg text-white/70 max-w-xl mb-8 leading-relaxed">
              TopParalegals.com is the premier directory connecting
              law firms, attorneys, businesses, and individuals with qualified paralegal and legal support
              services across the country.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="/apply" variant="primary" size="lg">
                Get Your Services Listed
              </Button>
              <Button href="/how-it-works" variant="outline-light" size="lg">
                Learn More
              </Button>
            </div>
          </FadeIn>

          {/* Right: showcase card */}
          <FadeIn direction="right" delay={0.15}>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md mt-10 lg:mt-0">
                <div className="absolute -inset-4 bg-teal/10 rounded-3xl blur-2xl z-0" />

                <div className="relative rounded-2xl border border-teal/20 bg-navy shadow-2xl overflow-hidden group z-10">
                  <div className="relative h-[480px] w-full">
                    <Image
                      src={IMAGES.heroPortrait}
                      alt="Top-rated paralegal professional"
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/40 to-transparent" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <p className="text-sm text-white/70 leading-relaxed max-w-sm">
                      Build credibility with a professional profile that highlights your legal support specialties, experience, and practice area expertise.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </FadeIn>
        </div>
      </Container>

      {/* Bottom wave */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 bg-white"
        style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
      />
    </section>
  );
}
