// Gemeinsamer Supabase-Client für den Admin-Bereich. Nutzt denselben
// öffentlichen anon-Key wie die Edge Functions (kein Geheimnis, siehe
// CLAUDE.md) — die eigentliche Autorisierung läuft über RLS + is_admin(),
// nicht über den Key selbst.
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
);
