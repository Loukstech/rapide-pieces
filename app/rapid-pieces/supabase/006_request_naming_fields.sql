-- Cahier des modifications, section 7 : construction automatique du nom d'une
-- demande à partir de 12 informations. Champs déjà existants : nom de la pièce
-- (part_name), marque/modèle/année (vehicle_brand/model/year), numéro de
-- châssis (vehicle_vin), qualité (quality). Ce fichier ajoute les champs
-- manquants : nombre de cylindres, carburant, condition de la pièce, note,
-- position de la pièce. Le "type de moteur" réutilise la colonne existante
-- vehicle_engine (jusqu'ici peu utilisée, en particulier sur mobile).

alter table public.part_requests
  add column if not exists vehicle_cylinders integer,
  add column if not exists fuel text check (fuel is null or fuel in ('Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL')),
  add column if not exists condition text check (condition is null or condition in ('Nouveau', 'Ancien')),
  add column if not exists note text,
  add column if not exists part_position text;
