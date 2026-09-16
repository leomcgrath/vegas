import type { BeerLog, GamblingLog } from "@/lib/stats";
import { deleteBeer, deleteGambling } from "@/app/actions";

type Entry =
  | { kind: "beer"; id: string; logged_at: string; units: number }
  | {
      kind: "gambling";
      id: string;
      logged_at: string;
      amount: number;
      note: string | null;
    };

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "akkurat nå";
  if (mins < 60) return `${mins} min siden`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} t siden`;
  const days = Math.floor(hours / 24);
  return `${days} d siden`;
}

export function ActivityList({
  beers,
  gambling,
}: {
  beers: BeerLog[];
  gambling: GamblingLog[];
}) {
  const entries: Entry[] = [
    ...beers.map((b) => ({ kind: "beer" as const, ...b })),
    ...gambling.map((g) => ({ kind: "gambling" as const, ...g })),
  ].sort((a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime());

  if (entries.length === 0) {
    return (
      <p className="text-center text-sm text-muted py-6">
        Ingenting logget i kveld enda. Sett i gang.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {entries.slice(0, 30).map((entry) => (
        <li
          key={`${entry.kind}-${entry.id}`}
          className="card-surface rounded-xl px-3 py-2 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-lg shrink-0">
              {entry.kind === "beer" ? "🍺" : entry.amount >= 0 ? "🟢" : "🔴"}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">
                {entry.kind === "beer"
                  ? `${entry.units} ${entry.units === 1 ? "enhet" : "enheter"}`
                  : `${entry.amount >= 0 ? "+" : ""}$${entry.amount.toFixed(0)}${
                      entry.note ? ` · ${entry.note}` : ""
                    }`}
              </p>
              <p className="text-[11px] text-muted">{timeAgo(entry.logged_at)}</p>
            </div>
          </div>
          <form action={entry.kind === "beer" ? deleteBeer : deleteGambling}>
            <input type="hidden" name="id" value={entry.id} />
            <button
              type="submit"
              aria-label="Slett oppføring"
              className="text-muted hover:text-red text-sm px-2"
            >
              ✕
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}
