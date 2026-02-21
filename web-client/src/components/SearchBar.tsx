import React, { useState, useCallback } from "react";
import { Search, Filter, X } from "lucide-react";
import { useSearch } from "../hooks/useSearch";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  categories?: string[];
}

export default function SearchBar({ onSearch, categories = [] }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { search, loading } = useSearch();

  const handleSearch = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      const min = minPrice ? Math.max(0, parseFloat(minPrice)) : undefined;
      const max = maxPrice ? Math.max(0, parseFloat(maxPrice)) : undefined;

      await search({
        query,
        category: selectedCategory || undefined,
        minPrice: min,
        maxPrice: max,
      });

      onSearch?.(query);
    },
    [query, selectedCategory, minPrice, maxPrice, search, onSearch]
  );

  const handleClear = () => {
    setQuery("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setShowFilters(false);
  };

  return (
    <div className="w-full">
      {/* Barre de recherche */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Rechercher des plats..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-muted" />
        </div>

        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="btn btn-secondary flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtres
        </button>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Recherche..." : "Chercher"}
        </button>

        {(query || selectedCategory || minPrice || maxPrice) && (
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-secondary flex items-center gap-2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Filtres */}
      {showFilters && (
        <div className="card mb-4 p-4 animate-fadeIn">
          <h3 className="font-bold mb-4">Filtres</h3>

          {categories.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Catégorie</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Prix min (€)</label>
              <input
                type="number"
                min="0"
                step="0.50"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Prix max (€)</label>
              <input
                type="number"
                min="0"
                step="0.50"
                placeholder="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="flex-1 btn btn-primary"
            >
              Appliquer les filtres
            </button>

            <button
              onClick={() => setShowFilters(false)}
              className="flex-1 btn btn-secondary"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}