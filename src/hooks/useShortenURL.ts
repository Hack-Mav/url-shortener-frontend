import { useState } from 'react';
import { shortenURL, shortenURLWithAlias } from '../api';
import { URLShortenResponse } from '../types';

/**
 * Interface for the return value of useShortenURL hook
 */
interface UseShortenURLReturn {
  /** The shortened URL result */
  shortUrl: string;
  /** Loading state during API call */
  loading: boolean;
  /** Error message if API call fails */
  error: string | null;
  /** Function to shorten a URL */
  shortenUrl: (longUrl: string, expirationDate?: string, alias?: string | null) => Promise<void>;
  /** Function to reset the hook state */
  reset: () => void;
}

/**
 * Custom hook for handling URL shortening functionality
 * Provides state management for shortening URLs with optional aliases and expiration dates
 * @returns {UseShortenURLReturn} Object containing shortened URL, loading state, error, and control functions
 */
export const useShortenURL = (): UseShortenURLReturn => {
  const [shortUrl, setShortUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Shortens a URL with optional alias and expiration date
   * @param longUrl - The original URL to shorten
   * @param expirationDate - Optional expiration date for the short URL
   * @param alias - Optional custom alias for the short URL
   */
  const shortenUrl = async (longUrl: string, expirationDate?: string, alias: string | null = null): Promise<void> => {
    if (!longUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = alias 
        ? await shortenURLWithAlias(longUrl, alias, expirationDate)
        : await shortenURL(longUrl, expirationDate);
      setShortUrl(response.data.data?.shortUrl || (response.data as any).short_url);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to shorten URL';
      setError(errorMessage);
      console.error('Error shortening URL:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets the hook state to initial values
   */
  const reset = (): void => {
    setShortUrl('');
    setError(null);
    setLoading(false);
  };

  return {
    shortUrl,
    loading,
    error,
    shortenUrl,
    reset
  };
};
