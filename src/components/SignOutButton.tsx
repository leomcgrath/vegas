import { signOut } from "@/app/actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-xs text-muted underline underline-offset-2"
      >
        Logg ut
      </button>
    </form>
  );
}
