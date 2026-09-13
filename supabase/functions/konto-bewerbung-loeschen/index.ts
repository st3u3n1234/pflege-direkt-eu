// Edge Function: konto-bewerbung-loeschen (Art. 17 DSGVO, Selbstauskunft)
//
// Self-Service-Pendant zu admin-bewerbung-loeschen: löscht die eigene
// Bewerbung vollständig, inkl. aller Storage-Objekte (müssen VOR dem
// DB-Delete entfernt werden, da storage_pfad sonst durch die Kaskade
// mitgelöscht wird). Schreibt abschließend einen audit_log-Eintrag — ohne
// die gelöschten Inhalte zu spiegeln.
//
// Läuft mit service_role aus demselben Grund wie admin-bewerbung-loeschen
// (storage.objects lässt sich nicht per RLS/rohem SQL löschen). Autorisiert
// wird hier aber über Besitz (bewerbungen.user_id === auth.uid()), nicht
// über is_admin().

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const RequestSchema = z.object({
  bewerbung_id: z.string().uuid(),
});

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Methode nicht erlaubt" });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse(401, { error: "Nicht angemeldet" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Client im Namen des aufrufenden Nutzers — nur damit lässt sich prüfen,
  // WER die Anfrage stellt (nicht mit dem service_role-Client).
  const supabaseUser = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userError } = await supabaseUser.auth.getUser();
  if (userError || !userData.user) {
    return jsonResponse(401, { error: "Nicht angemeldet" });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse(400, { error: "Ungültiges JSON" });
  }

  const parsed = RequestSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonResponse(422, {
      error: "Validierung fehlgeschlagen",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const bewerbungId = parsed.data.bewerbung_id;
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  const { data: bestehendeBewerbung } = await supabaseAdmin
    .from("bewerbungen")
    .select("id, user_id")
    .eq("id", bewerbungId)
    .maybeSingle();

  if (!bestehendeBewerbung) {
    return jsonResponse(404, { error: "Bewerbung nicht gefunden" });
  }

  if (bestehendeBewerbung.user_id !== userData.user.id) {
    return jsonResponse(403, { error: "Nicht autorisiert" });
  }

  const { data: dokumente, error: dokumenteError } = await supabaseAdmin
    .from("dokumente")
    .select("storage_pfad")
    .eq("bewerbung_id", bewerbungId);

  if (dokumenteError) {
    console.error("Dokumente konnten nicht geladen werden", dokumenteError);
    return jsonResponse(500, { error: "Löschen fehlgeschlagen" });
  }

  const pfade = (dokumente ?? []).map((d) => d.storage_pfad);
  if (pfade.length > 0) {
    const { error: removeError } = await supabaseAdmin.storage.from("zeugnisse").remove(pfade);
    if (removeError) {
      console.error("Storage-Objekte konnten nicht gelöscht werden", removeError);
      return jsonResponse(500, { error: "Löschen der Dokumente fehlgeschlagen" });
    }
  }

  const { error: deleteError } = await supabaseAdmin.from("bewerbungen").delete().eq("id", bewerbungId);
  if (deleteError) {
    console.error("Bewerbung konnte nicht gelöscht werden", deleteError);
    return jsonResponse(500, { error: "Löschen fehlgeschlagen" });
  }

  await supabaseAdmin.from("audit_log").insert({
    admin_user_id: null,
    aktion: "bewerbung_selbst_geloescht",
    zieltabelle: "bewerbungen",
    ziel_id: bewerbungId,
    details: { anzahl_dokumente: pfade.length, bewerber_user_id: userData.user.id },
  });

  return jsonResponse(200, { erfolg: true });
});
