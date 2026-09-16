import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLeaderboard } from "@/lib/leaderboard";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { SignOutButton } from "@/components/SignOutButton";
import { BottomNav } from "@/components/BottomNav";

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect("/login");

  const rows = await getLeaderboard();

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 pt-6 pb-24 flex flex-col gap-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-marquee text-3xl glow-gold text-gold leading-none">
            POENGTAVLE
          </h1>
          <p className="text-sm text-muted">Alle storspillere, rangert.</p>
        </div>
        <SignOutButton />
      </header>

      <LeaderboardTable rows={rows} currentUserId={user.id} />
      <BottomNav />
    </main>
  );
}
