import { Award, Calendar, Users, Phone } from "lucide-react";
import Image from "next/image";
import Button from "./Button";
import Container from "./Container";
import FadeIn from "./FadeIn";

export default function AwardsDinner() {
  return (
    <section className="bg-navy py-20 lg:py-28 overflow-hidden relative">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-teal via-transparent to-transparent pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: plaque */}
          <FadeIn direction="left">
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-6 bg-teal/10 rounded-3xl blur-2xl" />
                <div className="relative w-full max-w-lg">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-2 justify-center px-4 py-1.5 bg-teal text-white font-bold text-[10px] tracking-widest uppercase rounded-full shadow-md whitespace-nowrap">
                    Limited Time: Apply Today
                  </div>
                  <Image
                    src="/top-awards-mortage.png.png"
                    alt="Top Mortgage Companies 2027 Recognition Award Plaque"
                    width={600}
                    height={720}
                    className="rounded-2xl shadow-2xl w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right: copy */}
          <FadeIn direction="right" delay={0.15}>
            <p className="text-xs font-semibold text-teal uppercase tracking-widest mb-4">
              Celebrate. Connect. Be Recognized.
            </p>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Annual Awards &amp;
              <br />
              <span className="text-teal">Recognition Event</span>
            </h2>

            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Every listed company receives a custom recognition plaque and an
              invitation to the Annual Awards &amp; Recognition Event in Summer
              2027 — a night of peer recognition, networking, and celebration of
              every listed company on TopMortgageCompanies.com.
            </p>

            <div className="space-y-4 mb-10">
              {[
                {
                  icon: Award,
                  text: "Limited time: Complimentary custom recognition plaque with your application",
                },
                {
                  icon: Calendar,
                  text: "Exclusive recognition event — Summer 2027",
                },
                {
                  icon: Users,
                  text: "Network with peers, referral partners, and industry leaders",
                },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-teal/20 border border-teal/30 flex items-center justify-center mt-0.5">
                    <Icon className="h-4 w-4 text-teal" />
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <Button href="/how-it-works" variant="primary" size="lg">
                Learn More
              </Button>
              <a
                href="tel:+18665206592"
                className="inline-flex items-center gap-2.5 rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 hover:text-teal hover:border-teal/50 hover:bg-teal/10 transition-colors"
              >
                <Phone className="h-4 w-4 text-teal" />
                (866) 520-6592
              </a>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
