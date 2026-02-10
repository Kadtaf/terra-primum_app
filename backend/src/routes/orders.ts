import express, { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { Order, OrderItem, Product, User, LoyaltyTransaction } from '../models/index.ts';
import { authenticate } from '../middleware/auth.ts';
import { io } from '../index.ts';

const router: Router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

// Créer une commande
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { items, deliveryType, deliveryAddress, paymentMethodId } = req.body;

    // Calculer le total
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Produit ${item.productId} non trouvé` });
      }

      const itemTotal = parseFloat(product.price as any) * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Créer la commande
    const order = await Order.create({
      userId: req.userId,
      totalPrice,
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : null,
      status: 'pending',
    });

    // Ajouter les items
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        ...item,
      });
    }

    // Créer le paiement Stripe
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100), // Montant en cents
        currency: 'eur',
        payment_method: paymentMethodId,
        confirm: true,
        metadata: {
          orderId: order.id,
          userId: req.userId,
        },
      });

      if (paymentIntent.status === 'succeeded') {
        // Mettre à jour le statut de la commande
        await order.update({ status: 'confirmed' });

        // Ajouter les points de fidélité
        const user = await User.findByPk(req.userId);
        const points = Math.floor(totalPrice);
        await user?.increment('loyaltyPoints', { by: points });
        await LoyaltyTransaction.create({
          userId: req.userId,
          points,
          type: 'earned',
          orderId: order.id,
        });

        // Notifier les admins via Socket.io
        io.to('admin-orders').emit('new-order', {
          id: order.id,
          totalPrice,
          status: 'confirmed',
          createdAt: order.createdAt,
        });

        res.status(201).json({
          message: 'Commande créée et paiement confirmé',
          order: {
            id: order.id,
            totalPrice,
            status: 'confirmed',
          },
        });
      } else {
        res.status(400).json({ error: 'Paiement non confirmé' });
      }
    } catch (stripeError) {
      console.error('Erreur Stripe:', stripeError);
      res.status(400).json({ error: 'Erreur lors du paiement' });
    }
  } catch (error) {
    console.error('Erreur création commande:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la commande' });
  }
});

// Obtenir mes commandes
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.userId },
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
      order: [['createdAt', 'DESC']],
    });

    res.json(orders);
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
});

// Obtenir une commande par ID
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
    });

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Vérifier que c'est la commande de l'utilisateur
    if (order.userId !== req.userId) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    res.json(order);
  } catch (error) {
    console.error('Erreur récupération commande:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la commande' });
  }
});

// Annuler une commande
router.post('/:id/cancel', authenticate, async (req: Request, res: Response) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    if (order.userId !== req.userId) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ error: 'Impossible d\'annuler cette commande' });
    }

    await order.update({ status: 'cancelled' });

    res.json({
      message: 'Commande annulée',
      order,
    });
  } catch (error) {
    console.error('Erreur annulation commande:', error);
    res.status(500).json({ error: 'Erreur lors de l\'annulation de la commande' });
  }
});

export default router;
