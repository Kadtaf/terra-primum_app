import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

/**
 * Modèle Restaurant
 * Contient les informations générales du restaurant
 */
export class Restaurant extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare address: string;
  declare phone: string;
  declare email: string;
  declare hours: object;
}

Restaurant.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    hours: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Restaurant',
    tableName: 'restaurant',
  }
);

export default Restaurant;