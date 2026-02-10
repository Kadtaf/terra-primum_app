import express, { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { Order } from '../models/index';
import { authenticate } from '../middleware/auth';
import { createPaymentSchema } from '../validators/index';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// POST /api/payment/create-intent - Créer une intention de paiement
router.post('/create-intent', authenticate, async (req: Request, res: Response) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'orderId et amount sont requis',
      });
    }

    // Vérifier que la commande existe
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée',
      });
    }

    // Créer une intention de paiement
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Montant en centimes
      currency: 'eur',
      metadata: {
        orderId,
        userId: (req as any).userId,
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Erreur Stripe:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la création du paiement',
    });
  }
});

// POST /api/payment/confirm - Confirmer le paiement
router.post('/confirm', authenticate, async (req: Request, res: Response) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    if (!paymentIntentId || !orderId) {
      return res.status(400).json({
        success: false,
        error: 'paymentIntentId et orderId sont requis',
      });
    }

    // Récupérer l'intention de paiement
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Mettre à jour le statut de la commande
      const order = await Order.findByPk(orderId);
      if (order) {
        await order.update({ status: 'confirmed' });
      }

      res.json({
        success: true,
        message: 'Paiement confirmé avec succès',
        order,
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Le paiement n\'a pas été complété',
      });
    }
  } catch (error: any) {
    console.error('Erreur lors de la confirmation:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la confirmation du paiement',
    });
  }
});

// POST /api/payment/webhook - Webhook Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Paiement réussi:', paymentIntent.id);
        // Mettre à jour la commande
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Paiement échoué:', failedIntent.id);
        break;

      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Erreur webhook:', error);
    res.status(400).json({ error: 'Erreur webhook' });
  }
});

// GET /api/payment/status/:paymentIntentId - Vérifier le statut du paiement
router.get('/status/:paymentIntentId', authenticate, async (req: Request, res: Response) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(req.params.paymentIntentId);

    res.json({
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la récupération du statut',
    });
  }
});

export default router;
