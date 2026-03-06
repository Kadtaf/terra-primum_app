import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class PurchaseInvoiceLine extends Model {
    declare id: string;
    declare invoiceId: string;
    declare productId: string | null;
    declare ingredientId: string | null;
    declare productNameRaw: string;
    declare quantity: number;
    declare unit: string;
    declare unitPriceHt: number | null;
    declare totalPriceHt: number | null;
    declare vatRate: number | null;
}

PurchaseInvoiceLine.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        invoiceId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "purchase_invoices",
                key: "id",
            },            
        },

        productId: {
            type: DataTypes.STRING,
            allowNull: true,
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

        productNameRaw: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        quantity: {
            type: DataTypes.DECIMAL(10, 3),
            allowNull: false,
        },

        unit: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        unitPriceHt: {
            type: DataTypes.DECIMAL(10, 4),
            allowNull: true,
        },

        totalPriceHt: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },

        vatRate: {
            type: DataTypes.DECIMAL(4, 2),
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "PurchaseInvoiceLine",
        tableName: "purchase_invoice_lines",
    },
);



export default PurchaseInvoiceLine;
