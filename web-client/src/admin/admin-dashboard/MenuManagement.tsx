import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Product } from "@/types/Product";
import { getAllProducts } from "@/data/productService";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";

export default function MenuManagement() {
  const token = useAuthStore.getState().token;
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getAllProducts(token);
      setProducts(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion du Menu</h1>
      </div>

      <ProductForm
        product={editingProduct}
        onSuccess={() => {
          setEditingProduct(null);
          fetchProducts();
        }}
        onCancel={() => setEditingProduct(null)}
      />

      <ProductList
        products={products}
        onEdit={(p) => setEditingProduct(p)}
        onChange={fetchProducts}
      />
    </div>
  );
}