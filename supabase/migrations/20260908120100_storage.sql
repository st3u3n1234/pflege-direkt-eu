-- Privater Storage-Bucket für Zeugnis-Uploads.
-- Zugriff ausschließlich über von der Edge Function erzeugte signierte
-- Upload-/Download-URLs (service_role) — bewusst keine RLS-Policy für
-- anon/authenticated auf storage.objects in diesem Bucket.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'zeugnisse',
  'zeugnisse',
  false,
  10485760, -- 10 MB
  array['application/pdf', 'image/jpeg', 'image/png']
);
