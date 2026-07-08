import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getCache, setCache } from "@/lib/availabilityCache";

/*
 * GET /api/cities/availability?city=Denver&state=CO
 * Returns { taken: boolean } — one Featured slot per city total.
 *
 * Source of truth is the BFF featured_claims API (the directory's real
 * claims). Falls back to the legacy "Featured-Placement-City" Google Sheet
 * when BIG_SWING_BFF_URL is unset or the BFF call fails — same fail-open
 * behavior as every other site in this rollout.
 */

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  const credentials = JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

/** Read taken cities from the BFF featured_claims API; null = unavailable (fall back). */
async function getTakenCitiesFromBff(): Promise<{ city: string; state: string }[] | null> {
  const base = process.env.BIG_SWING_BFF_URL;
  const platformId = process.env.BIG_SWING_PLATFORM_ID;
  if (!base || !platformId) return null;
  try {
    const res = await fetch(
      `${base.replace(/\/+$/, "")}/api/v1/featured-claims?platform_id=${Number(platformId)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (data.items ?? []).map((i: { city: string; state: string }) => ({
      city: (i.city ?? "").toString().trim(),
      state: (i.state ?? "").toString().trim(),
    }));
  } catch {
    return null;
  }
}

/** Read whether one (city, state) is taken from the legacy sheet tab (fallback). */
async function getTakenFromSheet(city: string, state: string): Promise<boolean> {
  const auth = getAuth();
  const sheetId = process.env.LEADS_SHEET_ID;
  if (!auth || !sheetId) return false;

  try {
    const client = await auth.getClient();
    const sheets = (google.sheets as unknown as (o: object) => ReturnType<typeof google.sheets>)({ version: "v4", auth: client });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Featured-Placement-City!A:E",
    });

    const rows = res.data.values ?? [];
    for (const row of rows.slice(1)) {
      const [rowState, rowCity, status] = row as string[];
      if (!rowState || !rowCity || status === "cancelled") continue;
      if (rowCity === city && rowState === state) return true;
    }
    return false;
  } catch (err) {
    console.error("[availability] Sheet read error:", err);
    return false;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const state = searchParams.get("state");

  if (!city || !state) {
    return NextResponse.json({ taken: false });
  }

  const cacheKey = `${city}|${state}`;
  const cached = getCache(cacheKey);
  if (cached !== null) {
    return NextResponse.json({ taken: cached.length > 0 });
  }

  const takenCities = await getTakenCitiesFromBff();
  const taken =
    takenCities !== null
      ? takenCities.some((t) => t.city === city && t.state === state)
      : await getTakenFromSheet(city, state);

  setCache(cacheKey, taken ? [cacheKey] : []);
  return NextResponse.json({ taken });
}
