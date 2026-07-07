import type { ApplyFormData } from "@/lib/schema";
import type { SiteConfig } from "@/lib/config";
import type { SelectedMarket } from "@/lib/checkoutMarkets";
import type {
  ContactInfo,
  PlaqueShippingAddress,
  PaymentInfo,
  ListingInfo,
} from "@/lib/store/checkoutStore";

/**
 * Maps the checkout wizard's store state into topparalegals' existing
 * ApplyFormData shape (lib/schema.ts's applySchema), so it can be POSTed
 * straight to the existing /api/apply route (which validates against
 * applySchema and then calls the BFF via lib/bff.ts — this function does not
 * talk to the BFF directly).
 *
 * applySchema has no `bio`, `businessAddress`, `hours`, or `company` fields at
 * all (lib/bff.ts's payload confirms nothing downstream consumes them today),
 * so those store fields are deliberately left out of the returned object —
 * only fields applySchema actually defines are emitted here.
 *
 * This site's pricing model (lib/pricing.ts) sells Featured Placement per
 * city only — the store tracks a single `featured` boolean per selected
 * market (see lib/checkoutMarkets.ts's SelectedMarket), so featuredPlacement
 * is "was Featured selected for any market" and excludedFeatured is simply
 * the "city|state" keys of markets that opted out.
 */
export function buildSubmissionPayload(params: {
  config: SiteConfig;
  selectedMarkets: SelectedMarket[];
  specialtyIds: string[];
  contact: ContactInfo;
  plaqueShipping: PlaqueShippingAddress | null;
  payment: PaymentInfo;
  selectedUpsellIds: string[];
  listingChoice: "now" | "later";
  listingInfo: ListingInfo | null;
}): ApplyFormData {
  const specialtyOptions = params.config.specialty?.options ?? [];
  const serviceLabels = specialtyOptions
    .filter((o) => params.specialtyIds.includes(o.id))
    .map((o) => o.label);

  const featuredPlacement = params.selectedMarkets.some((m) => m.featured);
  const excludedFeatured = params.selectedMarkets
    .filter((m) => !m.featured)
    .map((m) => `${m.city}|${m.state}`);

  // applySchema has no `company` field, so when the applicant picks "Complete
  // Later" (listingInfo is null, no business name was ever collected) the
  // only stand-in available is the contact's own name — good enough to
  // satisfy applySchema's required businessName/businessPhone while the
  // applicant finishes the real listing details later via the emailed
  // checklist (see config.emailTemplates.completeLaterChecklist).
  const fallbackBusinessName = `${params.contact.firstName} ${params.contact.lastName}`.trim();

  return {
    type: "apply",
    businessName: params.listingInfo?.businessName || fallbackBusinessName || "Pending Listing",
    website: params.listingInfo?.website ?? "",
    businessPhone: params.listingInfo?.listingPhone || params.contact.phone,
    // Maps 1:1 from the store's grant/support enum (see checkoutStore.ts's
    // AssetPermission) onto applySchema's own "grant" | "support" enum.
    assetPermission: params.listingInfo?.assetPermission ?? "grant",

    locations: params.selectedMarkets.map((m) => ({ city: m.city, state: m.state })),
    services: serviceLabels,
    featuredPlacement,
    excludedFeatured,

    contactFirstName: params.contact.firstName,
    contactLastName: params.contact.lastName,
    email: params.contact.email,
    contactPhone: params.contact.phone,
    contactTitle: params.contact.title,
    plaqueShippingAddress: params.plaqueShipping?.street ?? "",
    plaqueShippingCity: params.plaqueShipping?.city ?? "",
    plaqueShippingState: params.plaqueShipping?.state ?? "",
    plaqueShippingZip: params.plaqueShipping?.zip ?? "",
    notes: params.contact.notes,

    cardNumber: params.payment.cardNumber,
    cardExpiry: params.payment.expiry,
    cardCvc: params.payment.cvv,
    cardName: params.payment.cardholderName,
    billingAddress: params.payment.billingAddress,
    billingCity: params.payment.billingCity,
    billingState: params.payment.billingState,
    billingZip: params.payment.billingZip,
    consentToTerms: true,
  };
}
