# Ce qu'il reste à faire — app/rapid-pieces

Dernière mise à jour : 2026-09-14

## 1. Alertes push vendeur toutes les 10 min (Point 4 du cahier)

Aucune infrastructure de notification push n'existe (ni web, ni mobile).
Version choisie : **Web Push complète** (vibration même app/onglet fermé).

À faire :
- Migration `034_seller_push_notifications.sql` :
  - `sellers.notification_interval_minutes integer not null default 10`
  - `sellers.last_alert_sent_at timestamptz`
  - Table `push_subscriptions` (seller_id, endpoint, p256dh, auth) + RLS
- Générer les clés VAPID (`npx web-push generate-vapid-keys`) et les ajouter
  à `.env.local` **et** à la config d'hébergement (action manuelle requise,
  je peux générer les clés mais pas les déployer côté hébergeur).
- `public/sw.js` : service worker qui affiche la notification avec
  `vibrate: [200, 100, 200]`.
- `src/app/seller/settings/page.tsx` : bouton "Activer les alertes"
  (permission + abonnement) + sélecteur d'intervalle (5/10/15/30 min).
- Route `src/app/api/push/subscribe/route.ts` (service-role) : enregistre
  l'abonnement.
- Supabase Edge Function `send-seller-alerts` (Deno, `npm:web-push`) :
  pour chaque vendeur dont l'intervalle est écoulé et qui a une demande
  active à traiter, envoie le push et met à jour `last_alert_sent_at`.
- Planifier l'edge function via **Supabase Cron** (toutes les minutes).

Limite technique à connaître (pas contournable) : sur iPhone, ça ne
fonctionne que si le vendeur a "ajouté à l'écran d'accueil" (PWA, iOS
16.4+). Fonctionne nativement sur Android/Chrome/desktop.

Hors scope de ce point : notifications push côté app mobile (Expo) —
aucune infra `expo-notifications` n'existe, chantier séparé.

## 2. Interface livreur (Point 27 du cahier)

Fonctionnalité entièrement nouvelle, comparable en ampleur à l'espace
vendeur actuel. Rien n'existe : pas de rôle, pas de table, pas de page.
Nécessite un plan détaillé à part avant de commencer (nouveau rôle
`UserRole`, nouvelle table courriers/assignation commande↔livreur,
suivi GPS éventuel, nouvelles pages `src/app/courier/*`, gestion admin
des livreurs).

## 3. Traduction complète de l'app (i18n)

Environ 44 fichiers de l'app n'utilisent encore aucune traduction
(tout en français en dur, y compris en version anglaise du site) :
panier (`cart`), checkout, mes demandes (`requests/new`, `requests/[id]`),
historique véhicule, paramètres vendeur, factures, paiements, stats,
pages admin détail (buyers, sellers, requests), inspection, photo-search,
protection, rapid-business, group-buy, guarantee, sourcing, supplier,
whatsapp-contact, et plusieurs composants.

Déjà fait : offres, connexion, accueil (welcome), profil vendeur, admin
(dashboard + réglages), CGV/CGU, commandes acheteur/vendeur.

## 4. Devises par pays (Point 26) — reste marginal

Le gros du travail est fait (voir migration `035_order_currency.sql` à
exécuter dans Supabase SQL Editor si pas encore fait). Volontairement
laissés en FCFA fixe car ce sont des pages 100% démo/mock sans vendeur ni
pays réel à rattacher :
- `supplier/page.tsx`, `vehicle-history/page.tsx`,
  `whatsapp-contact/page.tsx`, `photo-search/page.tsx`.

Aussi laissés tels quels (agrégats multi-vendeurs, ambigus tant qu'il n'y
a pas de conversion de devise) :
- `admin/orders/page.tsx` (GMV total, escrow total)
- `admin/page.tsx` (GMV mensuel)

## 5. Migrations Supabase à exécuter si pas encore fait

Vérifier dans le SQL Editor Supabase que ces migrations ont bien été
appliquées (dans cet ordre) :
- `033_phone_lookup_normalized.sql` — connexion par téléphone tolérante
  aux espaces/indicatif manquant
- `035_order_currency.sql` — colonne `orders.currency`
- `034_seller_push_notifications.sql` — sera ajoutée quand le point 1
  sera implémenté
