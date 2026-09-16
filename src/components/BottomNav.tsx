"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Oversikt", icon: "🏠" },
  { href: "/leaderboard", label: "Poengtavle", icon: "🏆" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 border-t border-surface-border bg-background-alt/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto max-w-md grid grid-cols-2">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-bold transition ${
                active ? "text-pink" : "text-muted"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
