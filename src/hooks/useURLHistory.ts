import { useState, useEffect, useCallback } from 'react';
import { shortenURLHistory } from '../api';
import { URLHistoryItem } from '../types';
import cache from '../utils/cache';
import { performanceMonitor } from '../utils/performance';

const CACHE_KEY_PREFIX = 'url_history_page_';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface UseURLHistoryReturn {
  history: URLHistoryItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  refresh: () => void;
  goToPage: (page: number) => void;
  changeItemsPerPage: (newLimit: number) => void;
  clearCache: () => void;
  getCacheStats: () => any;
}

export const useURLHistory = (): UseURLHistoryReturn => {
  const [history, setHistory] = useState<URLHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const fetchHistory = useCallback(async (page: number = currentPage, limit: number = itemsPerPage, forceRefresh: boolean = false): Promise<void> => {
    const cacheKey = `${CACHE_KEY_PREFIX}${page}_${limit}`;
    
    // Try to get from cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        performanceMonitor.logCacheStats(cache.getStats());
        setHistory(cachedData.data || []);
        setTotalPages(cachedData.totalPages || 1);
        setTotalItems(cachedData.totalItems || 0);
        setCurrentPage(page);
        setLoading(false);
        setError(null);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await performanceMonitor.measureApiCall(
        `History Page ${page}`,
        () => shortenURLHistory(page, limit)
      );
      
      if (response.status !== 200) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const historyData = (response.data as any).data || response.data;
      setHistory(historyData.data || historyData || []);
      setTotalPages(historyData.totalPages || 1);
      setTotalItems(historyData.totalItems || 0);
      setCurrentPage(page);
      setItemsPerPage(limit);
      
      // Cache the response
      cache.set(cacheKey, historyData, CACHE_TTL);
      performanceMonitor.logCacheStats(cache.getStats());
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch history';
      setError(errorMessage);
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const refresh = (): void => {
    fetchHistory(currentPage, itemsPerPage, true); // Force refresh current page
  };

  const goToPage = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      fetchHistory(page, itemsPerPage);
    }
  };

  const changeItemsPerPage = (newLimit: number): void => {
    fetchHistory(1, newLimit); // Reset to first page with new limit
  };

  // Clear cache utility function
  const clearCache = (): void => {
    // Clear all paginated cache entries
    for (let i = 1; i <= totalPages; i++) {
      cache.delete(`${CACHE_KEY_PREFIX}${i}_${itemsPerPage}`);
    }
  };

  // Get cache stats
  const getCacheStats = (): any => {
    return cache.getStats();
  };

  return {
    history,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    refresh,
    goToPage,
    changeItemsPerPage,
    clearCache,
    getCacheStats
  };
};
