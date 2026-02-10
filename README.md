# Le Local en Mouvement - Application Complète

Application complète pour un restaurant rapide premium avec web, mobile et tableau de bord admin.

## 📁 Structure du Projet

```
local_en_mouvement_app/
├── backend/              # API REST (Node.js + Express + PostgreSQL)
├── web-client/           # Application web client (React)
├── admin-dashboard/      # Tableau de bord restaurant (React)
├── mobile/               # Application mobile (React Native)
└── docs/                 # Documentation
```

## 🚀 Démarrage Rapide

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos paramètres
npm run dev
```

Le serveur démarre sur `http://localhost:3001`

### 2. Web Client

```bash
cd web-client
npm install
npm run dev
```

Le site démarre sur `http://localhost:5173`

### 3. Admin Dashboard

```bash
cd admin-dashboard
npm install
npm run dev
```

Le tableau de bord démarre sur `http://localhost:5174`

### 4. Mobile (Expo)

```bash
cd mobile
npm install
npm start
```

## 📋 Fonctionnalités

### Client Web
- ✅ Consultation du menu
- ✅ Panier et commande
- ✅ Paiement Stripe
- ✅ Suivi en temps réel
- ✅ Historique des commandes
- ✅ Points de fidélité
- ✅ Profil utilisateur
- ✅ Responsive design

### Admin Dashboard
- ✅ Gestion des commandes
- ✅ Changement de statut
- ✅ Gestion du menu
- ✅ Rapports de ventes
- ✅ Produits les plus vendus
- ✅ Paramètres du restaurant
- ✅ Graphiques et statistiques

### Mobile
- ✅ Toutes les fonctionnalités du web
- ✅ Interface native
- ✅ Notifications push
- ✅ Accès offline (cache)

## 🔧 Stack Technologique

### Backend
- **Framework** : Express.js
- **Base de données** : PostgreSQL
- **ORM** : Sequelize
- **Authentification** : JWT
- **Paiement** : Stripe API
- **Temps réel** : Socket.io

### Frontend Web & Admin
- **Framework** : React 19
- **Styling** : Tailwind CSS 4
- **State** : Zustand
- **Routing** : React Router v6
- **HTTP** : Axios

### Mobile
- **Framework** : React Native (Expo)
- **Navigation** : React Navigation
- **UI** : React Native Paper

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Backend README](./backend/README.md)
- [Web Client README](./web-client/README.md)
- [Admin Dashboard README](./admin-dashboard/README.md)
- [Mobile README](./mobile/README.md)

## 🔐 Variables d'Environnement

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/local_en_mouvement
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
ADMIN_TOKEN=your_admin_token
FRONTEND_URL=http://localhost:3000
PORT=3001
NODE_ENV=development
```

### Web Client (.env.local)
```
VITE_API_URL=http://localhost:3001/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### Admin Dashboard (.env.local)
```
VITE_API_URL=http://localhost:3001/api
VITE_ADMIN_TOKEN=your_admin_token
```

### Mobile (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:3001/api
EXPO_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil
- `PUT /api/auth/profile` - Mettre à jour le profil

### Products
- `GET /api/products` - Lister les produits
- `GET /api/products/:id` - Détails
- `GET /api/products/categories/list` - Catégories
- `POST /api/products` - Créer (admin)
- `PUT /api/products/:id` - Mettre à jour (admin)
- `DELETE /api/products/:id` - Supprimer (admin)

### Orders
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Mes commandes
- `GET /api/orders/:id` - Détails
- `POST /api/orders/:id/cancel` - Annuler

### Loyalty
- `GET /api/loyalty/points` - Mes points
- `GET /api/loyalty/history` - Historique
- `POST /api/loyalty/redeem` - Utiliser les points

### Admin
- `GET /api/admin/orders` - Toutes les commandes
- `PUT /api/admin/orders/:id/status` - Changer le statut
- `GET /api/admin/reports/sales` - Rapports
- `GET /api/admin/reports/top-products` - Top produits
- `GET /api/admin/settings` - Paramètres
- `PUT /api/admin/settings` - Mettre à jour

## 🚢 Déploiement

### Backend
```bash
# Heroku
heroku create local-en-mouvement-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main

# Railway / Render
# Voir la documentation respective
```

### Frontend Web
```bash
# Vercel
npm run build
vercel deploy

# Netlify
npm run build
netlify deploy --prod --dir=dist
```

### Admin Dashboard
```bash
# Même procédure que le web client
```

### Mobile
```bash
# Expo Go (développement)
expo start

# Production
eas build --platform ios
eas build --platform android
```

## 📊 Modèles de Données

### User
- id, email, password, firstName, lastName, phone
- loyaltyPoints, totalOrders, createdAt

### Product
- id, name, description, price, category
- image, ingredients, allergens, available

### Order
- id, userId, totalPrice, status, deliveryType
- deliveryAddress, estimatedTime, createdAt

### OrderItem
- id, orderId, productId, quantity, price

### LoyaltyTransaction
- id, userId, points, type, orderId, createdAt

### RestaurantSettings
- id, openingHours, closedDays, deliveryFee, minOrderAmount

## 🔄 Flux de Données

```
Client Web/Mobile
    ↓
    ├─ Consulte le menu → GET /products
    ├─ Ajoute au panier (local)
    ├─ Crée une commande → POST /orders
    ├─ Effectue le paiement (Stripe)
    ├─ Reçoit la confirmation
    ├─ Suit la commande (Socket.io)
    └─ Gagne des points de fidélité

Admin Dashboard
    ↓
    ├─ Reçoit les nouvelles commandes (Socket.io)
    ├─ Confirme/Refuse
    ├─ Met à jour le statut
    ├─ Notifie le client (Socket.io)
    └─ Génère des rapports
```

## 🛠️ Développement

### Ajouter une nouvelle fonctionnalité

1. **Backend** : Créer la route et le modèle
2. **Web Client** : Créer la page et le store
3. **Admin** : Ajouter la gestion si nécessaire
4. **Mobile** : Adapter pour React Native

### Conventions de code

- Utiliser TypeScript partout
- Nommer les fichiers en camelCase
- Utiliser des composants fonctionnels
- Documenter les fonctions complexes

## 📝 Licences

MIT

## 👥 Support

Pour les questions ou problèmes :
- Consulter la documentation respective
- Vérifier les logs du serveur
- Vérifier les variables d'environnement

## 🎯 Roadmap

- [ ] Authentification OAuth (Google, Apple)
- [ ] Notifications push
- [ ] Système de notation
- [ ] Chat en temps réel
- [ ] Intégration SMS
- [ ] Programme d'affiliation
- [ ] Analytics avancées
- [ ] Intégration avec systèmes de caisse

## 📞 Contact

Le Local en Mouvement
Email: contact@local-en-mouvement.fr
Tél: +33 5 XX XX XX XX
