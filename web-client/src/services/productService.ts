import adminAxios from "@/api/adminAxios";
import { Product } from "@/types/Product";

// Récupérer tous les produits
export async function getAllProducts(): Promise<Product[]> {
    const response = await adminAxios.get("/admin/products");
    return response.data.data;
}

// Créer un produit
export async function createProduct(payload: Partial<Product>): Promise<Product> {
    const response = await adminAxios.post("/admin/products", payload);
    return response.data.data;
}

// Mettre à jour un produit
export async function updateProduct(
    id: string,
    payload: Partial<Product>
    ): Promise<Product> {
    const response = await adminAxios.put(`/admin/products/${id}`, payload);
    return response.data.data;
}

// Supprimer un produit
export async function deleteProduct(id: string): Promise<void> {
    await adminAxios.delete(`/admin/products/${id}`);
}

// Récupérer les produits avec pagination (admin + public)
export async function getPaginatedProducts(page: number, pageSize: number) {
    const response = await adminAxios.get("/products/paginated", {
        params: { page, pageSize }
    });
    return response.data; // { items, total, page, pageSize }
}