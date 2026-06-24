import type { Metadata } from "next";
import Container from "@/components/Container";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <Container>
        <div className="max-w-3xl prose prose-sm prose-headings:font-display prose-headings:text-navy prose-a:text-teal">
          <h1 className="font-display text-3xl font-bold text-navy mb-2">Privacy Policy</h1>
          <p className="text-muted text-sm mb-8">Last updated: June 2026</p>

          <h2>1. Information We Collect</h2>
          <p>We collect information you provide when completing our listing application or contact form, including your name, email address, phone number, business details, and payment card information. We also automatically collect traffic source data via session storage to understand how visitors find us.</p>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information you provide to process your listing application, manage your account, send listing confirmation and invoice emails, and provide customer support. Payment details are used solely to process your annual listing fee.</p>

          <h2>3. Data Retention</h2>
          <p>We retain your information for as long as your listing is active and for a reasonable period thereafter to comply with legal obligations and resolve disputes.</p>

          <h2>4. Sharing of Information</h2>
          <p>We do not sell your personal information. We may share data with service providers (such as Google Sheets and SendGrid) strictly as necessary to operate the directory and deliver communications.</p>

          <h2>5. Cookies and Analytics</h2>
          <p>We use Google Analytics 4 to understand site traffic patterns. GA4 may set cookies in your browser. You can opt out using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-Out Browser Add-on</a>.</p>

          <h2>6. Security</h2>
          <p>We implement reasonable technical and organizational safeguards to protect your information. However, no transmission over the internet is completely secure.</p>

          <h2>7. Contact</h2>
          <p>Questions about this policy? Email us at <a href="mailto:info@topparalegals.com">info@topparalegals.com</a>.</p>
        </div>
      </Container>
    </div>
  );
}
