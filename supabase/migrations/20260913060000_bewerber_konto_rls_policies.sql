-- Bewerber-Konto (Phase 7), Teil 2: RLS-Policies -- einzeln mit dem Nutzer
-- durchgesprochen, bevor angewendet. Additiv zu den bestehenden
-- Admin-Policies (Postgres verknüpft mehrere permissive Policies pro
-- Command mit OR).

create policy bewerbungen_select_bewerber on bewerbungen
  for select using (auth.uid() = user_id);

create policy bewerbungen_update_bewerber on bewerbungen
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy dokumente_select_bewerber on dokumente
  for select using (
    exists (select 1 from bewerbungen b where b.id = dokumente.bewerbung_id and b.user_id = auth.uid())
  );

create policy dokumente_insert_bewerber on dokumente
  for insert with check (
    exists (select 1 from bewerbungen b where b.id = dokumente.bewerbung_id and b.user_id = auth.uid())
  );

create policy dokumente_delete_bewerber on dokumente
  for delete using (
    exists (select 1 from bewerbungen b where b.id = dokumente.bewerbung_id and b.user_id = auth.uid())
  );
