-- Admin-Layer (Phase 6), Teil 3: Storage-Policies für den zeugnisse-Bucket —
-- einzeln mit dem Nutzer durchgesprochen, bevor angewendet.

create policy zeugnisse_admin_select on storage.objects
  for select using (bucket_id = 'zeugnisse' and is_admin());

create policy zeugnisse_admin_insert on storage.objects
  for insert with check (bucket_id = 'zeugnisse' and is_admin());

create policy zeugnisse_admin_delete on storage.objects
  for delete using (bucket_id = 'zeugnisse' and is_admin());
