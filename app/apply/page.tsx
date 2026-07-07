import type { Metadata } from "next";
import CheckoutWizard from "@/components/checkout/CheckoutWizard";
import { paralegalsConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Apply to Be Listed",
  description: "Apply to be listed on TopParalegals.com. Reach law firms, attorneys, businesses, and individuals actively searching for qualified legal support.",
};

export default function ApplyPage() {
  return <CheckoutWizard config={paralegalsConfig} />;
}
