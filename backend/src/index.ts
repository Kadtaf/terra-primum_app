import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { sequelize } from './config/database';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import loyaltyRoutes from './routes/loyalty';
import adminRoutes from './routes/admin';
import { errorHandler } from './middleware/errorHandler';
import adminStatsRoutes from './routes/adminStatsRoutes';
import categoryRoutes from './routes/categories';
import adminCategoryRoutes from './routes/adminCategories';
import publicRoutes from './routes/public';
import purchaseInvoicesRouter from "./routes/purchaseInvoices";
import stockRoutes from "./routes/stock";


dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5175',
    methods: ['GET', 'POST'],
  },
});


// Middleware de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5175',
  credentials: true,
}));


// Rate limiting
if (process.env.NODE_ENV === "production") {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
  app.use(limiter);
}

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/admin/stats', adminStatsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/purchase-invoices", purchaseInvoicesRouter);
app.use("/uploads", express.static("uploads"));
app.use("/api/stock", stockRoutes);


// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.io pour les mises à jour en temps réel
io.on('connection', (socket) => {
  console.log(`Client connecté: ${socket.id}`);

  // Rejoindre une room pour les mises à jour de commande
  socket.on('join-order-room', (orderId: string) => {
    socket.join(`order-${orderId}`);
    console.log(`Client ${socket.id} a rejoint la room order-${orderId}`);
  });

  // Rejoindre la room admin pour les nouvelles commandes
  socket.on('join-admin-room', () => {
    socket.join('admin-orders');
    console.log(`Admin ${socket.id} a rejoint la room admin-orders`);
  });

  socket.on('disconnect', () => {
    console.log(`Client déconnecté: ${socket.id}`);
  });
});

// Middleware d'erreur
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Initialiser la base de données et démarrer le serveur
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Tester la connexion à la base de données
    await sequelize.authenticate();
    console.log('✓ Connexion à la base de données établie');

    // Synchroniser les modèles
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✓ Modèles synchronisés');

    // Démarrer le serveur
    httpServer.listen(PORT, () => {
      console.log(`\n Serveur démarré sur http://localhost:${PORT}`);
      console.log(`API disponible sur http://localhost:${PORT}/api`);
      console.log(`Socket.io disponible sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erreur au démarrage du serveur:', error);
    process.exit(1);
  }
}

startServer();

// Exporter io pour utilisation dans les routes
export { io };
