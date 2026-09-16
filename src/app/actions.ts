"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function logBeer(formData: FormData) {
  const units = Number(formData.get("units"));
  if (!Number.isFinite(units) || units <= 0) return;

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;

  await supabase
    .from("vegas_beer_logs")
    .insert({ user_id: data.user.id, units });

  revalidatePath("/");
}

export async function logGambling(formData: FormData) {
  const amount = Number(formData.get("amount"));
  const note = String(formData.get("note") ?? "").trim() || null;
  if (!Number.isFinite(amount) || amount === 0) return;

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;

  await supabase
    .from("vegas_gambling_logs")
    .insert({ user_id: data.user.id, amount, note });

  revalidatePath("/");
}

export async function deleteBeer(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("vegas_beer_logs").delete().eq("id", id);
  revalidatePath("/");
}

export async function deleteGambling(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("vegas_gambling_logs").delete().eq("id", id);
  revalidatePath("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
