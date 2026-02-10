Architecture - Le Local en Mouvement
Vue d'ensemble
Application complète pour un restaurant rapide premium avec :
Backend : Node.js + Express + PostgreSQL
Web Client : React + Tailwind CSS
Mobile : React Native (Expo)
Admin Dashboard : React + Tailwind CSS
Structure du Projet

local_en_mouvement_app/
├── backend/                 # API REST
│   ├── src/
│   │   ├── models/         # Modèles de données
│   │   ├── routes/         # Routes API
│   │   ├── controllers/    # Logique métier
│   │   ├── middleware/     # Authentification, validation
│   │   ├── services/       # Services (Stripe, email, etc.)
│   │   └── config/         # Configuration
│   ├── migrations/         # Migrations DB
│   └── package.json
│
├── web-client/             # Application web client
│   ├── src/
│   │   ├── pages/         # Pages (Menu, Panier, Commandes)
│   │   ├── components/    # Composants réutilisables
│   │   ├── contexts/      # Contexte (Auth, Panier)
│   │   ├── services/      # Appels API
│   │   └── styles/        # Styles globaux
│   └── package.json
│
├── admin-dashboard/        # Tableau de bord restaurant
│   ├── src/
│   │   ├── pages/         # Pages (Commandes, Menu, Rapports)
│   │   ├── components/    # Composants
│   │   └── services/      # Appels API
│   └── package.json
│
├── mobile/                 # Application React Native
│   ├── app/
│   │   ├── screens/       # Écrans (Menu, Panier, Commandes)
│   │   ├── components/    # Composants
│   │   ├── services/      # Appels API
│   │   └── context/       # Contexte
│   └── package.json
│
└── docs/                   # Documentation

Stack Technologique
Backend
Framework : Express.js
Base de données : PostgreSQL
ORM : Sequelize
Authentification : JWT + OAuth
Paiement : Stripe API
Temps réel : Socket.io
Email : Nodemailer
Frontend Web
Framework : React 19
Styling : Tailwind CSS 4
UI Components : shadcn/ui
State Management : Context API + useReducer
Routing : React Router v6
HTTP Client : Axios
Mobile
Framework : React Native (Expo)
Navigation : React Navigation
UI : React Native Paper
State : Context API
HTTP : Axios
Admin Dashboard
Framework : React 19
Styling : Tailwind CSS 4
Charts : Recharts
Tables : React Table
Modèles de Données
Users
id, email, password, firstName, lastName, phone
loyaltyPoints, totalOrders, createdAt
Products
id, name, description, price, category
image, ingredients, allergens, available, createdAt
Orders
id, userId, totalPrice, status, deliveryType
deliveryAddress, estimatedTime, createdAt
OrderItems
id, orderId, productId, quantity, price
LoyaltyTransactions
id, userId, points, type, orderId, createdAt
RestaurantSettings
id, openingHours, closedDays, deliveryFee, minOrderAmount
Flux de Données
Commande Client
Client consulte le menu
Ajoute des produits au panier
Procède au paiement (Stripe)
Reçoit confirmation + numéro de commande
Suit la commande en temps réel
Gagne des points de fidélité
Gestion Restaurant
Reçoit notification de nouvelle commande
Confirme/Refuse la commande
Marque comme en préparation
Marque comme prête
Marque comme livrée/retirée
Génère rapports de ventes
Authentification
JWT pour les sessions client
OAuth (Google, Apple) pour connexion rapide
Admin : Email + Mot de passe sécurisé
Sécurité
HTTPS obligatoire
Validation des données côté serveur
Rate limiting sur les API
CORS configuré
Hachage des mots de passe (bcrypt)
Tokens JWT avec expiration
Déploiement
Backend : Heroku / Railway / Render
Frontend : Vercel / Netlify
Mobile : Expo Go / App Store / Google Play
DB : PostgreSQL Cloud (AWS RDS / Heroku Postgres)

Variables d'Environnement
# Backend
DATABASE_URL=postgresql://...
JWT_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_PUBLIC_KEY=...
SMTP_USER=...
SMTP_PASSWORD=...

# Frontend
REACT_APP_API_URL=http://localhost:3001
REACT_APP_STRIPE_PUBLIC_KEY=...

# Mobile
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_STRIPE_PUBLIC_KEY=...

API Endpoints

Auth
POST /api/auth/register - Inscription
POST /api/auth/login - Connexion
POST /api/auth/logout - Déconnexion
POST /api/auth/refresh - Renouveler token

Products
GET /api/products - Lister les produits
GET /api/products/:id - Détails produit
GET /api/categories - Lister les catégories

Orders
POST /api/orders - Créer une commande
GET /api/orders - Mes commandes
GET /api/orders/:id - Détails commande
GET /api/orders/:id/status - Suivi en temps réel

Loyalty
GET /api/loyalty/points - Mes points
GET /api/loyalty/history - Historique

Admin
GET /api/admin/orders - Toutes les commandes
PUT /api/admin/orders/:id/status - Changer le statut
GET /api/admin/products - Gestion produits
POST /api/admin/products - Ajouter produit
GET /api/admin/reports - Rapports de ventes

Notifications en Temps Réel
Socket.io pour les mises à jour de commandes
Notifications push (mobile )
Email pour confirmations
Points de Fidélité
1 point par euro dépensé
100 points = 10€ de réduction
Bonus anniversaire
Offres exclusives