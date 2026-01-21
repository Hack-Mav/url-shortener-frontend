import { useState } from 'react';
import { bulkShortenURLs } from '../api';
import { URLShortenResponse } from '../types';

/**
 * Interface for the return value of useBulkShortenURL hook
 */
interface UseBulkShortenURLReturn {
  /** Array of bulk shortening results */
  results: URLShortenResponse[];
  /** Loading state during API call */
  loading: boolean;
  /** Error message if API call fails */
  error: string | null;
  /** Function to shorten multiple URLs */
  bulkShorten: (urls: string[], expirationDate?: string) => Promise<void>;
  /** Function to reset the hook state */
  reset: () => void;
}

/**
 * Custom hook for handling bulk URL shortening functionality
 * Provides state management for shortening multiple URLs simultaneously
 * @returns {UseBulkShortenURLReturn} Object containing results, loading state, error, and control functions
 */
export const useBulkShortenURL = (): UseBulkShortenURLReturn => {
  const [results, setResults] = useState<URLShortenResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Shortens multiple URLs in bulk with optional expiration date
   * @param urls - Array of URLs to shorten
   * @param expirationDate - Optional expiration date for all short URLs
   */
  const bulkShorten = async (urls: string[], expirationDate?: string): Promise<void> => {
    if (!urls || urls.length === 0) {
      setError('Please provide at least one URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await bulkShortenURLs(urls, expirationDate);
      const results = response.data.data || response.data.results || response.data;
      setResults(Array.isArray(results) ? results : []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to shorten URLs';
      setError(errorMessage);
      console.error('Error bulk shortening URLs:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets the hook state to initial values
   */
  const reset = (): void => {
    setResults([]);
    setError(null);
    setLoading(false);
  };

  return {
    results,
    loading,
    error,
    bulkShorten,
    reset
  };
};
