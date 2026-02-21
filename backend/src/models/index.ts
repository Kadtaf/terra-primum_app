import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import Category from './Category';
import Restaurant from './Restaurant';


// User Model
export class User extends Model {
  declare id: string;
  declare email: string;
  declare role: string;
  declare password: string;
  declare firstName: string;
  declare lastName: string;
  declare phone: string;
  declare loyaltyPoints: number;
  declare totalOrders: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare isActive: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    loyaltyPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalOrders: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'isactive',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

// Product Model
export class Product extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare price: number;
  declare category: string;
  declare image?: string;
  declare ingredients: string[];
  declare allergens: string[];
  declare isAvailable: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      get() {
        const rawValue = this.getDataValue('price');
        return rawValue ? parseFloat(rawValue) : null;
      },
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ingredients: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    allergens: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
  }
);

// Order Model
export class Order extends Model {
  declare id: string;
  declare userId: string;
  declare totalPrice: number;
  declare status: string;
  declare deliveryType: string;
  declare deliveryAddress: string;
  declare estimatedTime: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'),
      defaultValue: 'pending',
    },
    deliveryType: {
      type: DataTypes.ENUM('delivery', 'pickup'),
      allowNull: false,
    },
    deliveryAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estimatedTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
  }
);

// OrderItem Model
export class OrderItem extends Model {
  declare id: string;
  declare orderId: string;
  declare productId: string;
  declare quantity: number;
  declare price: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
  }
);

// LoyaltyTransaction Model
export class LoyaltyTransaction extends Model {
  declare id: string;
  declare userId: string;
  declare points: number;
  declare type: string;
  declare orderId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

LoyaltyTransaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('earned', 'redeemed'),
      allowNull: false,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'LoyaltyTransaction',
    tableName: 'loyalty_transactions',
  }
);

// RestaurantSettings Model
export class RestaurantSettings extends Model {
  declare id: string;

  declare openingHours: {
    [day: string]: { open: string; close: string } | null;
  };

  declare deliveryFee: number;
  declare minOrderAmount: number;
  
  declare createdAt: Date;
  declare updatedAt: Date;
}

RestaurantSettings.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    openingHours: {
      type: DataTypes.JSONB,
      defaultValue: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '12:00', close: '23:00' },
        sunday: { open: '12:00', close: '22:00' },
      },
    },
    deliveryFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 2.50,
    },
    minOrderAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 15.00,
    },
  },
  {
    sequelize,
    modelName: 'RestaurantSettings',
    tableName: 'restaurant_settings',
  }
);

// Relations
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

User.hasMany(LoyaltyTransaction, { foreignKey: 'userId', as: 'loyaltyTransactions' });
LoyaltyTransaction.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Product, { foreignKey: 'category' });
Product.belongsTo(Category, { foreignKey: 'category' });

export default {
  User,
  Product,
  Order,
  OrderItem,
  LoyaltyTransaction,
  RestaurantSettings,
  Category,
  Restaurant,
};
