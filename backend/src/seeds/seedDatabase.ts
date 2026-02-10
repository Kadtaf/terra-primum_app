import models from '../models/index';
import { menuData } from '../data/menu';

export async function seedDatabase() {
  try {
    // 1. Catégories
    for (const category of menuData.categories) {
      await models.Category.findOrCreate({
        where: { id: category.id },
        defaults: {
          id: category.id,
          name: category.name,
          description: category.description,
        },
      });
    }

    // 2. Produits
    for (const product of menuData.products) {
      await models.Product.findOrCreate({
        where: { id: product.id },
        defaults: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image,
          allergens: product.allergens,
          available: true,
        },
      });
    }

    // 3. Restaurant
    await models.Restaurant.findOrCreate({
      where: { id: 'restaurant-1' },
      defaults: {
        id: 'restaurant-1',
        name: menuData.restaurant.name,
        description: menuData.restaurant.description,
        address: menuData.restaurant.address,
        phone: menuData.restaurant.phone,
        email: menuData.restaurant.email,
        hours: menuData.restaurant.hours,
      },
    });

    console.log('✅ Base de données initialisée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}