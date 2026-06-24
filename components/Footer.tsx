import Link from "next/link";
import { Phone } from "lucide-react";
import Container from "./Container";

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/contact", label: "Contact" },
];

const forLendersLinks = [
  { href: "/apply", label: "Apply to be Listed" },
  { href: "/how-it-works", label: "Benefits of Listing" },
  { href: "/how-it-works#recognition", label: "Recognition Process" },
  { href: "/#awards", label: "Awards & Dinner" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white/70">
      <Container>
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col items-center">
            <Link href="/" className="inline-flex flex-col items-center mb-5">
              <span className="font-display text-2xl font-bold text-white leading-none tracking-tight text-center">
                TopParalegals<span className="text-teal">.com</span>
              </span>
              <span className="text-xs text-white/50 mt-1 tracking-widest uppercase text-center">
                Expertise &middot; Precision &middot; Trust
              </span>
            </Link>
            <a
              href="tel:+18660000000"
              className="inline-flex items-center gap-2.5 rounded-lg border border-teal/40 bg-teal/10 px-4 py-2.5 text-sm font-semibold text-teal hover:bg-teal/20 hover:border-teal/60 transition-colors"
            >
              <Phone className="h-4 w-4" />
              (866) 000-0000
            </a>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-teal transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Paralegals */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">
              For Paralegals
            </h3>
            <ul className="space-y-2">
              {forLendersLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-teal transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} TopParalegals.com. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-teal transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-teal transition-colors">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
