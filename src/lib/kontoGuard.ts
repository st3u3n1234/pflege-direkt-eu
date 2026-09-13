// Gemeinsamer Zugriffsschutz für /konto/index.astro. Anders als adminGuard.ts
// reicht hier eine gültige Session — keine Rollenprüfung, RLS scoped
// Bewerber ohnehin strikt auf ihre eigene(n) Zeile(n) (user_id = auth.uid()).
import { supabase } from "./supabaseClient";

export async function requireBewerberSession(): Promise<{ userId: string; email: string } | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    window.location.href = "/konto/anmelden";
    return null;
  }

  return {
    userId: sessionData.session.user.id,
    email: sessionData.session.user.email ?? "",
  };
}
