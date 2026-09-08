-- Behebt Supabase-Security-Advisory "function_search_path_mutable" für den
-- updated_at-Trigger.
alter function public.set_updated_at() set search_path = '';
