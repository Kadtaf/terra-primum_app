# Backend - Le Local en Mouvement

API REST pour l'application de restaurant rapide premium.

## Installation

```bash
npm install
# ou
pnpm install
```

## Configuration

Créer un fichier `.env` basé sur `.env.example` :

```bash
cp .env.example .env
```

Remplir les variables d'environnement :
- `DATABASE_URL` : URL de connexion PostgreSQL
- `JWT_SECRET` : Clé secrète pour les tokens JWT
- `STRIPE_SECRET_KEY` : Clé secrète Stripe
- `STRIPE_PUBLIC_KEY` : Clé publique Stripe
- `ADMIN_TOKEN` : Token pour l'accès admin
- `SMTP_USER` : Email pour les notifications
- `SMTP_PASSWORD` : Mot de passe email

## Démarrage

### Mode développement
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3001`

### Mode production
```bash
npm run build
npm start
```

## Structure du projet

```
src/
├── config/          # Configuration (DB, etc.)
├── models/          # Modèles Sequelize
├── routes/          # Routes API
├── middleware/      # Middlewares (auth, erreurs)
├── services/        # Services (Stripe, email)
└── index.ts         # Point d'entrée
```

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur
- `PUT /api/auth/profile` - Mettre à jour le profil

### Produits
- `GET /api/products` - Lister les produits
- `GET /api/products/:id` - Détails d'un produit
- `GET /api/products/categories/list` - Lister les catégories
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products/:id` - Mettre à jour un produit (admin)
- `DELETE /api/products/:id` - Supprimer un produit (admin)

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Mes commandes
- `GET /api/orders/:id` - Détails d'une commande
- `POST /api/orders/:id/cancel` - Annuler une commande

### Fidélité
- `GET /api/loyalty/points` - Mes points
- `GET /api/loyalty/history` - Historique
- `POST /api/loyalty/redeem` - Utiliser les points

### Admin
- `GET /api/admin/orders` - Toutes les commandes
- `PUT /api/admin/orders/:id/status` - Changer le statut
- `GET /api/admin/reports/sales` - Rapports de ventes
- `GET /api/admin/reports/top-products` - Produits les plus vendus
- `GET /api/admin/settings` - Paramètres du restaurant
- `PUT /api/admin/settings` - Mettre à jour les paramètres

## Authentification

Les requêtes protégées nécessitent un header `Authorization` :

```
Authorization: Bearer <token_jwt>
```

Les requêtes admin nécessitent un header `X-Admin-Token` :

```
X-Admin-Token: <admin_token>
```

## Temps réel (Socket.io)

### Événements clients
- `join-order-room` : Rejoindre la room d'une commande
- `join-admin-room` : Rejoindre la room admin

### Événements serveur
- `new-order` : Nouvelle commande (admin)
- `order-status-updated` : Statut de commande mis à jour (client)

## Paiement Stripe

Les paiements sont gérés via Stripe Payment Intent. Le flux :

1. Client crée une commande avec `paymentMethodId`
2. Serveur crée un Payment Intent
3. Si le paiement est confirmé, la commande est validée
4. Les points de fidélité sont attribués

## Base de données

Modèles :
- `User` - Utilisateurs
- `Product` - Produits
- `Order` - Commandes
- `OrderItem` - Items de commande
- `LoyaltyTransaction` - Transactions de fidélité
- `RestaurantSettings` - Paramètres du restaurant

## Déploiement

### Heroku
```bash
heroku create local-en-mouvement-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### Railway / Render
Voir la documentation respective pour le déploiement.

## Développement

### Ajouter une nouvelle route
1. Créer un fichier dans `src/routes/`
2. Importer dans `src/index.ts`
3. Ajouter avec `app.use('/api/...', routes)`

### Ajouter un nouveau modèle
1. Créer la classe dans `src/models/index.ts`
2. Définir les attributs avec Sequelize
3. Ajouter les relations si nécessaire

## Troubleshooting

### Erreur de connexion DB
- Vérifier la `DATABASE_URL`
- S'assurer que PostgreSQL est en cours d'exécution
- Vérifier les permissions de l'utilisateur DB

### Erreur Stripe
- Vérifier les clés Stripe
- S'assurer que le format du montant est correct (en cents)

### Erreur JWT
- Vérifier que `JWT_SECRET` est défini
- Vérifier le format du token Bearer

## Support

Pour les problèmes, consulter la documentation :
- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Stripe API](https://stripe.com/docs/api)
- [Socket.io](https://socket.io/docs/)
