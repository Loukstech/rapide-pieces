-- CRITIQUE : le formulaire d'offre vendeur envoie désormais `condition`
-- ('used'/'new', nouvelle section "État de la pièce" distincte de la
-- qualité), mais aucune migration n'a jamais créé la colonne — chaque
-- création d'offre échoue actuellement en base (même symptôme que le bug
-- déjà rencontré avec `specific_brand` et `negotiable`).

alter table public.offers
  add column if not exists condition text check (condition is null or condition in ('used', 'new'));

-- Même champ côté demande (déclaré dans le type PartRequest mais pas encore
-- utilisé par le formulaire acheteur) — ajouté par cohérence pour éviter la
-- même erreur le jour où ce sera branché.
alter table public.part_requests
  add column if not exists part_condition text check (part_condition is null or part_condition in ('used', 'new'));
