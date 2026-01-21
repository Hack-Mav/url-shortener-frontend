import { useState, useEffect, useCallback } from 'react';
import { shortenURLHistory } from '../api';
import { URLHistoryItem } from '../types';
import cache from '../utils/cache';
import { useInfiniteScroll } from './useInfiniteScroll';

const CACHE_KEY_PREFIX = 'url_history_page_';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface UseURLHistoryInfiniteReturn {
  history: URLHistoryItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasMore: boolean;
  isInitialLoad: boolean;
  refresh: () => void;
  loadMore: () => void;
  changeItemsPerPage: (newLimit: number) => void;
  clearCache: () => void;
  getCacheStats: () => any;
  loadMoreRef: React.RefObject<HTMLDivElement>
}

export const useURLHistoryInfinite = (initialItemsPerPage: number = 10): UseURLHistoryInfiniteReturn => {
  const [history, setHistory] = useState<URLHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialItemsPerPage);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  const fetchHistory = useCallback(async (page: number = 1, limit: number = itemsPerPage, forceRefresh: boolean = false, append: boolean = false): Promise<void> => {
    const cacheKey = `${CACHE_KEY_PREFIX}${page}_${limit}`;
    
    // Try to get from cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        const newHistory = cachedData.data || [];
        setHistory(prev => append ? [...prev, ...newHistory] : newHistory);
        setTotalPages(cachedData.totalPages || 1);
        setTotalItems(cachedData.totalItems || 0);
        setCurrentPage(page);
        setHasMore(page < (cachedData.totalPages || 1));
        setLoading(false);
        setError(null);
        setIsInitialLoad(false);
        return;
      }
    }

    if (!append) {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await shortenURLHistory(page, limit);
      
      if (response.status !== 200) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const historyData = (response.data.data || response.data) as any;
      const newHistory = (historyData.data || historyData) as URLHistoryItem[];
      
      setHistory(prev => append ? [...prev, ...newHistory] : newHistory);
      setTotalPages(historyData.totalPages || 1);
      setTotalItems(historyData.totalItems || 0);
      setCurrentPage(page);
      setHasMore(page < (historyData.totalPages || 1));
      
      // Cache response
      cache.set(cacheKey, historyData, CACHE_TTL);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch history';
      setError(errorMessage);
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const loadMore = useCallback((): void => {
    if (hasMore && !loading) {
      const nextPage = currentPage + 1;
      fetchHistory(nextPage, itemsPerPage, false, true);
    }
  }, [currentPage, hasMore, loading, itemsPerPage, fetchHistory]);

  const refresh = (): void => {
    // Clear cache and reload from page 1
    for (let i = 1; i <= totalPages; i++) {
      cache.delete(`${CACHE_KEY_PREFIX}${i}_${itemsPerPage}`);
    }
    fetchHistory(1, itemsPerPage, true, false);
  };

  const changeItemsPerPage = (newLimit: number): void => {
    // Clear existing cache and reset
    for (let i = 1; i <= totalPages; i++) {
      cache.delete(`${CACHE_KEY_PREFIX}${i}_${itemsPerPage}`);
    }
    setItemsPerPage(newLimit);
    fetchHistory(1, newLimit, true, false);
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

  // Setup infinite scroll
  const loadMoreRef = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore
  });

  return {
    history,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasMore,
    isInitialLoad,
    refresh,
    loadMore,
    changeItemsPerPage,
    clearCache,
    getCacheStats,
    loadMoreRef
  };
};
