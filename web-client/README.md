# Web Client - Le Local en Mouvement

Application web client pour les clients du restaurant.

## Installation

```bash
npm install
# ou
pnpm install
```

## Configuration

Créer un fichier `.env.local` :

```
VITE_API_URL=http://localhost:3001/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## Démarrage

### Mode développement
```bash
npm run dev
```

Le site démarre sur `http://localhost:5173`

### Mode production
```bash
npm run build
npm run preview
```

## Structure du projet

```
src/
├── pages/           # Pages (Menu, Panier, Commandes, etc.)
├── components/      # Composants réutilisables
├── stores/          # Stores Zustand (Auth, Panier)
├── services/        # Services API
├── styles/          # Styles globaux
└── App.tsx          # Composant principal
```

## Pages principales

- **HomePage** : Accueil avec présentation
- **MenuPage** : Consultation du menu
- **CartPage** : Panier et résumé
- **CheckoutPage** : Paiement
- **OrdersPage** : Historique des commandes
- **OrderDetailPage** : Détails et suivi d'une commande
- **LoyaltyPage** : Points de fidélité
- **LoginPage** : Connexion
- **RegisterPage** : Inscription
- **ProfilePage** : Profil utilisateur

## Stores Zustand

### authStore
- `user` : Utilisateur connecté
- `token` : Token JWT
- `isAuthenticated` : État de connexion
- `register()` : Inscription
- `login()` : Connexion
- `logout()` : Déconnexion
- `updateProfile()` : Mise à jour du profil

### cartStore
- `items` : Articles du panier
- `totalPrice` : Prix total
- `totalItems` : Nombre d'articles
- `addItem()` : Ajouter un article
- `removeItem()` : Supprimer un article
- `updateQuantity()` : Modifier la quantité
- `clearCart()` : Vider le panier

## Intégrations

### Stripe
Paiement par carte bancaire via Stripe Payment Intent.

### Socket.io
Suivi en temps réel des commandes.

## Styles

Utilise Tailwind CSS 4 avec une palette de couleurs personnalisée :
- Couleur primaire : Vert émeraude
- Couleur secondaire : Gris
- Couleur d'accent : Bleu

## Déploiement

### Vercel
```bash
npm run build
vercel deploy
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## Fonctionnalités

- ✅ Consultation du menu
- ✅ Panier persistant
- ✅ Authentification JWT
- ✅ Paiement Stripe
- ✅ Historique des commandes
- ✅ Suivi en temps réel
- ✅ Points de fidélité
- ✅ Profil utilisateur
- ✅ Responsive design

## Troubleshooting

### Erreur CORS
Vérifier que le backend autorise les requêtes du frontend.

### Erreur Stripe
Vérifier que la clé publique Stripe est correcte.

### Erreur d'authentification
Vérifier que le token JWT est valide et non expiré.

## Support

Pour les problèmes, consulter la documentation :
- [React](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/)
- [Stripe](https://stripe.com/docs)
