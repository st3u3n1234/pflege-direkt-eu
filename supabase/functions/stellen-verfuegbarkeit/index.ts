// Edge Function: stellen-verfuegbarkeit
//
// Read-only. Nimmt { qualifikation, einsatzbereich } und gibt zurück, welche
// (Test-)Kliniken für genau diese Kombination eine aktive offene Stelle
// haben. Keine personenbezogenen Daten — nur Klinik-Name/Region. RLS lässt
// anon/authenticated auf "stellen"/"kliniken" nicht direkt zu, daher läuft
// der Zugriff hier über den Service-Role-Client, genau wie bei
// "bewerbung-einreichen".
//
// WICHTIG: Die zurückgegebenen Kliniken sind aktuell Testdaten/Platzhalter
// (siehe docs/SPEC.md) — vor echtem Betrieb durch reale Daten ersetzen.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { enums } from "./_shared/enums.ts";

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
  qualifikation: z.enum(enums.qualifikation as [string, ...string[]]),
  einsatzbereich: z.enum(enums.einsatzbereich as [string, ...string[]]),
});

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Methode nicht erlaubt" });
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

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await supabaseAdmin
    .from("stellen")
    .select("id, klinik_id, kliniken(name, region)")
    .eq("qualifikation", parsed.data.qualifikation)
    .eq("einsatzbereich", parsed.data.einsatzbereich)
    .eq("aktiv", true);

  if (error) {
    console.error("Verfügbarkeitsabfrage fehlgeschlagen", error);
    return jsonResponse(500, { error: "Interner Fehler" });
  }

  const kliniken = (data ?? []).map((row) => ({
    klinikId: row.klinik_id,
    name: (row.kliniken as unknown as { name: string; region: string | null })?.name,
    region: (row.kliniken as unknown as { name: string; region: string | null })?.region,
  }));

  return jsonResponse(200, { kliniken, istTestdaten: true });
});
