// Edge Function: bewerbung-einreichen
//
// Einziger Schreibweg für Bewerbungen. Validiert serverseitig mit Zod,
// prüft ein IP-basiertes Rate-Limit, legt den Datensatz mit dem
// Service-Role-Client an (RLS erlaubt anon/authenticated ohnehin keinen
// Zugriff) und gibt eine signierte Upload-URL für den Zeugnis-Nachweis
// zurück, statt die Datei selbst durch die Function zu schleusen.
//
// Aufruf erwartet den anon/publishable Key als Bearer-Token (Standard bei
// supabase-js) — verify_jwt bleibt aktiv, das ist kein Nutzer-Login, nur ein
// Nachweis, dass die Anfrage von einem Client mit dem öffentlichen Projekt-
// Key kommt, nicht von beliebigem Bot-Traffic ohne jeden Header.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { enums } from "./_shared/enums.ts";

const RATE_LIMIT_MAX_PRO_STUNDE = 5;
const RATE_LIMIT_FENSTER_MS = 60 * 60 * 1000;
const RATE_LIMIT_LOG_TTL_MS = 24 * 60 * 60 * 1000;

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

function toEnum(values: string[]) {
  return z.enum(values as [string, ...string[]]);
}

const BewerbungSchema = z
  .object({
    vorname: z.string().trim().min(1).max(100),
    nachname: z.string().trim().min(1).max(100),
    strasse: z.string().trim().min(1).max(200),
    plz: z.string().trim().regex(/^[0-9]{5}$/, "PLZ muss aus genau 5 Ziffern bestehen"),
    ort: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(200),
    telefon: z.string().trim().min(3).max(30),
    qualifikation: toEnum(enums.qualifikation),
    fachweiterbildung: toEnum(enums.fachweiterbildung).default("Nein"),
    einsatzbereich: toEnum(enums.einsatzbereich),
    arbeitszeitmodell: toEnum(enums.arbeitszeitmodell),
    wochenstunden: z.number().int().min(1).max(48).optional(),
    arbeitsort_region: z.string().trim().min(1).max(200),
    eintrittstermin: toEnum(enums.eintrittstermin),
    datenschutz_zugestimmt: z.literal(true, {
      errorMap: () => ({ message: "Zustimmung zur Datenschutzerklärung ist erforderlich" }),
    }),
  })
  .refine(
    (data) =>
      (data.arbeitszeitmodell === "Individuelle Wochenstunden") ===
      (data.wochenstunden !== undefined),
    {
      message:
        'wochenstunden ist nur bei arbeitszeitmodell "Individuelle Wochenstunden" erlaubt und dann erforderlich',
      path: ["wochenstunden"],
    },
  );

async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

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

  const parsed = BewerbungSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonResponse(422, {
      error: "Validierung fehlgeschlagen",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  // Rate-Limit: gehashte IP (HMAC mit dem Service-Role-Key als Pepper —
  // dadurch kein zusätzliches, separat zu pflegendes Secret nötig).
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = await hmacSha256Hex(clientIp, serviceRoleKey);

  // Opportunistisches Aufräumen alter Log-Einträge (kein Cron nötig für v1).
  await supabaseAdmin
    .from("bewerbung_rate_limits")
    .delete()
    .lt("created_at", new Date(Date.now() - RATE_LIMIT_LOG_TTL_MS).toISOString());

  const { count, error: countError } = await supabaseAdmin
    .from("bewerbung_rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", new Date(Date.now() - RATE_LIMIT_FENSTER_MS).toISOString());

  if (countError) {
    console.error("Rate-Limit-Prüfung fehlgeschlagen", countError);
    return jsonResponse(500, { error: "Interner Fehler" });
  }

  if ((count ?? 0) >= RATE_LIMIT_MAX_PRO_STUNDE) {
    return jsonResponse(429, {
      error: "Zu viele Bewerbungen von dieser Verbindung. Bitte versuche es später erneut.",
    });
  }

  await supabaseAdmin.from("bewerbung_rate_limits").insert({ ip_hash: ipHash });

  const daten = parsed.data;
  const { data: bewerbung, error: insertError } = await supabaseAdmin
    .from("bewerbungen")
    .insert({
      vorname: daten.vorname,
      nachname: daten.nachname,
      strasse: daten.strasse,
      plz: daten.plz,
      ort: daten.ort,
      email: daten.email,
      telefon: daten.telefon,
      qualifikation: daten.qualifikation,
      fachweiterbildung: daten.fachweiterbildung,
      einsatzbereich: daten.einsatzbereich,
      arbeitszeitmodell: daten.arbeitszeitmodell,
      wochenstunden: daten.wochenstunden ?? null,
      arbeitsort_region: daten.arbeitsort_region,
      eintrittstermin: daten.eintrittstermin,
    })
    .select("id")
    .single();

  if (insertError || !bewerbung) {
    console.error("Bewerbung konnte nicht angelegt werden", insertError);
    return jsonResponse(500, { error: "Bewerbung konnte nicht gespeichert werden" });
  }

  const zeugnisPfad = `bewerbungen/${bewerbung.id}/zeugnis`;
  const { data: signed, error: signError } = await supabaseAdmin.storage
    .from("zeugnisse")
    .createSignedUploadUrl(zeugnisPfad);

  if (signError || !signed) {
    console.error("Signed Upload URL konnte nicht erzeugt werden", signError);
    // Bewerbung existiert bereits — Upload kann später über eine separate
    // Route nachgeholt werden (Phase 3). Kein Rollback, um Datenverlust zu
    // vermeiden; das Fehlen von zeugnis_pfad bleibt sichtbar für das Team.
    return jsonResponse(500, {
      error: "Bewerbung gespeichert, Upload-URL konnte aber nicht erzeugt werden",
      bewerbungId: bewerbung.id,
    });
  }

  await supabaseAdmin.from("bewerbungen").update({ zeugnis_pfad: zeugnisPfad }).eq("id", bewerbung.id);

  return jsonResponse(201, {
    bewerbungId: bewerbung.id,
    upload: {
      path: signed.path,
      token: signed.token,
      signedUrl: signed.signedUrl,
    },
  });
});
