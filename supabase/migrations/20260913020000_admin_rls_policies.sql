-- Admin-Layer (Phase 6), Teil 2: RLS-Policies — einzeln mit dem Nutzer
-- durchgesprochen, bevor angewendet.

create policy admin_users_select_admin on admin_users
  for select using (is_admin());

create policy bewerbungen_select_admin on bewerbungen
  for select using (is_admin());

create policy bewerbungen_update_admin on bewerbungen
  for update using (is_admin()) with check (is_admin());

create policy kliniken_select_admin on kliniken
  for select using (is_admin());

create policy stellen_select_admin on stellen
  for select using (is_admin());

create policy dokumente_select_admin on dokumente
  for select using (is_admin());

create policy dokumente_insert_admin on dokumente
  for insert with check (is_admin());

create policy dokumente_update_admin on dokumente
  for update using (is_admin()) with check (is_admin());

create policy dokumente_delete_admin on dokumente
  for delete using (is_admin());

create policy notizen_select_admin on notizen
  for select using (is_admin());

create policy notizen_insert_admin on notizen
  for insert with check (is_admin());

create policy status_verlauf_select_admin on status_verlauf
  for select using (is_admin());

create policy audit_log_select_admin on audit_log
  for select using (is_admin());
