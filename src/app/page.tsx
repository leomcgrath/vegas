import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/stats";
import { StatCard } from "@/components/StatCard";
import { QuickLogBeer } from "@/components/QuickLogBeer";
import { QuickLogGambling } from "@/components/QuickLogGambling";
import { ActivityList } from "@/components/ActivityList";
import { SignOutButton } from "@/components/SignOutButton";
import { BottomNav } from "@/components/BottomNav";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect("/login");

  const { beers, gambling, beerTrend, gamblingTrend, totalWinnings, totalUnits } =
    await getDashboardData(user.id);

  const displayName =
    (user.user_metadata?.display_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Storspiller";

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 pt-6 pb-24 flex flex-col gap-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-marquee text-3xl glow-pink text-pink leading-none">
            VEGAS TRACKER
          </h1>
          <p className="text-sm text-muted">Velkommen tilbake, {displayName}</p>
        </div>
        <SignOutButton />
      </header>

      <section className="grid grid-cols-2 gap-3">
        <StatCard
          icon="🍺"
          label="Øl i dag"
          value={totalUnits.toFixed(1)}
          trend={beerTrend}
          accent="gold"
        />
        <StatCard
          icon="🎰"
          label="Gevinst i dag"
          value={`${totalWinnings >= 0 ? "" : "-"}$${Math.abs(totalWinnings).toFixed(0)}`}
          trend={gamblingTrend}
          accent="pink"
        />
      </section>

      <QuickLogBeer />
      <QuickLogGambling />

      <section className="flex flex-col gap-2">
        <h2 className="font-marquee text-lg text-teal">Siste aktivitet</h2>
        <ActivityList beers={beers} gambling={gambling} />
      </section>
      <BottomNav />
    </main>
  );
}
