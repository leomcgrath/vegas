import { createClient } from "@/lib/supabase/server";

export type LeaderboardRow = {
  user_id: string;
  display_name: string;
  total_units: number;
  total_amount: number;
};

export async function getLeaderboard() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vegas_leaderboard")
    .select("user_id, display_name, total_units, total_amount")
    .order("total_amount", { ascending: false });

  return (data ?? []) as LeaderboardRow[];
}
