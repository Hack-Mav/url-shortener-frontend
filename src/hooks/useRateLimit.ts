import { useState, useEffect } from 'react';
import { RateLimitStatus } from '../utils/security';

interface UseRateLimitReturn {
  rateLimit: RateLimitStatus | null;
  isRateLimited: boolean;
  timeRemaining: number;
  updateRateLimit: (status: RateLimitStatus) => void;
  clearRateLimit: () => void;
}

export const useRateLimit = (): UseRateLimitReturn => {
  const [rateLimit, setRateLimit] = useState<RateLimitStatus | null>(null);

  const updateRateLimit = (status: RateLimitStatus) => {
    setRateLimit(status);
  };

  const clearRateLimit = () => {
    setRateLimit(null);
  };

  const getTimeRemaining = (): number => {
    if (!rateLimit?.isRateLimited) {
      return 0;
    }

    if (rateLimit.resetTime) {
      return Math.max(0, rateLimit.resetTime - Math.floor(Date.now() / 1000));
    }
    
    if (rateLimit.retryAfter) {
      return rateLimit.retryAfter;
    }

    return 0;
  };

  const timeRemaining = getTimeRemaining();

  // Auto-clear rate limit when time expires
  useEffect(() => {
    if (!rateLimit?.isRateLimited || timeRemaining <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      clearRateLimit();
    }, timeRemaining * 1000);

    return () => clearTimeout(timer);
  }, [rateLimit, timeRemaining]);

  return {
    rateLimit,
    isRateLimited: rateLimit?.isRateLimited || false,
    timeRemaining,
    updateRateLimit,
    clearRateLimit,
  };
};
