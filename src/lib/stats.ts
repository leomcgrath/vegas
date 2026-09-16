import { createClient } from "@/lib/supabase/server";

export type BeerLog = { id: string; units: number; logged_at: string };
export type GamblingLog = {
  id: string;
  amount: number;
  note: string | null;
  logged_at: string;
};

export type Trend = {
  today: number;
  yesterday: number;
  changePct: number | null; // null means "no baseline yet"
  direction: "up" | "down" | "flat";
};

function dayBounds(offsetDays: number) {
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - offsetDays)
  );
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

function sumInRange<T extends { logged_at: string }>(
  rows: T[],
  key: keyof T,
  start: Date,
  end: Date
) {
  return rows.reduce((total, row) => {
    const t = new Date(row.logged_at);
    if (t >= start && t < end) return total + Number(row[key]);
    return total;
  }, 0);
}

function toTrend(today: number, yesterday: number): Trend {
  if (yesterday === 0) {
    return {
      today,
      yesterday,
      changePct: today === 0 ? null : null,
      direction: today > 0 ? "up" : "flat",
    };
  }
  const changePct = ((today - yesterday) / Math.abs(yesterday)) * 100;
  return {
    today,
    yesterday,
    changePct,
    direction: changePct > 0.01 ? "up" : changePct < -0.01 ? "down" : "flat",
  };
}

export async function getDashboardData(userId: string) {
  const supabase = await createClient();

  const [beerRes, gamblingRes] = await Promise.all([
    supabase
      .from("vegas_beer_logs")
      .select("id, units, logged_at")
      .eq("user_id", userId)
      .order("logged_at", { ascending: false })
      .limit(200),
    supabase
      .from("vegas_gambling_logs")
      .select("id, amount, note, logged_at")
      .eq("user_id", userId)
      .order("logged_at", { ascending: false })
      .limit(200),
  ]);

  const beers = (beerRes.data ?? []) as BeerLog[];
  const gambling = (gamblingRes.data ?? []) as GamblingLog[];

  const today = dayBounds(0);
  const yesterday = dayBounds(1);

  const beerTrend = toTrend(
    sumInRange(beers, "units", today.start, today.end),
    sumInRange(beers, "units", yesterday.start, yesterday.end)
  );

  const gamblingTrend = toTrend(
    sumInRange(gambling, "amount", today.start, today.end),
    sumInRange(gambling, "amount", yesterday.start, yesterday.end)
  );

  const totalWinnings = gambling.reduce((sum, g) => sum + Number(g.amount), 0);
  const totalUnits = beers.reduce((sum, b) => sum + Number(b.units), 0);

  return { beers, gambling, beerTrend, gamblingTrend, totalWinnings, totalUnits };
}
