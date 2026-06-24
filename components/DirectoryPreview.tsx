"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MapPin, Star, Phone, Globe, CheckCircle2,
  TrendingUp, MessageSquare, AlignLeft, ChevronDown, Users, Zap,
} from "lucide-react";
import BrowserFrame from "./BrowserFrame";
import Container from "./Container";
import FadeIn from "./FadeIn";
import { previewCompanies } from "@/content/previewCompanies";

type View = "featured" | "profile" | "directory";

function StarRating({ rating, size = "sm" }: { rating: number; size?: "xs" | "sm" }) {
  const cls = size === "xs" ? "h-2 w-2" : "h-2.5 w-2.5 sm:h-3 sm:w-3";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${cls} ${i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
      ))}
    </div>
  );
}

function SiteNav() {
  return (
    <div className="bg-navy text-white px-3 py-2 sm:px-4 flex items-center gap-4">
      <AlignLeft className="h-4 w-4 text-white md:hidden" />
      <div className="flex items-center gap-1.5">
        <Image src="/scales.svg" alt="" width={16} height={16} className="h-4 w-4 object-contain" />
        <span className="flex flex-col items-center">
          <span className="text-white text-xs font-bold leading-none">TopParalegals<span className="text-teal">.com</span></span>
          <span className="text-[7px] text-white/40 tracking-widest uppercase leading-none mt-0.5">Expertise · Precision · Trust</span>
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-1 flex-1 max-w-xs bg-white/10 rounded text-[10px] px-2 py-1">
        <MapPin className="h-2.5 w-2.5 text-white/60 flex-shrink-0" />
        <span className="text-white/70 truncate">Dallas, TX</span>
      </div>
      <div className="hidden md:flex items-center gap-1 bg-white/10 rounded text-[10px] px-2 py-1">
        <span className="text-white/70">All Specialties</span>
        <ChevronDown className="h-2.5 w-2.5 text-white/60" />
      </div>
      <button className="ml-auto bg-teal text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap">
        List Your Services
      </button>
    </div>
  );
}

function FeaturedCard() {
  const company = previewCompanies.find((c) => c.featured)!;
  return (
    <div className="mx-2 sm:mx-3 my-2.5 sm:my-3 relative">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-teal via-blue-400 to-teal opacity-30 blur-md pointer-events-none" />
      <div className="relative rounded-xl overflow-hidden border border-teal/30 bg-gradient-to-br from-navy via-navy to-navy-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-teal/10 via-transparent to-teal/5 pointer-events-none" />
        <div className="flex items-center justify-between bg-gradient-to-r from-teal/20 to-transparent border-b border-teal/20 px-2.5 sm:px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-teal fill-teal/60" />
            <span className="text-[9px] sm:text-[10px] font-black text-teal uppercase tracking-widest">Featured Listing</span>
          </div>
          <span className="text-[7px] sm:text-[8px] font-bold text-teal/80 bg-teal/10 border border-teal/25 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
            Exclusive · 1 slot per city
          </span>
        </div>
        <div className="flex gap-2.5 sm:gap-3 p-2.5 sm:p-3">
          <div className="relative h-[72px] w-[88px] sm:h-20 sm:w-24 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-teal/50 shadow-lg shadow-teal/20">
            <Image src={company.imageUrl} alt={company.name} fill className="object-cover object-top" sizes="96px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[11px] sm:text-xs font-black text-white truncate">{company.name}</h4>
            <p className="text-[8px] sm:text-[9px] text-teal/70 truncate mt-0.5">{company.services.join(" · ")}</p>
            <div className="flex items-center gap-1 mt-1">
              <StarRating rating={company.rating} />
              <span className="text-[8px] text-white/40">({company.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="h-2 w-2 text-white/30 flex-shrink-0" />
              <span className="text-[8px] text-white/40 truncate">{company.location}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0 space-y-1">
            <p className="text-[9px] sm:text-[10px] font-semibold text-teal">{company.phone}</p>
            <button className="block w-full text-[9px] sm:text-[10px] bg-teal text-white font-black px-2 py-1 rounded shadow-sm shadow-teal/30">
              View Profile
            </button>
            <button className="block w-full text-[9px] sm:text-[10px] border border-teal/35 text-teal px-2 py-1 rounded font-medium">
              Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DirectoryContent({ showFeatured }: { showFeatured: boolean }) {
  const ranked = previewCompanies.filter((c) => c.rank);
  return (
    <div className="bg-gray-50 h-full">
      <SiteNav />
      <div className="bg-navy/95 px-4 py-3 text-center">
        <p className="text-white text-xs sm:text-sm font-semibold">Top Paralegals in Dallas, TX</p>
        <p className="text-white/50 text-[9px] sm:text-[10px] mt-0.5">Dallas, TX · {previewCompanies.length} professionals found</p>
      </div>

      {showFeatured ? (
        <FeaturedCard />
      ) : (
        <div className="m-2 sm:m-3 rounded-lg border border-dashed border-gray-300 bg-white p-3 flex items-center justify-center gap-2">
          <Zap className="h-3 w-3 text-gray-300 flex-shrink-0" />
          <p className="text-[9px] sm:text-[10px] text-gray-400 text-center">
            Featured Listing available — 1 slot · <span className="text-navy/50 font-semibold">first-come</span>
          </p>
        </div>
      )}

      <div className="px-2 sm:px-3 pb-4 space-y-2">
        <p className="text-[9px] sm:text-[10px] font-semibold text-gray-500 px-1">Top Paralegals in Dallas, TX</p>
        {ranked.map((company) => (
          <div key={company.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 bg-white hover:border-teal/30 transition-colors cursor-pointer">
            <span className="text-xs font-bold text-navy/40 w-4 text-center flex-shrink-0">{company.rank}</span>
            <div className="relative h-10 w-14 rounded overflow-hidden flex-shrink-0">
              <Image src={company.imageUrl} alt={company.name} fill className="object-cover object-top" sizes="56px" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-navy truncate">{company.name}</p>
              <p className="text-[8px] sm:text-[9px] text-gray-400 truncate">{company.services.join(" · ")}</p>
              <div className="flex items-center gap-1 mt-0.5"><StarRating rating={company.rating} /></div>
            </div>
            <button className="text-[9px] sm:text-[10px] bg-navy text-white px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0">View</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileContent() {
  const company = previewCompanies[1];
  return (
    <div className="bg-gray-50 h-full overflow-auto">
      <SiteNav />
      <div className="bg-navy px-3 py-4 sm:px-4">
        <div className="flex gap-3 items-start">
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white/20">
            <Image src={company.imageUrl} alt={company.name} fill className="object-cover object-top" sizes="64px" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <h3 className="text-[11px] sm:text-xs font-bold text-white leading-tight">{company.name}</h3>
              <span className="inline-flex items-center gap-0.5 bg-white/10 border border-white/20 text-white/80 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">
                <CheckCircle2 className="h-2 w-2" /> Verified
              </span>
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <StarRating rating={company.rating} />
              <span className="text-[9px] text-white/60">{company.rating} · {company.reviewCount} reviews</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5 text-white/40 flex-shrink-0" />
              <span className="text-[9px] text-white/60 truncate">{company.servingArea}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button className="flex-1 flex items-center justify-center gap-1 bg-teal text-white text-[10px] font-bold py-1.5 rounded">
            <Phone className="h-2.5 w-2.5" /> Call Now
          </button>
          <button className="flex-1 flex items-center justify-center gap-1 bg-white/10 border border-white/20 text-white text-[10px] font-semibold py-1.5 rounded">
            <Globe className="h-2.5 w-2.5" /> Website
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-0 p-2 sm:p-3">
        <div className="col-span-2 space-y-2 pr-2">
          <div className="bg-white rounded-lg border border-gray-100 p-2">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Legal Specialties</p>
            {company.services.map((service) => (
              <div key={service} className="flex items-center gap-1 mb-1">
                <CheckCircle2 className="h-2.5 w-2.5 text-teal flex-shrink-0" />
                <span className="text-[9px] text-gray-600 leading-tight">{service}</span>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-2 space-y-1.5">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Contact</p>
            <div className="flex items-center gap-1">
              <Phone className="h-2.5 w-2.5 text-navy/50 flex-shrink-0" />
              <span className="text-[9px] text-gray-600 truncate">{company.phone}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5 text-navy/50 flex-shrink-0" />
              <span className="text-[9px] text-gray-600 truncate">{company.location}</span>
            </div>
          </div>
          <div className="bg-navy rounded-lg p-2 text-center">
            <TrendingUp className="h-4 w-4 text-teal mx-auto mb-1" />
            <p className="text-[8px] font-bold text-white leading-tight">TopParalegals.com</p>
            <p className="text-[6px] text-white/40 tracking-widest uppercase mt-0.5">Expertise · Precision · Trust</p>
            <p className="text-[7px] text-teal/80 mt-0.5">2027 Recognized</p>
          </div>
        </div>

        <div className="col-span-3 space-y-2">
          <div className="bg-white rounded-lg border border-gray-100 p-2">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">About</p>
            <p className="text-[9px] text-gray-600 leading-relaxed">
              {company.name} is a top-rated paralegal service provider serving the Dallas metro area with expert legal support for law firms, attorneys, and individuals.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-2">
            <div className="flex items-center gap-1 mb-1.5">
              <Users className="h-2.5 w-2.5 text-gray-400" />
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Practice Areas</p>
            </div>
            {[
              { name: "Family Law Support", title: "Certified Paralegal" },
              { name: "Estate Planning Support", title: "Legal Document Specialist" },
            ].map((o) => (
              <div key={o.name} className="flex items-center gap-1.5 mb-1.5 last:mb-0">
                <div className="h-5 w-5 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[7px] font-bold text-teal">{o.name[0]}</span>
                </div>
                <div>
                  <p className="text-[8px] font-semibold text-gray-700 leading-none">{o.name}</p>
                  <p className="text-[7px] text-gray-400">{o.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-2">
            <div className="flex items-center gap-1 mb-1.5">
              <MessageSquare className="h-2.5 w-2.5 text-gray-400" />
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Reviews</p>
            </div>
            <div className="space-y-1.5">
              {[
                { author: "S. Williams", text: "Excellent legal support. Thorough, professional, and responsive." },
                { author: "D. Johnson", text: "Prepared all our documents accurately and on time. Highly recommend." },
              ].map((r) => (
                <div key={r.author} className="border-l-2 border-teal/30 pl-1.5">
                  <StarRating rating={5} size="xs" />
                  <p className="text-[8px] text-gray-500 mt-0.5 leading-tight">&ldquo;{r.text}&rdquo;</p>
                  <p className="text-[7px] text-gray-400 mt-0.5">— {r.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CALLOUTS: Record<View, { color: string; icon: React.ReactNode; text: React.ReactNode }> = {
  featured: {
    color: "bg-teal/5 border-teal/30",
    icon: <Zap className="h-4 w-4 text-teal fill-teal/60" />,
    text: <><span className="text-teal font-semibold">Featured Listing</span> — Your services are pinned as a highlighted banner above all ranked listings. Exclusive — only one provider per city, first-come, first-served.</>,
  },
  profile: {
    color: "bg-navy/5 border-navy/20",
    icon: <TrendingUp className="h-4 w-4 text-teal" />,
    text: <><span className="text-navy font-semibold">Professional Profile Page</span> — Every listed professional gets a dedicated profile with photo, legal specialties, practice areas, reviews, contact details, and your TopParalegals.com 2027 recognition badge.</>,
  },
  directory: {
    color: "bg-white border-sky-dark",
    icon: <span className="text-navy text-[10px] font-bold">✓</span>,
    text: <><span className="text-navy font-semibold">Directory Listing</span> — Your services appear in the ranked directory by city and legal specialty. Every visitor can click through to your full professional profile page.</>,
  },
};

export default function DirectoryPreview() {
  const [view, setView] = useState<View>("featured");
  const callout = CALLOUTS[view];

  const browserUrl =
    view === "profile"
      ? "topparalegals.com/professionals/clearwater-paralegal-group"
      : "topparalegals.com/dallas-tx";

  return (
    <section className="bg-sky py-20 lg:py-24 overflow-hidden relative">
      <Container>
        <FadeIn>
          <div className="text-center mb-10 relative z-40">
            <p className="text-xs font-semibold text-teal uppercase tracking-widest mb-3">
              Your Listing
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-4">
              What Your Listing Looks Like
            </h2>
            <div className="w-12 h-0.5 bg-teal mx-auto mb-5" />
            <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
              Every professional gets a ranked directory listing, a dedicated profile page, and an
              optional Featured Listing banner. See each view below.
            </p>
          </div>
        </FadeIn>

        {/* 3-way toggle */}
        <FadeIn delay={0.05}>
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-xl border border-sky-dark bg-white p-1 shadow-sm gap-1">
              <button
                onClick={() => setView("featured")}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  view === "featured"
                    ? "bg-teal text-white shadow-md shadow-teal/30"
                    : "text-muted hover:text-navy"
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                Featured Listing
              </button>
              <button
                onClick={() => setView("profile")}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  view === "profile" ? "bg-navy text-white shadow-sm" : "text-muted hover:text-navy"
                }`}
              >
                Professional Profile
              </button>
              <button
                onClick={() => setView("directory")}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  view === "directory" ? "bg-navy text-white shadow-sm" : "text-muted hover:text-navy"
                }`}
              >
                Directory
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Callout strip */}
        <FadeIn delay={0.07}>
          <div className="max-w-4xl mx-auto mb-4">
            <div className={`rounded-lg border px-4 py-3 flex items-start gap-3 ${callout.color}`}>
              <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${view === "featured" ? "bg-teal/10" : "bg-navy/10"}`}>
                {callout.icon}
              </div>
              <p className="text-xs text-muted leading-relaxed">{callout.text}</p>
            </div>
          </div>
        </FadeIn>

        {/* Browser preview */}
        <div className="relative max-w-4xl mx-auto pb-6 sm:pb-12">
          <FadeIn delay={0.1}>
            <div className="shadow-2xl shadow-navy/20 rounded-xl overflow-hidden ring-1 ring-black/5">
              <BrowserFrame url={browserUrl}>
                {view === "profile" ? (
                  <ProfileContent />
                ) : (
                  <DirectoryContent showFeatured={view === "featured"} />
                )}
              </BrowserFrame>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <p className="text-center text-sm text-muted mt-8 opacity-80 relative z-40">
            Preview — Listings go live{" "}
            <span className="text-teal font-semibold">August 2026.</span>
          </p>
        </FadeIn>
      </Container>
    </section>
  );
}
