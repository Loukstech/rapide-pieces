# Rapid Pièces

Marketplace béninoise (extensible Afrique de l'Ouest) de pièces automobiles.
Modèle **Request for Quote (RFQ)** : l'acheteur décrit la pièce recherchée
(véhicule + pièce, pas un produit précis à acheter), la demande est diffusée
aux vendeurs, chacun propose une offre (prix/qualité/délai), l'acheteur compare
via un **Rapid Score** puis commande — paiement retenu en **escrow** jusqu'à
confirmation de livraison, libéré par un admin.

**Lire en premier** : [`app/rapid_pieces_doc.txt`](app/rapid_pieces_doc.txt) —
document stratégique complet (39 pages, en français) qui définit le modèle
économique, le Rapid Score, l'anti-contournement (communication masquée
acheteur/vendeur), le sourcing international, etc. Ne pas construire une
fonctionnalité sans vérifier qu'elle correspond à ce document — plusieurs
allers-retours de ce projet viennent d'écarts entre le code et ce texte
(ex : la page d'accueil ressemblait à une boutique e-commerce avec catalogue
de produits, alors que le document interdit explicitement ça, section 48 —
« Rapid Pièces ne doit pas être une boutique de pièces détachées »).

## Structure — 3 projets indépendants dans un seul repo

```
/                           site vitrine (marketing, public, sans compte)
app/rapid-pieces/           l'app web réelle (marketplace) — app.rapidpieces.com
Mobile app/rapid-pieces-mobile/   l'app mobile (même backend) — iOS/Android
```

Ce sont trois codebases séparées (chacune avec son propre `package.json`,
`node_modules`, déploiement). Un changement dans l'une ne se répercute pas
automatiquement dans les autres — les corrections « métier » (textes, champs,
règles) doivent souvent être répliquées à la main dans l'app web ET l'app
mobile (ex : ajout du champ VIN, retrait du budget, etc.).

### 1. Site vitrine (racine)
Vite + React + TypeScript + Tailwind. Site marketing statique, aucun compte
utilisateur. Le bouton « S'enregistrer »/« Accéder à l'application » renvoie
vers `https://app.rapidpieces.com`.
- Dev : `npm run dev` · Build : `npm run build` · Déploiement : `vercel --prod --yes`
  depuis la racine du repo.
- Déployé sur **rapidpieces.com** (projet Vercel `rapidpieces-vitrine`).

### 2. App web réelle (`app/rapid-pieces/`)
Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind + Supabase
(`@supabase/supabase-js`, `@supabase/ssr`). C'est **le vrai produit** : compte
acheteur/vendeur/admin, demandes, offres, Rapid Score, commandes, escrow.
- Dev : `cd app/rapid-pieces && npm run dev`
- Build : `npm run build` · Déploiement : `vercel --prod --yes` depuis
  `app/rapid-pieces/`.
- Déployé sur **app.rapidpieces.com** (projet Vercel `rapid-pieces`).
- Logique métier centralisée dans `src/lib/store.ts` (accès Supabase, mappers
  snake_case↔camelCase, calcul du Rapid Score) et `src/lib/auth.tsx`
  (connexion par téléphone OU email, inscription téléphone obligatoire/email
  optionnel).

### 3. App mobile (`Mobile app/rapid-pieces-mobile/`)
Expo (React Native) + TypeScript, même backend Supabase que l'app web.
Réplique le même parcours (client/vendeur/admin) avec les mêmes écrans.
- Dev : `cd "Mobile app/rapid-pieces-mobile" && npx expo start` (scanner le QR
  avec l'app **Expo Go**, ou toucher `w` pour un aperçu navigateur).
- **Builder un APK Android** : `EXPO_TOKEN=<token> npx eas-cli build --platform
  android --profile preview --non-interactive` (nécessite un compte Expo,
  token créé sur expo.dev → Access Tokens).
- ⚠️ **Le système de mise à jour OTA (`eas update`) est cassé dans cet
  environnement** — la commande se bloque systématiquement en interne au
  bundling (cause non identifiée : possiblement lié à l'environnement Windows/
  sandbox, pas au code). Solution de contournement qui fonctionne (voir
  historique de commits pour le détail exact si besoin) : exporter chaque
  plateforme séparément (`expo export --platform android --output-dir
  dist-android` puis `--platform ios --output-dir dist-ios`), fusionner
  manuellement les deux dossiers + `metadata.json`, puis publier avec
  `eas update --skip-bundler --input-dir dist`. **Le plus simple et fiable
  reste de rebuilder un APK complet à chaque changement** (`eas build`) plutôt
  que de dépendre d'`eas update` — c'est le choix qui a été fait en pratique.

## Backend (partagé par les 3 projets... en fait par les 2 apps)

Supabase (projet `etmlxjdikcswpdvglwli`, compte **loukstech**). ⚠️ Le projet
Supabase a été **recréé de zéro** le 10/09/2026 (même raison que la migration
Vercel : consolider sous le compte loukstech plutôt que l'ancien compte
personnel) — l'ancien projet `dykiozkdqfzasxjqfdfi` n'est plus utilisé et peut
être supprimé. Toutes les données de test ont été reperdues volontairement
(uniquement des comptes de démo), pas de migration de données réelles.

Schéma dans [`app/rapid-pieces/supabase/`](app/rapid-pieces/supabase/) :
- **`000_full_schema_bootstrap.sql`** — schéma complet consolidé (état final
  de `schema.sql` + `002` à `005`), à utiliser pour **initialiser un projet
  Supabase tout neuf en une seule exécution** (c'est ce qui a servi à créer le
  projet actuel). Les fichiers numérotés ci-dessous restent comme historique
  des évolutions, mais ce n'est plus par eux qu'on repart de zéro.
- `schema.sql` — schéma de base (profiles, sellers, vehicles, part_requests,
  offers, orders, RLS, trigger de création de profil à l'inscription).
- `002_offer_seller_snapshot.sql` — dénormalisation nom/badge/score vendeur
  sur `offers` (pour l'anti-contournement : masquer l'identité avant sélection
  sans avoir à joindre `sellers`).
- `003_request_photos_storage.sql` — bucket Storage `request-photos` (photo
  jointe à une demande, upload réel depuis le formulaire).
- `004_phone_auth_and_sourcing_countries.sql` — colonne `profiles.email`
  (email réel ou technique) + fonction `email_for_phone()` (RPC permettant de
  se connecter par téléphone) + élargissement des `DeliveryType` acceptés
  (Chine, Dubaï, Turquie, France, Allemagne, Angleterre en plus de
  Nigeria/USA).
- `005_seller_profile_country_and_shop_details.sql` — `profiles.country` /
  `phone_secondary` / `address` (cahier §1 : classement par pays) et
  `sellers.condition_types` / `stock_level` / `payment_methods` /
  `delivery_available` / `opening_hours` / `note` (cahier §4 : profil boutique
  enrichi), corrige aussi le bug où marques/catégories choisies à
  l'inscription n'étaient jamais enregistrées.
- `006_request_naming_fields.sql` — `part_requests.vehicle_cylinders` /
  `fuel` / `condition` / `note` / `part_position` (cahier §7 : les 3 champs
  manquants pour construire le nom d'une demande à partir de 12 informations).
- `007_buyer_type_and_cart.sql` — `profiles.buyer_type` (cahier §8 : type de
  compte acheteur) et `part_requests.status` élargi avec `'draft'` (panier).
- `008_offer_negotiation.sql` — `offers.status`/`round`/`last_actor` (cahier
  §9), policies RLS pour que l'acheteur modifie ses offres reçues et que le
  vendeur relise une demande non-`open` où il a déjà une offre.
- `009_fix_rls_recursion.sql` — corrige une récursion infinie entre les deux
  policies ajoutées par 008 (chacune interrogeait l'autre table) via une
  fonction `security definer`.
- `010_request_lifecycle.sql` — `part_requests.status` élargi avec
  `'expired'` (cahier §10), policy vendeur limitée aux demandes `open` de
  moins de 24h.

Ces fichiers SQL sont numérotés dans l'ordre où ils doivent être exécutés
(SQL Editor Supabase → coller → Run). Ils ne sont **pas** appliqués
automatiquement — si un futur changement de schéma est fait, créer
`006_...sql`, documenter ici, et penser à répercuter le changement dans
`000_full_schema_bootstrap.sql` pour qu'un futur projet neuf reste à jour.

⚠️ **Piège rencontré en migrant de projet** : le validateur d'email du nouveau
projet Supabase rejette le TLD `.local` (réservé, RFC 6761) — l'email
technique généré pour l'inscription par téléphone sans email
(`technicalEmail()` dans `auth.tsx`, web + mobile) utilise donc désormais
`@phone.rapidpieces.com`, pas `@phone.rapidpieces.local`. Par ailleurs, sur un
projet Supabase neuf, **Authentication → Sign In / Providers → Email →
"Confirm email"** est activé par défaut — il faut le désactiver (sinon
`register()` échoue en `over_email_send_rate_limit` dès qu'on dépasse le
quota d'emails gratuit, et l'auto-login acheteur ne fonctionne pas tant que
l'email n'est pas confirmé).

Les clés `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (web) et
`EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` (mobile) sont déjà
dans les `.env` committés (clé anonyme publique par design, protégée par RLS —
pas un secret). Avant un vrai lancement commercial, les rotations classiques
(mot de passe DB, éventuels tokens de test partagés en conversation) restent à
faire.

## Comptes / accès techniques (hébergement, pas comptes de démo dans l'app)

- **GitHub** : ce repo est sur `github.com/Loukstech/rapid-pieces` (privé),
  compte GitHub **Loukstech**. Pour `git push`, le terminal doit être
  authentifié avec ce compte (`gh auth switch --user Loukstech` ou
  `gh auth login` si le compte n'est pas encore ajouté) — un push authentifié
  avec un autre compte GitHub échoue avec « Repository not found » (le repo
  est privé, GitHub masque son existence aux comptes non autorisés).
- **Vercel** : compte/équipe **loukstech** (équipe par défaut
  `cabinet-icg-plus-benins-projects`, propriétaire `loukstech@gmail.com`).
  ⚠️ Anciennement sur le compte `loukmansavplus-4992` — migration faite le
  9/09/2026 suite à une connexion Git accidentelle sur le mauvais compte
  (org GitHub `savplus` liée par erreur). Le domaine `rapidpieces.com` a été
  transféré entre comptes Vercel (`vercel domains move`), les deux projets
  recréés sous loukstech et reconnectés au bon repo GitHub
  (`Loukstech/rapid-pieces`).
  - `rapidpieces-vitrine` → domaine **rapidpieces.com** (racine du repo)
  - `rapid-pieces` → domaine **app.rapidpieces.com** (root directory
    `app/rapid-pieces/` — bien vérifier ce réglage si le projet est
    recréé un jour, sinon Vercel essaie de builder la vitrine à la place)
  - Les deux projets sont **connectés à GitHub** : tout `git push` sur `main`
    déclenche un déploiement automatique en prod sur les deux domaines. Plus
    besoin de déployer à la main sauf cas particulier.
  - Déploiement manuel si besoin : `npx vercel login` (compte loukstech), puis
    `npx vercel --prod --yes` dans le bon dossier (fichiers
    `.vercel/project.json` déjà liés au bon compte — ne pas les supprimer).
- **Expo/EAS** (app mobile) : compte **loukstech**, projet
  `rapid-pieces-mobile` (id déjà dans `app.json`). Pour builder un APK ou
  pousser une mise à jour, il faut un token : créer sur
  `expo.dev/accounts/loukstech/settings/access-tokens` → « Create token », puis
  `EXPO_TOKEN=<token> npx eas-cli build --platform android --profile preview
  --non-interactive` (voir section app mobile ci-dessus pour la limitation
  connue d'`eas update`).
- **Supabase** : projet `etmlxjdikcswpdvglwli`, compte **loukstech** (org
  « Loukstech's Org », géré aussi via l'intégration native Supabase dans le
  dashboard Vercel du projet `rapid-pieces` → onglet Storage → Connect). Accès
  au dashboard (SQL Editor, Auth, Storage) nécessaire pour exécuter les
  migrations numérotées et gérer les comptes/politiques RLS.

## Comptes de démo

| Rôle | Téléphone | Email | Mot de passe |
|---|---|---|---|
| Client (acheteur) | `+229 90 00 01 01` | `client.demo@rapidpieces.com` | `DemoClient2026!` |
| Vendeur | `+229 90 00 02 02` | `vendeur.demo@rapidpieces.com` | `DemoVendeur2026!` |
| Admin | — (pas de téléphone) | `admin@rapidpieces.com` | `RapidAdmin2026!` |

Détails de présentation/démo : [`CAHIER-DE-ROUTE-DEMO.md`](CAHIER-DE-ROUTE-DEMO.md).

## Concepts clés du code

- **Rapid Score** (`computeRapidScore` dans `store.ts`, web et mobile) : 30 %
  prix / 25 % qualité / 20 % disponibilité / 15 % réputation vendeur / 10 %
  délai de livraison. Recalculé côté client à partir des offres brutes, pas
  stocké en base.
- **Anti-contournement** : le nom du vendeur est masqué
  (`Vendeur ${badge} · #ID`) tant que l'acheteur n'a pas sélectionné son
  offre. Ne jamais exposer téléphone/adresse précise avant la sélection —
  seule la ville est visible à l'étape demande (cf. document, section 26-27).
- **Auth téléphone-first** : téléphone obligatoire à l'inscription, email
  optionnel. Sans email fourni, un email technique invisible est généré
  (`<téléphone>@phone.rapidpieces.com`) pour satisfaire Supabase Auth. La
  connexion accepte téléphone OU email (`login()` dans `auth.tsx` détecte le
  `@` pour choisir). Un **vendeur** qui s'inscrit n'est plus connecté
  automatiquement (`register('seller', ...)` fait un `signOut()` explicite
  juste après le `signUp()`) — redirection immédiate vers l'écran de
  connexion, conformément au cahier des modifications §4. Un **acheteur** qui
  s'inscrit garde la connexion automatique.
- **Accueil app web (`/`)** : ne montre plus de page marketing/catalogue —
  redirige directement selon l'état de connexion (`page.tsx`) : non connecté
  → **`/welcome`** (écran de démarrage à 2 cartes Acheteur/Vendeur, cahier §3
  — remplace l'ancien switch qui était en haut de `/login`), acheteur connecté
  → `/requests/new` (décrire sa pièce), vendeur/admin → leur dashboard.
  L'onglet « Accueil » a aussi été retiré de la bottom nav (`BottomNav.tsx`)
  car redondant avec « Demander ».
- **Pays** : `OPERATING_COUNTRIES` (types.ts) = pays où la marketplace opère
  localement (Bénin, Nigeria, Mali, Togo, Ghana, Burkina Faso, Côte d'Ivoire,
  Sénégal, Guinée, Niger — liste tirée de la brochure officielle, pas
  inventée). `DeliveryType`/`DELIVERY_OPTIONS` = origines de sourcing
  (RAPID_NOW/CITY local, puis NIGERIA/USA/CHINA/DUBAI/TURKEY/FRANCE/GERMANY/
  ENGLAND à l'international).

## Ce qui reste à faire / connu comme incomplet

Voir le tableau ✅/🟡 dans `CAHIER-DE-ROUTE-DEMO.md`. En résumé, mock/statique
pour l'instant : barre de recherche générale, chiffres des tableaux de bord
vendeur/admin (revenu du jour, stats — cahier §6, pas encore fait), catalogue
vendeur (CRUD), actions « Vérifier »/« Bannir » sur la page admin des
vendeurs (la liste elle-même est réelle depuis le Lot 1, mais les boutons
d'action ne sont pas câblés), messagerie vocale pour les demandes (demandée
par le client, pas encore construite), champ « budget indicatif » obligatoire
ou non (question en attente de réponse du client), adresse de livraison
précise (doit être collectée à l'étape commande/checkout, pas à l'étape
demande — pour respecter l'anti-contournement).

## Cahier des modifications (mise à jour client — voir `Cahier_des_modifications_application_pieces.pdf`)

Grosse mise à jour demandée par le client, traitée **lot par lot** (validé en
local avant chaque push). Suivi :

- ✅ **Lot 1** (sections 1, 3, 4, 5 du cahier) — gestion pays/indicatif
  téléphonique (`profiles.country`, `OPERATING_COUNTRIES[].callingCode`,
  composant `PhoneInput`), écran de démarrage `/welcome` à 2 cartes, formulaire
  d'inscription vendeur enrichi (adresse, tél. secondaire, marques mises à
  jour avec Range Rover, Condition, Niveau de stock, Conditions de paiement,
  Service de livraison, Horaires, Note), pas d'auto-login vendeur après
  inscription, message de connexion vendeur mis à jour, page admin vendeurs
  branchée sur les vraies données avec filtre pays.
- ✅ **Lot 2** (section 6) — tableau de bord vendeur : « Chiffre d'affaires du
  mois de {mois} » calculé à partir des vraies commandes du vendeur pour le
  mois en cours (`useOrders()`, filtré par mois/année — se réinitialise tout
  seul chaque mois puisque jamais stocké), section « Nouvelles demandes »/
  « Ventes récentes » déplacée au-dessus des 4 cartes statistiques rapides
  (qui restent mock, non demandées par ce lot).
- ✅ **Lot 3** (section 7) — nom de demande construit automatiquement :
  `requestTitleLine()`/`requestSubtitleLine()` (`lib/types.ts`, web + mobile)
  combinent les 12 champs dans l'ordre du cahier, séparés par « | ». Titre =
  pièce/marque/modèle/année (gras, grand) ; sous-titre = cylindres/type
  moteur/carburant/condition/châssis/note/position/qualité (petit, gris).
  Nouveaux champs `vehicle.cylinders`, `fuel`, `condition`, `note`,
  `partPosition` ajoutés au formulaire de demande (web 3 étapes + mobile) et à
  tous les endroits d'affichage d'une demande (listes acheteur/vendeur/admin,
  détail vendeur, écran offres, récapitulatif de publication). Les affichages
  de commandes/offres (post-transaction, données figées différentes) restent
  inchangés — hors du périmètre littéral du cahier (« sous les demandes »).
- ✅ **Lot 4** (section 8, partiel) — espace acheteur : lien « Vendeur » retiré
  du profil, localisation affichée sous le nom (secondaire), nouveau type de
  compte acheteur (`profiles.buyer_type` : particulier/mécanicien/garage/
  entreprise, sélectionné à l'inscription) — l'onglet et le formulaire
  « Mes véhicules » sont masqués pour tout compte non-particulier. Panier
  complet : `part_requests.status = 'draft'` (invisible des vendeurs/admin),
  bouton « Enregistrer dans le panier » sur le formulaire de demande (web +
  mobile), page/écran `Panier` (lister/envoyer/supprimer), badge de nombre de
  brouillons sur l'onglet Panier (bottom nav web + tab mobile).
  **Reporté au Lot 5** : l'indicateur « paiement en attente » et la pénalité
  de points sur offre acceptée non payée dépendent du même mécanisme d'état
  (offre acceptée) que la section 9 (offres/contre-offres) — les construire
  séparément maintenant aurait été soit superficiel soit redondant avec le
  travail du Lot 5.
- ✅ **Lot 5** (section 9) — offres et contre-offres : `offers.status`
  (`pending`/`countered`/`accepted`/`rejected`), `round` (max 3, valeur
  retenue — le cahier signalait l'ambiguïté « 2 » vs « 3 »), `last_actor`
  (à qui revient le tour). Accepter / Contre-offrir / Refuser des deux côtés
  (acheteur sur `/offers/[id]`, vendeur sur `/seller/requests/[id]`, mêmes
  actions en mobile). À l'acceptation, les autres offres de la demande sont
  gelées (`rejected`) et la demande passe à `matched` (fermée aux nouveaux
  vendeurs). Un vendeur dont l'offre est gelée voit désormais « cette demande
  a déjà été satisfaite » (nouvelle policy RLS lui permettant de relire sa
  demande même non-`open`). Limite de 3 vendeurs actifs par demande appliquée
  au moment de contre-offrir. Complète aussi le Lot 4 : indicateur « paiement
  en attente » (badge sur l'onglet Panier) et pénalité de points si l'acheteur
  annule une offre acceptée sans payer.
  **Corrigé au passage** : le formulaire d'inscription (Lot 1) demandait le
  téléphone avant le pays, ce qui figeait l'indicatif de `PhoneInput` sur la
  valeur par défaut si l'utilisateur suivait l'ordre des champs — Pays/Ville
  passent maintenant avant le téléphone.
- ✅ **Lot 6** (section 10) — cycle de vie des demandes : une demande `open`
  sans offre acceptée depuis 24h expire (`status='expired'`, appliqué par un
  balayage best-effort `expireStaleRequests()` déclenché à chaque navigation
  acheteur, et défendu en profondeur par la policy RLS vendeur qui ignore de
  toute façon les demandes `open` de plus de 24h). Historique conservé 3 mois
  max : `getRequests()` ne remonte plus les demandes plus vieilles que 90
  jours — choix délibéré de ne **pas** supprimer physiquement les données
  (une suppression définitive de données transactionnelles est un choix
  trop lourd/irréversible pour être fait sans confirmation explicite du
  client). Ceci clôt les 10 sections du cahier des modifications.
