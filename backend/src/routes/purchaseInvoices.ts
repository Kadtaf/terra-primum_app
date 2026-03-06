import pdf from "pdf-poppler";
import fs from "fs";
import { Router, Request, Response, raw } from "express";
import Supplier from "../models/supplier";
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


const convertPdfToImage = async (pdfPath: string): Promise<string> => {
    const outputDir = path.dirname(pdfPath);
    const outputPrefix = "page";

    const options = {
        format: "jpeg",
        out_dir: outputDir,
        out_prefix: outputPrefix,
        page: 1, // première page
    };

    await pdf.convert(pdfPath, options);

    const imagePath = path.join(outputDir, `${outputPrefix}-1.jpg`);
    return imagePath;
};

router.post("/ocr", async (req: Request, res: Response) => {
        try {
            const { fileUrl, supplierId } = req.body;
        
            if (!fileUrl) {
                return res.status(400).json({ message: "fileUrl manquant" });
            }
        
            // Chemin absolu du fichier uploadé
            const absolutePath = path.join(__dirname, "../../", fileUrl);
        
            if (!fs.existsSync(absolutePath)) {
                return res.status(404).json({ message: "Fichier introuvable" });
            }
        
            let imagePath = absolutePath;
        
            // Si c'est un PDF → conversion en image
            if (absolutePath.toLowerCase().endsWith(".pdf")) {
                console.log("Conversion PDF → image...");
                imagePath = await convertPdfToImage(absolutePath);
                console.log("Image générée :", imagePath);
            }
        
            // 1. OCR sur l'image
            const result = await Tesseract.recognize(imagePath, "fra", {
                logger: (m) => console.log(m),
            });
        
            // 2. Nettoyage du texte OCR
            const cleaned = cleanOcrText(result.data.text);
        
            // 3. Détection automatique du fournisseur (si non fourni)
            let finalSupplierId: string | null = supplierId ?? null;
        
            if (!finalSupplierId) {
                const detectedId = await detectSupplierFromOcr(cleaned);
        
                if (detectedId) {
                finalSupplierId = detectedId;
                } else {
                const supplier = await Supplier.create({
                    name: "Fournisseur inconnu",
                });
                finalSupplierId = supplier.id; // string
                }
            }
        
            // 4. Parsing universel
            const parsed = parseOcrInvoice(cleaned);
        
            // 5. Création de la facture
            const invoice = await PurchaseInvoice.create({
                supplierId: finalSupplierId,               // string (UUID)
                invoiceNumber: `OCR-${Date.now()}`,
                invoiceDate: new Date(),                  // DATEONLY, Sequelize fera le cast
                totalHt: parsed.totals.totalHt,
                totalTtc: parsed.totals.totalTtc,
                rawFileUrl: fileUrl,
            });
        
            // 6. Création des lignes
            const createdLines = await Promise.all(
                parsed.lines.map((line) =>
                PurchaseInvoiceLine.create({
                    invoiceId: invoice.id,                       // string (UUID)
                    productNameRaw: line.label.substring(0, 255),
                    quantity: line.quantity ?? 1,                // fallback quantité
                    unit: "unité",
                    unitPriceHt: line.unitPrice,
                    totalPriceHt: line.total,
                    vatRate: 20,
                })
                )
            );

            // 7. Appliquer les entrées au stock (si des lignes ont productId)
            await applyInvoiceToStock(invoice.id);
        
            // 8. Réponse API
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






export default router;
