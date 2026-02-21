import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import adminAxios from "@/api/adminAxios";

interface SearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface SearchResult {
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

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

      if (params.query) queryParams.append("search", params.query);
      if (params.category) queryParams.append("category", params.category);

      if (params.minPrice !== undefined)
        queryParams.append("minPrice", params.minPrice.toString());

      if (params.maxPrice !== undefined)
        queryParams.append("maxPrice", params.maxPrice.toString());

      queryParams.append("page", (params.page || 1).toString());
      queryParams.append("limit", (params.limit || 10).toString());

      const response = await adminAxios.get<SearchResponse>(
        `${API_URL}/products?${queryParams.toString()}`
      );

      if (response.data.success) {
        setResults(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError("Erreur lors de la recherche");
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data?.error || "Erreur lors de la recherche");
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