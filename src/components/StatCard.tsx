import type { Trend } from "@/lib/stats";

function TrendBadge({ trend }: { trend: Trend }) {
  if (trend.changePct === null) {
    return (
      <span className="text-xs font-ticker text-muted">
        {trend.today > 0 ? "ny" : "—"}
      </span>
    );
  }

  const isUp = trend.direction === "up";
  const isFlat = trend.direction === "flat";
  const color = isFlat ? "text-muted" : isUp ? "text-green" : "text-red";
  const arrow = isFlat ? "→" : isUp ? "▲" : "▼";

  return (
    <span className={`text-xs font-ticker font-bold ${color}`}>
      {arrow} {Math.abs(trend.changePct).toFixed(0)}%
    </span>
  );
}

export function StatCard({
  icon,
  label,
  value,
  trend,
  accent,
}: {
  icon: string;
  label: string;
  value: string;
  trend: Trend;
  accent: "pink" | "gold";
}) {
  const accentClass = accent === "pink" ? "glow-pink text-pink" : "glow-gold text-gold";

  return (
    <div className="card-surface rounded-2xl p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-lg">{icon}</span>
        <TrendBadge trend={trend} />
      </div>
      <span className={`font-ticker text-2xl font-bold ${accentClass}`}>{value}</span>
      <span className="text-[11px] uppercase tracking-wide text-muted">{label}</span>
    </div>
  );
}
