import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";


export class StockItem extends Model {
    declare id: string;
    declare productId: string;
    declare ingredientId: string | null;
    declare quantity: number;
    declare reorderThreshold: number | null;
}

StockItem.init(
    {
        id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        },

        productId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: "products",
            key: "id",
        },
        },

        ingredientId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "ingredients",
                key: "id",
            },
        },

        quantity: {
        type: DataTypes.DECIMAL(10, 3),
        defaultValue: 0,
        },

        reorderThreshold: {
        type: DataTypes.DECIMAL(10, 3),
        allowNull: true, // seuil d'alerte (optionnel)
        },
    },
    {
        sequelize,
        modelName: "StockItem",
        tableName: "stock_items",
    }
);



export default StockItem;
