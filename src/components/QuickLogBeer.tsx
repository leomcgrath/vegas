"use client";

import { useRef, useState, useTransition } from "react";
import { logBeer } from "@/app/actions";

const QUICK_AMOUNTS = [0.5, 1, 2];

export function QuickLogBeer() {
  const [custom, setCustom] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function submitAmount(units: number) {
    const fd = new FormData();
    fd.set("units", String(units));
    startTransition(async () => {
      await logBeer(fd);
    });
  }

  return (
    <div className="card-surface rounded-2xl p-4 flex flex-col gap-3">
      <h2 className="font-marquee text-xl text-teal">🍺 Logg en drink</h2>
      <div className="grid grid-cols-3 gap-2">
        {QUICK_AMOUNTS.map((amt) => (
          <button
            key={amt}
            type="button"
            disabled={isPending}
            onClick={() => submitAmount(amt)}
            className="rounded-xl border border-surface-border bg-background-alt py-2 text-sm font-ticker font-bold text-foreground active:scale-95 transition disabled:opacity-50"
          >
            +{amt}
          </button>
        ))}
      </div>
      <form
        ref={formRef}
        action={(fd) => {
          startTransition(async () => {
            await logBeer(fd);
            setCustom("");
          });
        }}
        className="flex gap-2"
      >
        <input
          name="units"
          type="number"
          step="0.5"
          min="0.5"
          inputMode="decimal"
          placeholder="Egendefinert antall"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          className="flex-1 rounded-xl border border-surface-border bg-background-alt px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-teal"
        />
        <button
          type="submit"
          disabled={isPending || !custom}
          className="rounded-xl bg-teal px-4 py-2 text-sm font-bold text-background disabled:opacity-40"
        >
          Logg
        </button>
      </form>
    </div>
  );
}
