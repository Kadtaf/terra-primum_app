import express, { Router, Request, Response } from 'express';
import { Order, OrderItem, Product, User } from '../models/index';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/index';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/orders - Récupérer les commandes de l'utilisateur
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { page = 1, limit = 10, status } = req.query;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
    const offset = (pageNum - 1) * limitNum;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
      limit: limitNum,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des commandes',
    });
  }
});

// GET /api/orders/:id - Récupérer une commande spécifique
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
        { model: User, as: 'user' },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée',
      });
    }

    // Vérifier que l'utilisateur est propriétaire de la commande
    if ((order as any).userId !== (req as any).userId) {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de la commande',
    });
  }
});

// POST /api/orders - Créer une nouvelle commande
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const validation = createOrderSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors,
      });
    }

    const userId = (req as any).userId;
    const { items, deliveryType, deliveryAddress } = validation.data;

    // Calculer le prix total
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Produit ${item.productId} non trouvé`,
        });
      }

      const itemTotal = (product as any).price * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: (product as any).price,
      });
    }

    // Créer la commande
    const order = await Order.create({
      userId,
      totalPrice,
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : null,
      status: 'pending',
      estimatedTime: new Date(Date.now() + 30 * 60000), // 30 minutes
    });

    // Créer les items de la commande
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: (order as any).id,
        ...item,
      });
    }

    // Récupérer la commande complète
    const completeOrder = await Order.findByPk((order as any).id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: completeOrder,
      message: 'Commande créée avec succès',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de la commande',
    });
  }
});

// PUT /api/orders/:id/status - Mettre à jour le statut (Admin)
router.put('/:id/status', authenticate, async (req: Request, res: Response) => {
  try {
    const validation = updateOrderStatusSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors,
      });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée',
      });
    }

    await order.update({ status: validation.data.status });

    res.json({
      success: true,
      data: order,
      message: 'Statut de la commande mis à jour',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du statut',
    });
  }
});

// GET /api/orders/stats/summary - Statistiques des commandes (Admin)
router.get('/stats/summary', authenticate, async (req: Request, res: Response) => {
  try {
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { status: 'pending' } });
    const completedOrders = await Order.count({ where: { status: 'delivered' } });

    const totalRevenue = await Order.sum('totalPrice', {
      where: { status: 'delivered' },
    });

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques',
    });
  }
});

export default router;
