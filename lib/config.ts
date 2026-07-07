/**
 * SiteConfig drives the checkout wizard (components/checkout/**) — every
 * screen reads behavior off this instead of hardcoding vertical-specific
 * logic, so the same wizard code can be reused across other BMG directory
 * sites later.
 *
 * Ported from topgeriatricians' lib/config.ts (same scaffold generation,
 * closest sibling: city_and_specialty scope where specialties are a
 * required-but-unpriced multi-select). Pricing, specialty list, and listing
 * fields below are derived from this site's own lib/pricing.ts (PRICING),
 * content/services.ts (the 17 top-level legal support specialty labels —
 * matching `allServiceLabels`, which is what lib/schema.ts's applySchema
 * actually validates `services` against, NOT the flattened per-service
 * sub-specialty tags), and the old components/ApplyForm.tsx (Step 3's actual
 * field set and copy).
 */

import { services } from "@/content/services";

export type MarketType =
  | "city"
  | "zip"
  | "county"
  | "airport"
  | "specialty"
  | "practiceArea"
  | "state";

export type SearchMode =
  | "state+city"
  | "zip"
  | "county"
  | "airport"
  | "specialty"
  | "practiceArea";

export interface ListingTier {
  id: string;
  label: string;
  isPaid: boolean;
  basePrice: number;
}

export type UpsellKind = "extra-year" | "extra-city" | "statewide" | "nationwide" | "sister-site";

export interface UpsellOption {
  id: string;
  label: string;
  description: string;
  price: number;
  kind: UpsellKind;
}

export interface SpecialtyOption {
  id: string;
  label: string;
}

export interface SiteConfig {
  siteName: string;
  brandTagline: string;
  businessNoun: string;

  marketType: MarketType;
  marketLabel: string;
  searchMode: SearchMode;

  listingTier: ListingTier;
  featuredScope: "city" | "city_and_specialty" | "specialty_only";
  // Cosmetic "starting at" display value only — the real per-slot price
  // (first city vs. additional cities) is computed by lib/pricing.ts's
  // calculateQuote(), not this flat config value.
  featuredUpgradePrice: number;
  upsells: UpsellOption[];

  specialty: {
    required: boolean;
    label: string;
    options: SpecialtyOption[];
    pricePerOption: number;
  } | null;

  shippingRequired: boolean;

  listingFields: {
    bioMaxChars: number;
    fileUploadTypes: Array<"logo" | "profilePhoto" | "bannerImage">;
  };

  emailTemplates: {
    completeLaterChecklist: string;
    ccAddress: string;
  };

  multiMarketDiscount: {
    minMarkets: number;
    percentOff: number;
  };

  productionTimelineDays: number;
}

export const paralegalsConfig: SiteConfig = {
  siteName: "Top Paralegals",
  brandTagline: "Get Listed — TopParalegals.com",
  businessNoun: "paralegal service",

  marketType: "city",
  marketLabel: "City",
  searchMode: "state+city",

  // Basic listing is a per-city annual fee (lib/pricing.ts's basicPerCity) —
  // matches components/Pricing.tsx's "One annual fee per city" copy.
  listingTier: {
    id: "standard",
    label: "Standard Listing",
    isPaid: true,
    basePrice: 289,
  },
  // Featured Placement is sold strictly per-city here — lib/pricing.ts has no
  // per-specialty rate (only basicPerCity/featuredFirstCity/featuredAdditionalCity),
  // the old ApplyForm.tsx copy says "$689 first city, $345 each additional. Only
  // 1 per city.", and app/api/cities/availability/route.ts keys availability on
  // city+state alone (no specialty dimension) — so this stays "city", the same
  // conclusion topgeriatricians reached, even though specialties are *required*
  // here (unlike topgeriatricians, where they're optional).
  featuredScope: "city",
  featuredUpgradePrice: 689,

  // No enhancement upsells exist for this site today (ApplyForm.tsx's Cities &
  // Specialties / Billing steps only offer Featured Placement and adding more
  // cities, both already modeled via featuredScope/multi-market).
  upsells: [],

  // "Legal Support Specialties" are a *required* multi-select in the old
  // ApplyForm.tsx ("Legal Support Specialties *" — see components/ApplyForm.tsx
  // line ~353) and lib/schema.ts's applySchema enforces `services.min(1)` plus
  // a refine against `allServiceLabels` (content/services.ts's top-level service
  // labels, not the flattened per-service `specialties` sub-tags). ApplyForm.tsx
  // is explicit that these "do not affect pricing" and lib/pricing.ts has no
  // per-service rate, so pricePerOption is 0 — required is true, unlike
  // topgeriatricians (optional) but matching topinsuranceagents' required-ness.
  specialty: {
    required: true,
    label: "Legal Support Specialties",
    options: services.map((s) => ({ id: s.id, label: s.label })),
    pricePerOption: 0,
  },

  // The old ApplyForm.tsx always collects a "Complimentary Plaque Delivery"
  // shipping address, and lib/schema.ts's applySchema requires
  // plaqueShippingAddress/City/State/Zip — so shipping is always required.
  shippingRequired: true,

  listingFields: {
    bioMaxChars: 1500,
    fileUploadTypes: ["logo", "profilePhoto", "bannerImage"],
  },

  emailTemplates: {
    completeLaterChecklist: "complete-later-checklist-v1",
    ccAddress: "support@digitalservicebrands.com",
  },

  // No multi-city discount offered today — set minMarkets unreachably high
  // rather than deleting the field (required by SiteConfig).
  multiMarketDiscount: {
    minMarkets: 999999,
    percentOff: 0,
  },

  productionTimelineDays: 10,
};
