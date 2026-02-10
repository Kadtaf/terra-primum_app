import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

/**
 * Modèle Category
 * Représente une catégorie du menu (ex: Burgers, Sandwichs, Salades)
 */
export class Category extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
}

Category.init(
  {
    id: {
      type: DataTypes.STRING,
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
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
  }
);

export default Category;