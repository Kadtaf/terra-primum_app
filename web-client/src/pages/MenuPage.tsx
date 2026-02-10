import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Search } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  image?: string;
  allergens?: string[];
}
console.log("API_URL =", API_URL);
axios.get(`${API_URL}/products`)
  .then(res => console.log("TEST produits:", res.data))
  .catch(err => console.error("TEST erreur produits:", err));

console.log("Bonjour TOTO===================");

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = selectedCategory ? { category: selectedCategory } : {};
      const response = await axios.get(`${API_URL}/products`, { params });
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur récupération produits:', err);
      setError('Erreur lors du chargement du menu');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/categories/list`);
      setCategories(response.data);
    } catch (err) {
      console.error('Erreur récupération catégories:', err);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-4">Notre Menu</h1>
        <p className="text-lg text-muted-foreground">
          Découvrez nos délicieux plats préparés avec des produits frais et locaux
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un plat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-lg transition ${
              selectedCategory === ''
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Tous
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement du menu...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun produit trouvé</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {product.description}
                </p>
                {product.allergens && product.allergens.length > 0 && (
                  <p className="text-xs text-muted-foreground mb-3">
                    Allergènes: {product.allergens.join(', ')}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">
                    {Number(product.price).toFixed(2)}€
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 transition"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
