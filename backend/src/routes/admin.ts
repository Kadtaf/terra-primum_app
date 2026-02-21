import express, { Router, Request, Response } from 'express';
import { Order, OrderItem, Product, User, RestaurantSettings } from '../models/index.ts';
import { authenticate,isAdmin } from '../middleware/auth.ts';
import { io } from '../index.ts';
import { Op } from 'sequelize';
import {
  getAllUsers,
  updateUserRole,
  toggleUserStatus
} from '../controllers/adminUserController';

const router: Router = express.Router();

// Obtenir toutes les commandes
router.get('/orders', authenticate, isAdmin, async (req: Request, res: Response) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    const orders = await Order.findAll({
      where,
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] },
        { model: User, as: 'user', attributes: ['firstName', 'lastName', 'phone'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });

    const total = await Order.count({ where });

    res.json({
      orders,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error) {
    console.error('Erreur récupération commandes admin:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
});

// Mettre à jour le statut d'une commande
router.put('/orders/:id/status', authenticate, isAdmin, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    await order.update({ status });

    // Notifier le client via Socket.io
    io.to(`order-${order.id}`).emit('order-status-updated', {
      orderId: order.id,
      status,
      updatedAt: new Date(),
    });

    res.json({
      message: 'Statut de la commande mis à jour',
      order,
    });
  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
});

// Obtenir les statistiques de ventes
router.get('/reports/sales', authenticate, isAdmin, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const where: any = { status: 'delivered' };

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
      };
    }

    const orders = await Order.findAll({
      where,
      attributes: ['id', 'totalPrice', 'createdAt'],
    });

    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalPrice as any), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    res.json({
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders,
      averageOrderValue: averageOrderValue.toFixed(2),
      orders,
    });
  } catch (error) {
    console.error('Erreur rapports ventes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des rapports' });
  }
});

// Obtenir les produits les plus vendus
router.get('/reports/top-products', authenticate, isAdmin, async (req: Request, res: Response) => {
  try {
    const topProducts = await OrderItem.findAll({
      attributes: ['productId', [require('sequelize').fn('SUM', require('sequelize').col('quantity')), 'totalQuantity']],
      group: ['productId'],
      order: [[require('sequelize').fn('SUM', require('sequelize').col('quantity')), 'DESC']],
      limit: 10,
      include: [{ model: Product, as: 'product' }],
      raw: true,
    });

    res.json(topProducts);
  } catch (error) {
    console.error('Erreur top produits:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
});

// Obtenir les paramètres du restaurant
router.get('/settings', authenticate, isAdmin, async (req: Request, res: Response) => {
  try {
    let settings = await RestaurantSettings.findOne();

    if (!settings) {
      settings = await RestaurantSettings.create({});
    }

    res.json(settings);
  } catch (error) {
    console.error('Erreur récupération paramètres:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des paramètres' });
  }
});

// Mettre à jour les paramètres du restaurant
router.put('/settings', authenticate, isAdmin, async (req: Request, res: Response) => {
  try {
    let settings = await RestaurantSettings.findOne();

    const openingHours = req.body.openingHours || {};

    await settings!.update({
      openingHours
    });

    res.json({
      message: 'Paramètres mis à jour',
      settings,
    });

  } catch (error) {
    console.error('Erreur mise à jour paramètres:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des paramètres' });
  }
});

// -----------------------------
// CRUD PRODUITS (ADMIN)
// -----------------------------

// Obtenir tous les produits
router.get('/products', authenticate, isAdmin, async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Erreur récupération produits admin:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
});

// Ajouter un produit
router.post('/products', authenticate, isAdmin, async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Erreur création produit admin:', error);
    res.status(500).json({ error: 'Erreur lors de la création du produit' });
  }
});

// Mettre à jour un produit
router.put('/products/:id', authenticate, isAdmin, async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    await product.update(req.body);

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Erreur mise à jour produit admin:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
  }
});

// Supprimer un produit
router.delete('/products/:id', authenticate, isAdmin, async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    await product.destroy();

    res.json({ success: true, message: 'Produit supprimé' });
  } catch (error) {
    console.error('Erreur suppression produit admin:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
  }
});

// Réinitialiser les paramètres du restaurant aux valeurs par défaut
router.post('/settings/reset', authenticate, isAdmin, async (req, res) => {
  try {
    const defaultSettings = {
      openingHours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '12:00', close: '23:00' },
        sunday: { open: '12:00', close: '22:00' },
      },
      closedDays: [],
      deliveryFee: 2.50,
      minOrderAmount: 15.00,
    };

    let settings = await RestaurantSettings.findOne();

    if (!settings) {
      settings = await RestaurantSettings.create(defaultSettings);
    } else {
      await settings.update(defaultSettings);
    }

    res.json({
      message: "Paramètres réinitialisés",
      settings,
    });

  } catch (error) {
    console.error("Erreur réinitialisation paramètres:", error);
    res.status(500).json({ error: "Erreur lors de la réinitialisation" });
  }
});

// Obtenir tous les utilisateurs
router.get('/users', authenticate, isAdmin, getAllUsers);


// Modifier le rôle d'un utilisateur
router.put('/users/:id/role', authenticate, isAdmin, updateUserRole);


// Activer / désactiver un utilisateur
router.put('/users/:id/toggle-status', authenticate, isAdmin, toggleUserStatus);



export default router;
