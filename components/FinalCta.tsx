import { Shield } from "lucide-react";
import Button from "./Button";
import Container from "./Container";
import FadeIn from "./FadeIn";

export default function FinalCta() {
  return (
    <section className="bg-navy py-20 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal via-transparent to-transparent pointer-events-none" />
      <Container>
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal/20 border border-teal/30 mb-6 mx-auto">
              <Shield className="h-7 w-7 text-teal" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-5">
              Secure Your City Before Someone Else Does.
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Featured Listing is limited to one provider per city — first-come, first-served.
              Apply now to lock in your spot at the August 2026 launch and take
              advantage of the pre-launch special covering balance of 2026 plus all of 2027.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/apply" variant="primary" size="lg">
                Apply Now
              </Button>
              <Button href="/contact" variant="outline-light" size="lg">
                Talk to Our Team
              </Button>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
