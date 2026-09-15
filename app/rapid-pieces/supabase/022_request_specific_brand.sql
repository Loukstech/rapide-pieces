-- Bug trouvé : "je fais une demande, le bouton charge puis revient à la
-- normale et rien ne se passe". Cause : addRequest() (store.ts, Cahier V2 §6)
-- insère specific_brand, mais aucune migration n'a jamais créé cette colonne
-- sur part_requests — chaque création de demande échouait silencieusement
-- (l'erreur Postgres n'était pas remontée à l'écran), donc absolument aucune
-- nouvelle demande ne pouvait plus être créée depuis l'ajout de ce champ.

alter table public.part_requests
  add column if not exists specific_brand text;
