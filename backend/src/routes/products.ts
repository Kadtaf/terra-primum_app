import express, { Router, Request, Response } from 'express';
import { Product } from '../models/index.js';
import { isAdmin } from '../middleware/auth.ts';

const router: Router = express.Router();

// Lister tous les produits
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const where: any = { available: true };

    if (category) {
      where.category = category;
    }

    const products = await Product.findAll({ where });
    res.json(products);
  } catch (error) {
    console.error('Erreur récupération produits:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
});

// Lister les catégories
router.get('/categories/list', async (req: Request, res: Response) => {
  try {
    const categories = await Product.findAll({
      attributes: ['category'],
      group: ['category'],
      raw: true,
    });

    const categoryList = categories.map((c: any) => c.category);
    res.json(categoryList);
  } catch (error) {
    console.error('Erreur récupération catégories:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
  }
});

// Obtenir un produit par ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(product);
  } catch (error) {
    console.error('Erreur récupération produit:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
  }
});



// Créer un produit (admin)
router.post('/', isAdmin, async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, image, ingredients, allergens } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      ingredients: ingredients || [],
      allergens: allergens || [],
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Erreur création produit:', error);
    res.status(500).json({ error: 'Erreur lors de la création du produit' });
  }
});

// Mettre à jour un produit (admin)
router.put('/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    await product.update(req.body);
    res.json(product);
  } catch (error) {
    console.error('Erreur mise à jour produit:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
  }
});

// Supprimer un produit (admin)
router.delete('/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    await product.destroy();
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    console.error('Erreur suppression produit:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
  }
});

export default router;
