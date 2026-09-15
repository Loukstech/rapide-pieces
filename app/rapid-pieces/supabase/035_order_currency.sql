-- Cahier V2 - Point 26 : devise par pays (FCFA, Naira, Cedi...) au lieu de
-- toujours afficher "FCFA". La commande copie la devise de l'offre acceptée
-- au moment de sa création (comme offers.currency, migration antérieure) ;
-- les commandes déjà existantes sont backfillées à 'XOF' (comportement
-- inchangé, c'était déjà toujours FCFA jusqu'ici).
alter table public.orders add column if not exists currency text not null default 'XOF';
