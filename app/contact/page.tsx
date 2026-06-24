import type { Metadata } from "next";
import { Mail, Phone, Clock } from "lucide-react";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the TopParalegals.com team. We're here to answer your questions about listings and Featured Listings.",
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <div className="bg-navy py-14">
        <Container>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-white/70 text-lg max-w-lg">
            Have questions about getting listed? We&apos;re happy to help.
          </p>
        </Container>
      </div>

      <Container>
        <div className="py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <FadeIn direction="left">
            <h2 className="font-display text-2xl font-bold text-navy mb-6">Send Us a Message</h2>
            <ContactForm />
          </FadeIn>

          <FadeIn direction="right" delay={0.1}>
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-navy mb-6">Get in Touch</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10 border border-teal/20 flex-shrink-0">
                      <Phone className="h-5 w-5 text-teal" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy text-sm">Phone</p>
                      <a href="tel:+18660000000" className="text-teal text-sm font-medium hover:underline">(866) 000-0000</a>
                      <p className="text-xs text-muted mt-0.5">Mon – Fri, 9am – 6pm ET</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10 border border-teal/20 flex-shrink-0">
                      <Mail className="h-5 w-5 text-teal" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy text-sm">Email</p>
                      <a href="mailto:info@topparalegals.com" className="text-teal text-sm font-medium hover:underline">
                        info@topparalegals.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10 border border-teal/20 flex-shrink-0">
                      <Clock className="h-5 w-5 text-teal" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy text-sm">Response Time</p>
                      <p className="text-sm text-muted">We respond promptly.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-navy p-8">
                <h3 className="font-display text-lg font-bold text-white mb-3">Ready to Get Listed?</h3>
                <p className="text-white/70 text-sm mb-5 leading-relaxed">
                  Apply now to secure your listing before the August 2026 launch. Featured Placement is first-come, first-served.
                </p>
                <a
                  href="/apply"
                  className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-teal text-white font-semibold text-sm hover:bg-teal-dark transition-colors"
                >
                  Apply Now
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </div>
  );
}
