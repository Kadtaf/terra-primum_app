import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

interface SearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

interface SearchResult {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface SearchResponse {
  success: boolean;
  data: SearchResult[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  const search = useCallback(async (params: SearchParams) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (params.query) queryParams.append('search', params.query);
      if (params.category) queryParams.append('category', params.category);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await axios.get<SearchResponse>(
        `/api/products?${queryParams.toString()}`
      );

      if (response.data.success) {
        setResults(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError('Erreur lors de la recherche');
      }
    } catch (err) {
      setError('Erreur lors de la recherche');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults([]);
    setError(null);
    setPagination({
      total: 0,
      page: 1,
      limit: 10,
      pages: 0,
    });
  }, []);

  return {
    results,
    loading,
    error,
    pagination,
    search,
    reset,
  };
}
