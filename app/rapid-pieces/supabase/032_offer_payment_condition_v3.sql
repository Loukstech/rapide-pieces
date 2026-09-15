-- La condition de paiement de l'offre passe de 2 à 3 choix : "Rapid Pièces",
-- "En boutique", "À la livraison" — remplace l'ancienne valeur
-- 'before_shipment' par 'rapid_pieces'/'in_store'. Sans cette migration,
-- toute création d'offre échoue en base (même piège que specific_brand,
-- negotiable et condition avant elle) : la contrainte CHECK d'origine
-- (migration 019) n'autorisait que ('before_shipment', 'on_delivery').

-- Ordre correct : retirer l'ANCIENNE contrainte avant le backfill (sinon
-- 'rapid_pieces' la viole encore), backfiller, puis appliquer la NOUVELLE
-- contrainte une fois toutes les lignes déjà conformes.
alter table public.offers drop constraint if exists offers_payment_condition_check;

update public.offers set payment_condition = 'rapid_pieces' where payment_condition = 'before_shipment';

alter table public.offers add constraint offers_payment_condition_check
  check (payment_condition is null or payment_condition in ('rapid_pieces', 'in_store', 'on_delivery'));
