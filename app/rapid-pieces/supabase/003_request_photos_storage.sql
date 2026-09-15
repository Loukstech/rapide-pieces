-- Bucket public pour les photos jointes aux demandes de pièces (Rapid Pièces).
insert into storage.buckets (id, name, public)
values ('request-photos', 'request-photos', true)
on conflict (id) do nothing;

create policy "request-photos: lecture publique"
on storage.objects for select
using (bucket_id = 'request-photos');

create policy "request-photos: upload par utilisateur connecté"
on storage.objects for insert
to authenticated
with check (bucket_id = 'request-photos');
