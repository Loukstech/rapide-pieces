# Accès Rapid Pièces

## Applications

- **Vitrine** : https://rapidpieces.com
- **Application web** : https://app.rapidpieces.com
- **Développement local** : http://localhost:3000

## Comptes de démo

| Rôle | Téléphone | Email | Mot de passe |
|---|---|---|---|
| **Acheteur** | `+229 90 00 01 01` | `client.demo@rapidpieces.com` | `DemoClient2026!` |
| **Vendeur** | `+229 90 00 02 02` | `vendeur.demo@rapidpieces.com` | `DemoVendeur2026!` |
| **Admin** | — | `admin@rapidpieces.com` | `RapidAdmin2026!` |

## Infrastructure

### GitHub
- **Repository** : https://github.com/Loukstech/rapid-pieces (privé)
- **Compte** : Loukstech

### Vercel
- **Compte** : loukstech (équipe `cabinet-icg-plus-benins-projects`)
- **Vitrine** : projet `rapidpieces-vitrine` → rapidpieces.com
- **App web** : projet `rapid-pieces` → app.rapidpieces.com

### Supabase
- **Projet** : `etmlxjdikcswpdvglwli`
- **Compte** : loukstech (org "Loukstech's Org")
- **Dashboard** : accessible via intégration Vercel

### Expo (App mobile)
- **Compte** : loukstech
- **Projet** : `rapid-pieces-mobile`
- **Build Android** : `EXPO_TOKEN=<token> npx eas-cli build --platform android --profile preview --non-interactive`

## Développement

### Site vitrine (racine)
```bash
npm run dev      # Port 3000
npm run build    # Build
```

### App web (`app/rapid-pieces/`)
```bash
npm run dev      # Port 3000
npm run build    # Build
```

### App mobile (`Mobile app/rapid-pieces-mobile/`)
```bash
npx expo start   # Scanner QR code avec Expo Go
```

## Documentation

- **Document stratégique** : `app/rapid_pieces_doc.txt` (39 pages)
- **Cahier des modifications** : `Cahier_des_modifications_application_pieces.pdf`
- **Cahier de route démo** : `CAHIER-DE-ROUTE-DEMO.md`
- **README principal** : `README.md`
