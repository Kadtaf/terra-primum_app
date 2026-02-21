import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Product } from "@/types/Product";
import { getPaginatedProducts } from "@/services/productService";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import Pagination from "@/components/ui/Pagination";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function MenuManagement() {
  const token = useAuthStore.getState().token;

  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PAGINATION
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      // Appel pagination PRO
      const data = await getPaginatedProducts(page, pageSize);

      setProducts(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error("Erreur lors de la récupération des produits:", err);
      setError("Impossible de charger les produits.");
    } finally {
      setLoading(false);
    }
  }, [token, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Fil d'Ariane */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion du Menu</h1>

        <button
          onClick={() => setEditingProduct(null)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter un produit
        </button>
      </div>

      {/* Formulaire de création / édition */}
      <ProductForm
        product={editingProduct}
        onSuccess={() => {
          setEditingProduct(null);
          fetchProducts();
        }}
        onCancel={() => setEditingProduct(null)}
      />

      {/* Liste des produits */}
      <ProductList
        products={products}
        onEdit={(p) => setEditingProduct(p)}
        onChange={fetchProducts}
      />

      {/* PAGINATION iOS PREMIUM */}
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onChange={setPage}
      />
    </div>
  );
}
