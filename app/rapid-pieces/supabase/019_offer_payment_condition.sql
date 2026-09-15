-- Cahier V2 - Point 49/50 : le vendeur précise sur son offre si le paiement se
-- fait avant l'envoi ou à la livraison ; l'acheteur ne doit voir l'option
-- "paiement à la livraison" au checkout que si le vendeur l'a choisie.
--
-- Bug trouvé en vérifiant l'implémentation : le formulaire vendeur
-- (seller/requests/[id]/page.tsx) collecte déjà ce choix et checkout/page.tsx
-- le lit déjà (offer?.paymentCondition === 'on_delivery'), mais la colonne
-- n'existe pas en base et store.ts ne l'insérait/mappait jamais — le choix du
-- vendeur était donc silencieusement perdu à chaque création d'offre.

alter table public.offers
  add column if not exists payment_condition text
  check (payment_condition in ('before_shipment', 'on_delivery'));
