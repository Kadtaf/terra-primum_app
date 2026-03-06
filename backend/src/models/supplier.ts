import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Supplier extends Model {
    declare id: string;
    declare name: string;
    declare contactInfo: string | null;
}

Supplier.init(
    {
        id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // UUID comme tes autres modèles
        primaryKey: true,
        },

        name: {
        type: DataTypes.STRING,
        allowNull: false,
        },

        contactInfo: {
        type: DataTypes.TEXT,
        allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Supplier",
        tableName: "suppliers",
    },
);

export default Supplier;
