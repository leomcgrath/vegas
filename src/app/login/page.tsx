"use client";

import { useActionState, useState } from "react";
import { signIn, signUp, type AuthResult } from "./actions";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signInState, signInAction, signInPending] = useActionState<
    AuthResult,
    FormData
  >(signIn, undefined);
  const [signUpState, signUpAction, signUpPending] = useActionState<
    AuthResult,
    FormData
  >(signUp, undefined);

  const state = mode === "signin" ? signInState : signUpState;
  const action = mode === "signin" ? signInAction : signUpAction;
  const pending = mode === "signin" ? signInPending : signUpPending;

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="text-center">
          <h1 className="font-marquee text-4xl glow-pink text-pink">
            VEGAS TRACKER
          </h1>
          <p className="text-sm text-muted mt-1">
            Det som skjer i Vegas, blir logget her.
          </p>
        </div>

        <div className="card-surface rounded-2xl p-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`rounded-xl py-2 text-sm font-bold border transition ${
                mode === "signin"
                  ? "bg-teal/20 border-teal text-teal"
                  : "border-surface-border text-muted"
              }`}
            >
              Logg inn
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-xl py-2 text-sm font-bold border transition ${
                mode === "signup"
                  ? "bg-teal/20 border-teal text-teal"
                  : "border-surface-border text-muted"
              }`}
            >
              Registrer deg
            </button>
          </div>

          <form key={mode} action={action} className="flex flex-col gap-3">
            {mode === "signup" && (
              <input
                name="displayName"
                type="text"
                placeholder="Visningsnavn"
                className="rounded-xl border border-surface-border bg-background-alt px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-teal"
              />
            )}
            <input
              name="email"
              type="email"
              required
              placeholder="E-post"
              className="rounded-xl border border-surface-border bg-background-alt px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-teal"
            />
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Passord"
              className="rounded-xl border border-surface-border bg-background-alt px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-teal"
            />

            {state && "error" in state && (
              <p className="text-xs text-red">{state.error}</p>
            )}
            {state && "message" in state && (
              <p className="text-xs text-green">{state.message}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="rounded-xl bg-pink px-4 py-2 text-sm font-bold text-background disabled:opacity-40"
            >
              {pending
                ? "Kaster terningene…"
                : mode === "signin"
                  ? "Logg inn"
                  : "Opprett konto"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
