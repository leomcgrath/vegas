"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthResult = { error: string } | { message: string } | undefined;

const ERROR_TRANSLATIONS: Record<string, string> = {
  "Invalid login credentials": "Feil e-post eller passord.",
  "Email not confirmed": "E-posten er ikke bekreftet enda. Sjekk innboksen din.",
  "User already registered": "Det finnes allerede en bruker med denne e-posten.",
  "email rate limit exceeded": "For mange forsøk. Vent litt og prøv igjen.",
  "Password should be at least 6 characters": "Passordet må være minst 6 tegn.",
};

function translateAuthError(message: string) {
  for (const [key, value] of Object.entries(ERROR_TRANSLATIONS)) {
    if (message.toLowerCase().includes(key.toLowerCase())) return value;
  }
  return "Noe gikk feil. Prøv igjen.";
}

export async function signIn(
  _prev: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: translateAuthError(error.message) };

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUp(
  _prev: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: displayName ? { display_name: displayName } : undefined,
    },
  });

  if (error) return { error: translateAuthError(error.message) };

  if (!data.session) {
    return { message: "Sjekk e-posten din for å bekrefte kontoen, og logg deretter inn." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
