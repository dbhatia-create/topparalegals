"use client";

import { useEffect, useState } from "react";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";
import UpsellCard from "@/components/checkout/UpsellCard";
import FeaturedCityOffer from "@/components/checkout/FeaturedCityOffer";
import OrderSummarySidebar from "@/components/checkout/OrderSummarySidebar";
import { useCheckoutStore } from "@/lib/store/checkoutStore";
import type { SiteConfig } from "@/lib/config";

export default function Step4Upsells({ config }: { config: SiteConfig }) {
  const selectedMarkets = useCheckoutStore((s) => s.selectedMarkets);
  const toggleMarketFeatured = useCheckoutStore((s) => s.toggleMarketFeatured);
  const selectedUpsellIds = useCheckoutStore((s) => s.selectedUpsellIds);
  const toggleUpsell = useCheckoutStore((s) => s.toggleUpsell);
  const goNext = useCheckoutStore((s) => s.goNext);
  const goBack = useCheckoutStore((s) => s.goBack);

  // Featured Placement here is sold one-per-city, so availability is checked
  // against the real /api/cities/availability route (backed by the
  // "Featured-Placement-City" sheet — the same source
  // components/ApplyForm.tsx's checkCityAvailability() reads) rather than a
  // static field on Market, which carries no availability data.
  const [takenMarketIds, setTakenMarketIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (selectedMarkets.length === 0) {
      setTakenMarketIds(new Set());
      return;
    }
    let cancelled = false;
    Promise.all(
      selectedMarkets.map(async (m) => {
        try {
          const params = new URLSearchParams({ city: m.city, state: m.state });
          const res = await fetch(`/api/cities/availability?${params.toString()}`);
          const data = res.ok ? await res.json() : { taken: false };
          return { marketId: m.marketId, taken: Boolean(data.taken) };
        } catch {
          return { marketId: m.marketId, taken: false };
        }
      }),
    ).then((results) => {
      if (cancelled) return;
      setTakenMarketIds(new Set(results.filter((r) => r.taken).map((r) => r.marketId)));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selectedMarkets.map((m) => `${m.city}|${m.state}`))]);

  const featuredEligible = selectedMarkets.filter((m) => !takenMarketIds.has(m.marketId));
  const featuredSoldOut = selectedMarkets.filter((m) => takenMarketIds.has(m.marketId));

  return (
    <FadeIn>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {featuredEligible.length > 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-primary mb-1">
                  Hey — Featured placement in your selected cities is available
                </h2>
                <p className="text-sm text-muted">
                  Want to be the top {config.businessNoun} in each of these cities? Featured
                  listings get top placement and a highlighted badge.
                </p>
              </div>
              <div className="space-y-4">
                {featuredEligible.map((m) => (
                  <FeaturedCityOffer
                    key={m.marketId}
                    city={m.city}
                    state={m.state}
                    businessNoun={config.businessNoun}
                    price={config.featuredUpgradePrice}
                    isSelected={m.featured}
                    onToggle={() => toggleMarketFeatured(m.marketId)}
                  />
                ))}
              </div>
              {featuredSoldOut.length > 0 && (
                <p className="text-xs text-muted italic">
                  Featured is sold out in{" "}
                  {featuredSoldOut.map((m) => `${m.city}, ${m.state}`).join("; ")} — basic listing
                  is still available there.
                </p>
              )}
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-primary mb-1">Recommended Enhancements</h2>
            <p className="text-sm text-muted">
              Boost your visibility. Selections update your order total immediately.
            </p>
          </div>

          {config.upsells.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {config.upsells.map((upsell) => (
                <UpsellCard
                  key={upsell.id}
                  upsell={upsell}
                  isSelected={selectedUpsellIds.includes(upsell.id)}
                  onToggle={() => toggleUpsell(upsell.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted italic">No additional enhancements offered today.</p>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={goBack}>
              Back
            </Button>
            <Button onClick={goNext}>Continue</Button>
          </div>
        </div>

        <OrderSummarySidebar config={config} />
      </div>
    </FadeIn>
  );
}
