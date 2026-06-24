"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Phone, X } from "lucide-react";
import Container from "./Container";
import Button from "./Button";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/services", label: "Our Services" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy border-b border-navy-light shadow-lg">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/scales.svg" alt="TopParalegals.com" width={32} height={32} className="h-8 w-8 object-contain" />
            <span className="flex flex-col items-center">
              <span className="font-display text-lg font-bold text-white leading-none">
                TopParalegals<span className="text-teal">.com</span>
              </span>
              <span className="text-[9px] text-white/50 tracking-widest uppercase mt-0.5">
                Expertise &middot; Precision &middot; Trust
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-teal transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+18660000000"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-teal transition-colors"
            >
              <Phone className="h-4 w-4" />
              (866) 000-0000
            </a>
            <Button href="/apply" variant="primary" size="sm">
              Get Listed
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white hover:text-teal transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-navy-light bg-navy-dark">
          <Container>
            <nav className="py-4 flex flex-col gap-3" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-white/80 hover:text-teal transition-colors py-1"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 flex flex-col gap-3">
                <a
                  href="tel:+18660000000"
                  className="inline-flex items-center gap-2 text-base font-medium text-white/80 hover:text-teal transition-colors py-1"
                >
                  <Phone className="h-5 w-5" />
                  (866) 000-0000
                </a>
                <Button href="/apply" variant="primary" size="md" className="w-full" onClick={() => setMobileOpen(false)}>
                  Get Listed
                </Button>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
