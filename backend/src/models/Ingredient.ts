import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Ingredient extends Model {
    declare id: string;
    declare name: string;
    declare category: string;
    declare unit: string;
    declare vatRate: number;
}

Ingredient.init(
    {
        id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        },
        name: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        category: {
        type: DataTypes.ENUM(
            "fruits_legumes",
            "laitiers",
            "epicerie",
            "viandes",
            "poisson",
            "alcool",
            "boissons",
            "divers",
        ),
        allowNull: false,
        },
        unit: {
        type: DataTypes.STRING, // ex: "kg", "L", "unité"
        allowNull: false,
        },
        vatRate: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        defaultValue: 20.0,
        },
    },
    {
        sequelize,
        modelName: "Ingredient",
        tableName: "ingredients",
    },
);

export default Ingredient;
