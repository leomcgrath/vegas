"use client";

import { useMemo, useState } from "react";
import type { LeaderboardRow } from "@/lib/leaderboard";

const MEDALS = ["🥇", "🥈", "🥉"];

export function LeaderboardTable({
  rows,
  currentUserId,
}: {
  rows: LeaderboardRow[];
  currentUserId: string;
}) {
  const [sortBy, setSortBy] = useState<"amount" | "units">("amount");

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) =>
      sortBy === "amount" ? b.total_amount - a.total_amount : b.total_units - a.total_units
    );
  }, [rows, sortBy]);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setSortBy("amount")}
          className={`rounded-xl py-2 text-sm font-bold border transition ${
            sortBy === "amount"
              ? "bg-pink/20 border-pink text-pink"
              : "border-surface-border text-muted"
          }`}
        >
          🎰 Gevinst
        </button>
        <button
          type="button"
          onClick={() => setSortBy("units")}
          className={`rounded-xl py-2 text-sm font-bold border transition ${
            sortBy === "units"
              ? "bg-gold/20 border-gold text-gold"
              : "border-surface-border text-muted"
          }`}
        >
          🍺 Øl
        </button>
      </div>

      <ul className="flex flex-col gap-2">
        {sorted.map((row, i) => {
          const isYou = row.user_id === currentUserId;
          return (
            <li
              key={row.user_id}
              className={`card-surface rounded-xl px-3 py-3 flex items-center justify-between gap-3 ${
                isYou ? "border-teal" : ""
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-ticker text-sm w-6 shrink-0 text-muted">
                  {MEDALS[i] ?? `#${i + 1}`}
                </span>
                <p className="text-sm font-bold truncate">
                  {row.display_name}
                  {isYou && <span className="text-teal"> (deg)</span>}
                </p>
              </div>
              <div className="text-right shrink-0">
                {sortBy === "amount" ? (
                  <span
                    className={`font-ticker text-sm font-bold ${
                      row.total_amount >= 0 ? "text-green" : "text-red"
                    }`}
                  >
                    {row.total_amount >= 0 ? "+" : "-"}$
                    {Math.abs(row.total_amount).toFixed(0)}
                  </span>
                ) : (
                  <span className="font-ticker text-sm font-bold text-gold">
                    {row.total_units.toFixed(1)} enheter
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {sorted.length === 0 && (
        <p className="text-center text-sm text-muted py-6">
          Ingen på tavlen enda. Logg noe for å ta førsteplassen.
        </p>
      )}
    </div>
  );
}
