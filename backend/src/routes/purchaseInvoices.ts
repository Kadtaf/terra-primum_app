import pdf from "pdf-poppler";
import fs from "fs";
import { Router, Request, Response, raw } from "express";
import Supplier from "../models/Supplier";
import PurchaseInvoice from "../models/PurchaseInvoice";
import PurchaseInvoiceLine from "../models/PurchaseInvoiceLine";
import { upload } from "../middleware/upload";
import Tesseract from "tesseract.js";
import path from "path";
import { fileURLToPath } from "url";
import { cleanOcrText } from "../utils/cleanOcrText";
import { parseOcrInvoice } from "../utils/parseOcrInvoice";
import { detectSupplierFromOcr } from "../utils/detectSupplierFormOcr";
import { Op } from "sequelize";
import { applyInvoiceToStock } from "../services/stockService";
import { applyInvoiceToStockByIngredient } from "../services/stockService";
import { matchIngredient } from "../utils/matchIngredient"; 
import { normalizeLabel, guessUnit } from "../utils/ocrHelpers"; 




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const router = Router();

// Empêcher les GET accidentels sur /ocr et /ocr-preview
router.get("/ocr", (req, res) => {
    return res.status(405).json({ message: "Utiliser POST /api/purchase-invoices/ocr" });
});

router.get("/ocr-preview", (req, res) => {
    return res
        .status(405)
        .json({ message: "Utiliser POST /api/purchase-invoices/ocr-preview" });
});

// Upload fichier (PDF / image)
router.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier reçu" });
        }

        const fileUrl = `/uploads/${req.file.filename}`;

        return res.json({ fileUrl });
    } catch (error) {
        console.error("Erreur upload fichier :", error);
        return res.status(500).json({ message: "Erreur lors de l'upload du fichier" });
    }
});


/**
 * Créer une facture fournisseur
 */
router.post("/", async (req: Request, res: Response) => {
    try {
        const {
        supplierId,
        invoiceNumber,
        invoiceDate,
        totalHt,
        totalTtc,
        rawFileUrl,
        } = req.body;

        const invoice = await PurchaseInvoice.create({
        supplierId,
        invoiceNumber,
        invoiceDate,
        totalHt,
        totalTtc,
        rawFileUrl,
        });

        return res.status(201).json(invoice);
    } catch (error) {
        console.error("Erreur création facture :", error);
        return res
        .status(500)
        .json({ message: "Erreur lors de la création de la facture." });
    }
});

/**
 * Ajouter des lignes à une facture
 */
router.post("/:invoiceId/lines", async (req: Request, res: Response) => {
    try {
        const { invoiceId } = req.params;
        const { lines } = req.body;

        if (!Array.isArray(lines)) {
            return res.status(400).json({ message: "lines doit être un tableau." });
            }

            const createdLines = await Promise.all(
            lines.map((line) =>
                PurchaseInvoiceLine.create({
                invoiceId,
                productNameRaw: line.productNameRaw,
                quantity: line.quantity,
                unit: line.unit,
                unitPriceHt: line.unitPriceHt,
                totalPriceHt: line.totalPriceHt,
                vatRate: line.vatRate,
                }),
            ),
            );

            return res.status(201).json(createdLines);
        } catch (error) {
            console.error("Erreur ajout lignes facture :", error);
            return res
            .status(500)
            .json({ message: "Erreur lors de l'ajout des lignes." });
        }
});

/**
 * Liste des factures
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const invoices = await PurchaseInvoice.findAll({
        include: [
            {
            model: Supplier,
            as: "supplier",
            attributes: ["id", "name"],
            },
        ],
        order: [["invoiceDate", "DESC"]],
        });

        return res.json(invoices);
    } catch (error) {
        console.error("Erreur récupération factures :", error);
        return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des factures." });
    }
    });

    /**
 * Historique des prix
 * GET /api/purchase-invoices/price-history
 * Query params :
 *   - supplierId (obligatoire)
 *   - product (optionnel, recherche sur productNameRaw)
 *   - fromDate (optionnel, YYYY-MM-DD)
 *   - toDate (optionnel, YYYY-MM-DD)
 */
router.get("/price-history", async (req: Request, res: Response) => {
    try {
        const { supplierId, product, fromDate, toDate } = req.query;

        if (!supplierId || typeof supplierId !== "string") {
        return res
            .status(400)
            .json({ message: "supplierId est obligatoire" });
        }

        // Construire le filtre sur la facture
        const invoiceWhere: any = { supplierId };

        if (fromDate || toDate) {
        invoiceWhere.invoiceDate = {};
        if (fromDate && typeof fromDate === "string") {
            invoiceWhere.invoiceDate[Op.gte] = fromDate;
        }
        if (toDate && typeof toDate === "string") {
            invoiceWhere.invoiceDate[Op.lte] = toDate;
        }
        }

        // Filtre sur les lignes (produit)
        const lineWhere: any = {};
        if (product && typeof product === "string") {
        lineWhere.productNameRaw = { [Op.iLike]: `%${product}%` };
        }

        const invoices = await PurchaseInvoice.findAll({
        where: invoiceWhere,
        include: [
            {
            model: PurchaseInvoiceLine,
            as: "lines",
            where: Object.keys(lineWhere).length ? lineWhere : undefined,
            required: true, // uniquement les factures qui ont des lignes qui matchent
            },
        ],
        order: [
            ["invoiceDate", "ASC"],
            [{ model: PurchaseInvoiceLine, as: "lines" }, "createdAt", "ASC"],
        ],
        });

        // On aide TypeScript : PurchaseInvoice + champ line: any[]
        const typedInvoices = invoices as (PurchaseInvoice & {
            lines: any[];
        })[];

        // Aplatir en tableau de "lignes d'historique"
        const history = typedInvoices.flatMap((inv) =>
        inv.lines.map((line: any) => ({
            invoiceId: inv.id,
            invoiceDate: inv.invoiceDate,
            supplierId: inv.supplierId,
            productNameRaw: line.productNameRaw,
            quantity: line.quantity,
            unit: line.unit,
            unitPriceHt: line.unitPriceHt,
            totalPriceHt: line.totalPriceHt,
            vatRate: line.vatRate,
        }))
        );

        return res.json(history);
    } catch (error) {
        console.error("Erreur historique des prix :", error);
        return res
        .status(500)
        .json({ message: "Erreur lors de la récupération de l'historique." });
    }
});

    /**
     * Détail d'une facture (avec lignes)
     */
    router.get("/:id", async (req: Request, res: Response) => {
    try {
        const invoice = await PurchaseInvoice.findByPk(req.params.id, {
        include: [
            {
            model: Supplier,
            as: "supplier",
            attributes: ["id", "name"],
            },
            {
            model: PurchaseInvoiceLine,
            as: "lines",
            },
        ],
        });

        if (!invoice) {
        return res.status(404).json({ message: "Facture non trouvée." });
        }

        return res.json(invoice);
    } catch (error) {
        console.error("Erreur récupération facture :", error);
        return res
        .status(500)
        .json({ message: "Erreur lors de la récupération de la facture." });
    }
});

// Mettre à jour une facture fournisseur
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
        supplierId,
        invoiceNumber,
        invoiceDate,
        totalHt,
        totalTtc,
        } = req.body;

        const invoice = await PurchaseInvoice.findByPk(id);

        if (!invoice) {
        return res.status(404).json({ message: "Facture non trouvée." });
        }

        await invoice.update({
        supplierId,
        invoiceNumber,
        invoiceDate,
        totalHt,
        totalTtc,
        });

        return res.json(invoice);
    } catch (error) {
        console.error("Erreur mise à jour facture :", error);
        return res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour de la facture." });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Supprimer d'abord les lignes liées
        await PurchaseInvoiceLine.destroy({
        where: { invoiceId: id },
        });

        // Puis la facture
        const deleted = await PurchaseInvoice.destroy({
        where: { id },
        });

        if (!deleted) {
        return res.status(404).json({ message: "Facture non trouvée." });
        }

        return res.status(204).send();
    } catch (error) {
        console.error("Erreur suppression facture :", error);
        return res
        .status(500)
        .json({ message: "Erreur lors de la suppression de la facture." });
    }
});


// -------------------------------------------------------------
// Conversion PDF → image (sécurisée)
// -------------------------------------------------------------
const convertPdfToImage = async (pdfPath: string): Promise<string> => {
    try {
        const outputDir = path.dirname(pdfPath);
        const outputPrefix = "page";

        const options = {
        format: "jpeg",
        out_dir: outputDir,
        out_prefix: outputPrefix,
        page: 1,
        };

        await pdf.convert(pdfPath, options);

        return path.join(outputDir, `${outputPrefix}-1.jpg`);
    } catch (err) {
        console.error("Erreur conversion PDF :", err);
        throw new Error("Impossible de convertir le PDF en image");
    }
};

// -------------------------------------------------------------
// ROUTE PRINCIPALE OCR
// -------------------------------------------------------------
router.post("/ocr", async (req: Request, res: Response) => {
    try {
        const { fileUrl, supplierId } = req.body;

        if (!fileUrl) {
        return res.status(400).json({ message: "fileUrl manquant" });
        }

        const absolutePath = path.join(__dirname, "../../", fileUrl);

        if (!fs.existsSync(absolutePath)) {
        return res.status(404).json({ message: "Fichier introuvable" });
        }

        let imagePath = absolutePath;

        // PDF → image
        if (absolutePath.toLowerCase().endsWith(".pdf")) {
        imagePath = await convertPdfToImage(absolutePath);
        }

        // OCR
        const result = await Tesseract.recognize(imagePath, "fra", {
        logger: (m) => console.log(m),
        });

        // Nettoyage
        const cleaned = cleanOcrText(result.data.text);

        // Détection fournisseur
        let finalSupplierId: string | null = supplierId ?? null;

        if (!finalSupplierId) {
        const detectedId = await detectSupplierFromOcr(cleaned);

        if (detectedId) {
            finalSupplierId = detectedId;
        } else {
            const supplier = await Supplier.create({
            name: "Fournisseur inconnu",
            });
            finalSupplierId = supplier.id;
        }
        }

        // Parsing
        const parsed = parseOcrInvoice(cleaned);

        // Création facture
        const invoice = await PurchaseInvoice.create({
        supplierId: finalSupplierId,
        invoiceNumber: `OCR-${Date.now()}`,
        invoiceDate: new Date(),
        totalHt: parsed.totals.totalHt,
        totalTtc: parsed.totals.totalTtc,
        rawFileUrl: fileUrl,
        status: "ocr_done",
        });

        // Création lignes
        const createdLines = await Promise.all(
        parsed.lines.map(async (line) => {
            const ingredientId = await matchIngredient(line.label);

            return PurchaseInvoiceLine.create({
            invoiceId: invoice.id,
            productNameRaw: line.label.substring(0, 255),
            normalizedName: normalizeLabel(line.label),
            quantity: line.quantity ?? 1,
            unit: line.unit ?? guessUnit(line.label) ?? "unité",
            unitPriceHt: line.unitPrice,
            totalPriceHt: line.total,
            vatRate: 20,
            confidenceScore: line.confidence ?? null,
            ingredientId,
            });
        }),
        );

        // PAS de mise à jour du stock ici 
        // L’utilisateur doit valider d’abord dans le frontend

        return res.json({
        invoice,
        lines: createdLines,
        raw: result.data.text,
        cleaned,
        parsed,
        });
    } catch (error) {
        console.error("Erreur OCR :", error);
        return res.status(500).json({ message: "Erreur OCR" });
    }
});


router.post("/ocr-preview", async (req: Request, res: Response) => {
    try {
        const { fileUrl } = req.body;

        if (!fileUrl) {
        return res.status(400).json({ message: "fileUrl manquant" });
        }

        const absolutePath = path.join(__dirname, "../../", fileUrl);

        if (!fs.existsSync(absolutePath)) {
        return res.status(404).json({ message: "Fichier introuvable" });
        }

        let imagePath = absolutePath;

        if (absolutePath.toLowerCase().endsWith(".pdf")) {
        imagePath = await convertPdfToImage(absolutePath);
        }

        const result = await Tesseract.recognize(imagePath, "fra", {
        logger: (m) => console.log(m),
        });

        const cleaned = cleanOcrText(result.data.text);
        const parsed = parseOcrInvoice(cleaned);

        return res.json({
        raw: result.data.text,
        cleaned,
        parsed,
        });
    } catch (error) {
        console.error("Erreur OCR preview :", error);
        return res.status(500).json({ message: "Erreur OCR preview" });
    }
});

/*
* Pour chaque ligne vérifier qu'elle existe
* mettre à jour les champs modifiés
* recalculer normalizedName si le label change
* vérifier que ingredientId est valide (si fourni)
* mettre à jour la facture -> status="validated"
*/
router.post("/:id/validate-invoice", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { lines } = req.body;

        if (!lines || !Array.isArray(lines)) {
        return res.status(400).json({ message: "Format des lignes invalide" });
        }

        // Vérifier que la facture existe
        const invoice = await PurchaseInvoice.findByPk(id);
        if (!invoice) {
        return res.status(404).json({ message: "Facture introuvable" });
        }

        // Mise à jour des lignes
        const updatedLines = [];

        for (const line of lines) {
        const existingLine = await PurchaseInvoiceLine.findByPk(line.id);

        if (!existingLine) continue; // sécurité

        await existingLine.update({
            ingredientId: line.ingredientId ?? null,
            quantity: line.quantity ?? existingLine.quantity,
            unit: line.unit ?? existingLine.unit,
            unitPriceHt: line.unitPriceHt ?? existingLine.unitPriceHt,
            totalPriceHt: line.totalPriceHt ?? existingLine.totalPriceHt,
            confidenceScore: 1.0, // validé par l’utilisateur
        });

        updatedLines.push(existingLine);
        }

        // Mettre à jour le statut de la facture
        await invoice.update({ status: "validated" });

        return res.json({
        message: "Facture validée avec succès.",
        invoice,
        updatedLines,
        });
    } catch (error) {
        console.error("Erreur validate-invoice :", error);
        return res
        .status(500)
        .json({ message: "Erreur lors de la validation de la facture." });
    }
});

// ROUTE DE DEBUG / ADMIN TECHNIQUE
// Ne pas exposer en production : rejoue les entrées de stock d'une facture
router.post("/:id/apply-stock", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await applyInvoiceToStock(id);

        return res.json({ message: "Stock mis à jour à partir de la facture." });
    } catch (error) {
        console.error("Erreur applyInvoiceToStock :", error);
        return res.status(500).json({ message: "Erreur mise à jour stock." });
    }
});

router.post("/:id/apply-to-stock", async (req, res) => {
    try {
        const { id } = req.params;

        await applyInvoiceToStockByIngredient(id);

        await PurchaseInvoice.update(
        { status: "applied_to_stock" },
        { where: { id } },
        );

        return res.json({
        message: "Stock ingrédients mis à jour à partir de la facture.",
        });
    } catch (error) {
        console.error("Erreur lors de l’application facture → stock :", error);
        return res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour du stock." });
    }
});




export default router;
