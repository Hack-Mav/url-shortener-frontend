import { useState, useEffect } from 'react';
import { getURLAnalytics } from '../api';

interface UseURLAnalyticsReturn {
  analytics: any;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useURLAnalytics = (shortId: string): UseURLAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (): Promise<void> => {
    if (!shortId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getURLAnalytics(shortId);
      setAnalytics(response.data.data || response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch analytics';
      setError(errorMessage);
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [shortId]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  };
};
