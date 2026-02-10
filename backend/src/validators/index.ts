import { z } from 'zod';

// User Validators
export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
});

// Product Validators
export const createProductSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().optional(),
  price: z.number().positive('Le prix doit être positif'),
  category: z.string().min(1, 'La catégorie est requise'),
  image: z.string().url('URL invalide').optional(),
  allergens: z.array(z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

// Order Validators
export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid('ID produit invalide'),
      quantity: z.number().int().positive('La quantité doit être positive'),
    })
  ).min(1, 'Au moins un produit est requis'),
  deliveryType: z.enum(['delivery', 'pickup'], {
    errorMap: () => ({ message: 'Type de livraison invalide' }),
  }),
  deliveryAddress: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'], {
    errorMap: () => ({ message: 'Statut invalide' }),
  }),
});

// Payment Validators
export const createPaymentSchema = z.object({
  orderId: z.string().uuid('ID commande invalide'),
  amount: z.number().positive('Le montant doit être positif'),
  paymentMethodId: z.string().min(1, 'Méthode de paiement requise'),
});

// Loyalty Validators
export const redeemLoyaltySchema = z.object({
  points: z.number().int().positive('Les points doivent être positifs'),
});

// Search Validators
export const searchSchema = z.object({
  query: z.string().min(1, 'La recherche ne peut pas être vide'),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

// Pagination Validators
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
