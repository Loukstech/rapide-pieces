# Rapid Pièces — Application mobile (iOS + Android)

Application React Native (Expo), connectée au **même Supabase** que l'app web
(`app.rapidpieces.com`) — mêmes comptes, mêmes données, en temps réel.

## Lancer en local

```bash
cd "Mobile app/rapid-pieces-mobile"
npm install
npx expo start
```

- Sur ton téléphone : installe l'app **Expo Go** (App Store / Play Store), puis scanne
  le QR code affiché dans le terminal. L'app se charge directement sur ton téléphone.
- Dans le terminal, tu peux aussi taper `a` (émulateur Android) ou `i` (simulateur iOS,
  Mac uniquement) ou `w` (navigateur, pour un test rapide sans téléphone).

## Comptes de démo

Mêmes comptes que sur `app.rapidpieces.com` (voir `CAHIER-DE-ROUTE-DEMO.md` à la
racine du projet).

## Structure

- `src/lib/` — logique métier (types, appels Supabase, calcul du Rapid Score,
  authentification) : identique à l'app web, copiée puis adaptée.
- `src/screens/` — un écran par page (buyer/, seller/, admin/).
- `src/navigation/` — un navigateur par rôle (Client, Vendeur, Admin), bascule
  automatique selon le compte connecté.

## Publier l'app (plus tard, quand prêt)

La mise en ligne réelle sur l'App Store / Play Store se fait via
[EAS Build](https://docs.expo.dev/build/introduction/) (`npx eas build`) — nécessite
un compte Expo (gratuit) et un compte développeur Apple (99 $/an) + Google Play
(25 $ une fois). On abordera ça une fois l'app testée et validée.
