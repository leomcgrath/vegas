"use client";

import { useState, useTransition } from "react";
import { logGambling } from "@/app/actions";

export function QuickLogGambling() {
  const [mode, setMode] = useState<"win" | "loss">("win");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="card-surface rounded-2xl p-4 flex flex-col gap-3">
      <h2 className="font-marquee text-xl text-pink">🎰 Logg et spill</h2>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMode("win")}
          className={`rounded-xl py-2 text-sm font-bold border transition ${
            mode === "win"
              ? "bg-green/20 border-green text-green"
              : "border-surface-border text-muted"
          }`}
        >
          Vinn
        </button>
        <button
          type="button"
          onClick={() => setMode("loss")}
          className={`rounded-xl py-2 text-sm font-bold border transition ${
            mode === "loss"
              ? "bg-red/20 border-red text-red"
              : "border-surface-border text-muted"
          }`}
        >
          Tap
        </button>
      </div>
      <form
        action={(fd) => {
          const raw = Number(fd.get("displayAmount"));
          if (!Number.isFinite(raw) || raw <= 0) return;
          const signed = mode === "win" ? raw : -raw;
          const submitFd = new FormData();
          submitFd.set("amount", String(signed));
          submitFd.set("note", String(fd.get("note") ?? ""));
          startTransition(async () => {
            await logGambling(submitFd);
            setAmount("");
            setNote("");
          });
        }}
        className="flex flex-col gap-2"
      >
        <div className="flex gap-2">
          <span className="flex items-center rounded-xl border border-surface-border bg-background-alt px-3 text-sm font-ticker text-muted">
            $
          </span>
          <input
            name="displayAmount"
            type="number"
            step="1"
            min="1"
            inputMode="decimal"
            placeholder="Beløp"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 rounded-xl border border-surface-border bg-background-alt px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-pink"
          />
        </div>
        <input
          name="note"
          type="text"
          placeholder="Bord/spill (valgfritt)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="rounded-xl border border-surface-border bg-background-alt px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-pink"
        />
        <button
          type="submit"
          disabled={isPending || !amount}
          className="rounded-xl bg-pink px-4 py-2 text-sm font-bold text-background disabled:opacity-40"
        >
          Logg {mode === "win" ? "vinn" : "tap"}
        </button>
      </form>
    </div>
  );
}
