import express, { Router, Request, Response } from 'express';
import { User, LoyaltyTransaction } from '../models/index.ts';
import { authenticate } from '../middleware/auth.ts';

const router: Router = express.Router();

// Obtenir les points de fidélité
router.get('/points', authenticate, async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({
      points: user.loyaltyPoints,
      redeemableAmount: Math.floor(user.loyaltyPoints / 100) * 10, // 100 points = 10€
    });
  } catch (error) {
    console.error('Erreur récupération points:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des points' });
  }
});

// Obtenir l'historique de fidélité
router.get('/history', authenticate, async (req: Request, res: Response) => {
  try {
    const transactions = await LoyaltyTransaction.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    res.json(transactions);
  } catch (error) {
    console.error('Erreur récupération historique:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
  }
});

// Utiliser les points de fidélité
router.post('/redeem', authenticate, async (req: Request, res: Response) => {
  try {
    const { points } = req.body;

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    if (user.loyaltyPoints < points) {
      return res.status(400).json({ error: 'Points insuffisants' });
    }

    // Décrémenter les points
    await user.decrement('loyaltyPoints', { by: points });

    // Enregistrer la transaction
    await LoyaltyTransaction.create({
      userId: req.userId,
      points: -points,
      type: 'redeemed',
    });

    res.json({
      message: 'Points utilisés avec succès',
      remainingPoints: user.loyaltyPoints - points,
      discount: Math.floor(points / 100) * 10, // 100 points = 10€
    });
  } catch (error) {
    console.error('Erreur utilisation points:', error);
    res.status(500).json({ error: 'Erreur lors de l\'utilisation des points' });
  }
});

export default router;
