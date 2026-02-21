import express, { Router, Request, Response } from 'express';
import { Product } from '../models/index.ts';
import { isAdmin } from '../middleware/auth.ts';
import { Op } from 'sequelize';

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

// Pagination PRO
router.get('/paginated', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 12;

    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;

    const where: any = { available: true };

    // Filtre catégorie
    if (category) {
      where.category = category;
    }

    // Filtre recherche
    if (search) {
      where[Symbol.for('or')] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Total avant pagination
    const total = await Product.count({ where });

    // Produits paginés
    const items = await Product.findAll({
      where,
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    res.json({
      items,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Erreur pagination produits:', error);
    res.status(500).json({ error: 'Erreur lors de la pagination des produits' });
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
