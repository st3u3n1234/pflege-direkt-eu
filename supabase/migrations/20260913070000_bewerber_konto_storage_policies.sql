-- Bewerber-Konto (Phase 7), Teil 3: Storage-Policies fuer den
-- zeugnisse-Bucket -- einzeln mit dem Nutzer durchgesprochen, bevor
-- angewendet. Gescoped ueber storage.foldername(name) auf
-- bewerbungen/{bewerbung_id}/... -- unzugeordnet/ bleibt fuer Bewerber
-- unerreichbar.

create policy zeugnisse_bewerber_select on storage.objects
  for select using (
    bucket_id = 'zeugnisse'
    and exists (
      select 1 from bewerbungen b
      where b.id::text = (storage.foldername(name))[2]
        and b.user_id = auth.uid()
    )
  );

create policy zeugnisse_bewerber_insert on storage.objects
  for insert with check (
    bucket_id = 'zeugnisse'
    and exists (
      select 1 from bewerbungen b
      where b.id::text = (storage.foldername(name))[2]
        and b.user_id = auth.uid()
    )
  );

create policy zeugnisse_bewerber_delete on storage.objects
  for delete using (
    bucket_id = 'zeugnisse'
    and exists (
      select 1 from bewerbungen b
      where b.id::text = (storage.foldername(name))[2]
        and b.user_id = auth.uid()
    )
  );
