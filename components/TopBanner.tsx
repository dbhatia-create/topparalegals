import { Phone, Sparkles } from "lucide-react";
import Container from "./Container";

export default function TopBanner() {
  return (
    <div className="bg-[#0a0f1c] border-b border-white/10 py-3">
      <Container>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 h-9 w-9 rounded-full border border-teal/30 bg-teal/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-teal" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white leading-tight">
                TopParalegals.com — Launching August 2026.
              </p>
              <p className="text-xs text-white/50 mt-0.5 leading-tight">
                The premier directory for qualified paralegal and legal support services.{" "}
                <span className="text-teal font-medium">All listings debut August 2026.</span>
              </p>
            </div>
          </div>
          <a
            href="tel:+18660000000"
            className="flex-shrink-0 hidden sm:inline-flex items-center gap-2 border border-teal/40 text-teal text-sm font-semibold px-4 py-2 rounded-lg hover:bg-teal/10 transition-colors whitespace-nowrap"
          >
            <Phone className="h-3.5 w-3.5" />
            (866) 000-0000
          </a>
        </div>
      </Container>
    </div>
  );
}
