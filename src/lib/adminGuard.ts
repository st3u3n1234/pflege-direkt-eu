// Gemeinsamer Zugriffsschutz für alle Admin-Seiten außer /admin/login.
// Prüft Session UND is_admin() (nicht nur "eingeloggt") — RLS erzwingt das
// serverseitig ohnehin, aber ohne diesen Check würde ein eingeloggter
// Nicht-Admin eine leere/kaputte Seite statt einer klaren Weiterleitung sehen.
import { supabase } from "./supabaseClient";

export async function requireAdmin(): Promise<{ userId: string; email: string } | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    window.location.href = "/admin/login";
    return null;
  }

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) {
    await supabase.auth.signOut();
    window.location.href = "/admin/login?fehler=nicht_autorisiert";
    return null;
  }

  return {
    userId: sessionData.session.user.id,
    email: sessionData.session.user.email ?? "",
  };
}
