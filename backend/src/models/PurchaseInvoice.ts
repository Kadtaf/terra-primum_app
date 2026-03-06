import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class PurchaseInvoice extends Model {
    declare id: string;
    declare supplierId: string;
    declare invoiceNumber: string;
    declare invoiceDate: string;
    declare totalHt: number | null;
    declare totalTtc: number | null;
    declare currency: string;
    declare rawFileUrl: string | null;
}

PurchaseInvoice.init(
    {
        id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        },

        supplierId: {
        type: DataTypes.UUID,
        allowNull: false,
        },

        invoiceNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        },

        invoiceDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        },

        totalHt: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        },

        totalTtc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        },

        currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "EUR",
        },

        rawFileUrl: {
        type: DataTypes.STRING,
        allowNull: true, // PDF ou image uploadée
        },
    },
    {
        sequelize,
        modelName: "PurchaseInvoice",
        tableName: "purchase_invoices",
    },
);

export default PurchaseInvoice;
