import sgMail from "@sendgrid/mail";
import type { ApplyFormData, ContactFormData } from "./schema";
import { calculateQuote, formatCurrency } from "./pricing";

const FROM_EMAIL = "info@topparalegals.com";
const FROM_NAME = "TopParalegals.com";
const REPLY_TO = "abansal@brianmarketinggroup.com";
const TEST_EMAIL = "abansal@brianmarketinggroup.com";
const NOTIFICATION_EMAILS = [
  "abansal@brianmarketinggroup.com",
];

function recipients(submitterEmail: string): string[] {
  return submitterEmail.toLowerCase() === TEST_EMAIL ? [TEST_EMAIL] : NOTIFICATION_EMAILS;
}

function isConfigured(): boolean {
  return Boolean(process.env.SENDGRID_API_KEY && process.env.SALES_INBOX_EMAIL);
}

function init() {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
}

export async function sendLeadEmail(
  data: ApplyFormData,
  meta: { referer: string; landingPage: string },
): Promise<void> {
  if (!isConfigured()) {
    console.log("[email] Skipping — SendGrid not configured.", { businessName: data.businessName });
    return;
  }
  init();

  const quote = calculateQuote({
    cities: data.locations,
    featured: data.featuredPlacement,
    excludedFeatured: data.excludedFeatured ?? [],
  });

  const cityCount = Math.max(1, data.locations.length);
  const excludedFeatured = data.excludedFeatured ?? [];

  const listingSubtotal = quote.lineItems
    .filter((li) => !li.label.startsWith("Featured"))
    .reduce((s, li) => s + li.amount, 0);
  const featuredSubtotal = quote.lineItems
    .filter((li) => li.label.startsWith("Featured"))
    .reduce((s, li) => s + li.amount, 0);

  const featuredLines: string[] = [];
  if (data.featuredPlacement) {
    let first = true;
    for (const loc of data.locations) {
      const key = `${loc.city}|${loc.state}`;
      if (!excludedFeatured.includes(key)) {
        const rate = first ? 689 : 345;
        featuredLines.push(`  ${loc.city}, ${loc.state}: ${formatCurrency(rate)}${first ? " (first city)" : " (50% off)"}`);
        first = false;
      }
    }
    excludedFeatured.forEach((key) => {
      const [city, state] = key.split("|");
      featuredLines.push(`  ${city}, ${state}: [opted out]`);
    });
  }

  const divider = "─".repeat(52);

  const text = `
New listing application received on TopParalegals.com

SOURCE
Traffic Source:  ${meta.referer || "direct"}
Landing Page:    ${meta.landingPage || "/apply"}
Submitted:       ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET

BUSINESS DETAILS
Business Name: ${data.businessName}
Website:       ${data.website || "—"}
Phone:         ${data.businessPhone}
Cities:        ${data.locations.map((l) => `${l.city}, ${l.state}`).join(" | ")}
Assets:        ${data.assetPermission === "grant" ? "Permission granted to use website assets" : "Support team to contact for assets"}

LEGAL SUPPORT SPECIALTIES
${data.services.map((p) => `  • ${p}`).join("\n")}
Featured Placement: ${data.featuredPlacement ? "Yes" : "No"}

CONTACT
Name:   ${data.contactFirstName} ${data.contactLastName}${data.contactTitle ? ` (${data.contactTitle})` : ""}
Email:  ${data.email}
Phone:  ${data.contactPhone}

ITEMIZED QUOTE
${divider}
BASIC LISTING (${cityCount} cit${cityCount > 1 ? "ies" : "y"} × $289/city)
  Basic listing subtotal:                              ${formatCurrency(listingSubtotal)}
${
  data.featuredPlacement && featuredLines.length > 0
    ? `
FEATURED LISTING UPGRADE
${featuredLines.join("\n")}
Featured subtotal:                                   ${formatCurrency(featuredSubtotal)}
`
    : data.featuredPlacement
    ? `
FEATURED LISTING: None selected
`
    : `
FEATURED LISTING: Not selected
`
}${divider}
TOTAL:                                               ${formatCurrency(quote.total)}
${divider}

NOTES
${data.notes || "—"}

PLAQUE SHIPPING ADDRESS
${data.plaqueShippingAddress}
${data.plaqueShippingCity}, ${data.plaqueShippingState} ${data.plaqueShippingZip}
`.trim();

  await sgMail.send({
    to: recipients(data.email),
    from: { email: FROM_EMAIL, name: FROM_NAME },
    replyTo: { email: REPLY_TO, name: FROM_NAME },
    subject: `New Application: ${data.businessName} — ${data.locations.map((l) => `${l.city}, ${l.state}`).join(" | ")}`,
    text,
  });
}

export async function sendContactEmail(
  data: ContactFormData,
  meta: { referer: string; landingPage: string },
): Promise<void> {
  if (!isConfigured()) {
    console.log("[email] Skipping — SendGrid not configured.", { email: data.email });
    return;
  }
  init();

  const text = `
New contact inquiry from TopParalegals.com

SOURCE
Traffic Source:  ${meta.referer || "direct"}
Landing Page:    ${meta.landingPage || "/contact"}
Submitted:       ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET

CONTACT
Name:    ${data.firstName} ${data.lastName}
Email:   ${data.email}
Phone:   ${data.phone || "—"}

Message:
${data.message}
`.trim();

  await sgMail.send({
    to: recipients(data.email),
    from: { email: FROM_EMAIL, name: FROM_NAME },
    replyTo: { email: REPLY_TO, name: FROM_NAME },
    subject: `Contact Inquiry: ${data.firstName} ${data.lastName}`,
    text,
  });
}
