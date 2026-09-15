-- Cahier des modifications, section 9 : offres et contre-offres.
-- Chaque offre porte désormais un état de négociation (accepter / contre-offrir /
-- refuser), un compteur de propositions (limite retenue : 3 max dans la chaîne),
-- et l'acteur du dernier prix proposé (pour savoir à qui revient le tour).

alter table public.offers
  add column if not exists status text not null default 'pending' check (status in ('pending', 'countered', 'accepted', 'rejected')),
  add column if not exists round integer not null default 1,
  add column if not exists last_actor text not null default 'seller' check (last_actor in ('buyer', 'seller'));

-- L'acheteur doit pouvoir modifier le statut/prix des offres reçues sur ses propres
-- demandes (accepter / contre-offrir / refuser) — jusqu'ici lecture seule.
create policy "offers: buyer of related request can update" on public.offers
  for update using (
    exists (select 1 from public.part_requests r where r.id = request_id and r.buyer_id = auth.uid())
  );

-- Un vendeur doit pouvoir relire sa propre demande même une fois qu'elle n'est
-- plus 'open' (matched/completed), pour afficher "demande déjà satisfaite"
-- plutôt qu'un simple "introuvable" — jusqu'ici les vendeurs ne voyaient que
-- les demandes encore ouvertes.
create policy "requests: seller with existing offer can read" on public.part_requests
  for select using (
    exists (select 1 from public.offers o where o.request_id = id and o.seller_id = auth.uid())
  );
