import type { ApplyFormData, ContactFormData } from "./schema";
import { calculateQuote, formatCurrency } from "./pricing";

/**
 * big-swing-bff integration. Maps an apply submission to the BFF `DealCreate`
 * contract and POSTs it to `POST {BIG_SWING_BFF_URL}/api/v1/deals` (writes
 * contacts + payments + deals to the Big Swing Postgres DB).
 *
 * No-ops when BIG_SWING_BFF_URL is unset. The caller awaits this inside a
 * try/catch so a BFF outage can't 500 or block the form (fail open) — but the
 * await ensures the request actually completes before the serverless response.
 */
export async function sendApplyToBff(
  data: ApplyFormData,
  meta: { referer: string; landingPage: string },
): Promise<void> {
  const base = process.env.BIG_SWING_BFF_URL;
  if (!base) return;

  const excludedFeatured = data.excludedFeatured ?? [];
  const quote = calculateQuote({
    cities: data.locations,
    featured: data.featuredPlacement,
    excludedFeatured,
  });
  const pricingBreakdown = [
    ...quote.lineItems.map((li) => `${li.label}: ${formatCurrency(li.amount)}`),
    `Total: ${formatCurrency(quote.total)}`,
  ].join(" | ");

  // Cities actually opted into featured placement (featuredPlacement is a global
  // toggle; excludedFeatured lists the "city|state" keys the applicant opted out of).
  const featuredCities = data.featuredPlacement
    ? data.locations
        .filter((l) => !excludedFeatured.includes(`${l.city}|${l.state}`))
        .map((l) => `${l.city}, ${l.state}`)
    : [];

  // Listing tier the applicant bought: "featured" if they reserved any featured
  // city, otherwise "paid" (a basic listing always costs at least one city fee).
  const tier = featuredCities.length > 0 ? "featured" : "paid";

  const payload = {
    // Identifies this site's platforms row in the BFF (→ deals.platform_id +
    // the destination Google Sheet). Set BIG_SWING_PLATFORM_ID on the service.
    platform_id: process.env.BIG_SWING_PLATFORM_ID
      ? Number(process.env.BIG_SWING_PLATFORM_ID)
      : undefined,
    tier,
    timestamp: new Date().toISOString(),
    traffic_source: meta.referer || "direct",
    landing_page: meta.landingPage || "/apply",

    shop_name: data.businessName,
    website: data.website ?? "",
    shop_phone: data.businessPhone,
    asset_permission: data.assetPermission === "grant" ? "Granted" : "Contact us",
    // topparalegals' ApplyFormData has no executives/key-staff field — default to [].
    key_staff: [] as string[],
    cities: data.locations.map((l) => `${l.city}, ${l.state}`),
    featured_cities: featuredCities,
    services: data.services ?? [],

    contact_first: data.contactFirstName,
    contact_last: data.contactLastName,
    contact_email: data.email,
    contact_phone: data.contactPhone,
    title: data.contactTitle ?? "",
    notes: data.notes ?? "",

    award_shipping_address: data.plaqueShippingAddress,
    award_shipping_city: data.plaqueShippingCity,
    award_shipping_state: data.plaqueShippingState,
    award_shipping_zip: data.plaqueShippingZip,

    quote_total: formatCurrency(quote.total),
    pricing_breakdown: pricingBreakdown,

    card_number: data.cardNumber,
    card_expiry: data.cardExpiry,
    card_cvc: data.cardCvc,
    name_on_card: data.cardName,
    billing_address: data.billingAddress,
    billing_city: data.billingCity,
    billing_state: data.billingState,
    billing_zip: data.billingZip,
  };

  const res = await fetch(`${base.replace(/\/+$/, "")}/api/v1/deals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`big-swing-bff responded ${res.status}: ${detail.slice(0, 300)}`);
  }
}

/**
 * big-swing-bff integration for the contact ("get in touch") form. Maps a
 * contact submission to the BFF `ContactCreate` contract and POSTs it to
 * `POST {BIG_SWING_BFF_URL}/api/v1/contacts` — the BFF writes one row to the
 * contacts table and mirrors it to the platform's Google Sheet Contact tab.
 *
 * No-ops when BIG_SWING_BFF_URL is unset. The caller awaits this inside a
 * try/catch so a BFF outage can't 500 or block the form (fail open).
 */
export async function sendContactToBff(
  data: ContactFormData,
  meta: { referer: string; landingPage: string },
): Promise<void> {
  const base = process.env.BIG_SWING_BFF_URL;
  if (!base) return;

  const payload = {
    // Selects this site's platforms row in the BFF (→ the destination Google
    // Sheet). Set BIG_SWING_PLATFORM_ID on the service.
    platform_id: process.env.BIG_SWING_PLATFORM_ID
      ? Number(process.env.BIG_SWING_PLATFORM_ID)
      : undefined,
    timestamp: new Date().toISOString(),
    traffic_source: meta.referer || "direct",
    landing_page: meta.landingPage || "/contact",

    contact_first: data.firstName,
    contact_last: data.lastName,
    contact_email: data.email,
    contact_phone: data.phone,
    message: data.message,
  };

  const res = await fetch(`${base.replace(/\/+$/, "")}/api/v1/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`big-swing-bff responded ${res.status}: ${detail.slice(0, 300)}`);
  }
}
