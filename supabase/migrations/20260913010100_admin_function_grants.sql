-- Behebt Supabase-Security-Advisories: security-definer-Funktionen waren
-- über PostgREST direkt per RPC für anon/authenticated aufrufbar.
-- bewerbungen_log_status_change ist reine Trigger-Funktion, braucht keinen
-- direkten Aufruf. is_admin/log_admin_audit dürfen weiterhin von
-- authenticated (den Admins) aufgerufen werden, aber nicht anonym.
revoke execute on function public.bewerbungen_log_status_change() from public, anon, authenticated;
revoke execute on function public.is_admin() from public, anon;
revoke execute on function public.log_admin_audit(text, text, uuid, jsonb) from public, anon;
