import React from 'react';
import { AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { RateLimitStatus } from '../../utils/security';

interface RateLimitAlertProps {
  rateLimit: RateLimitStatus;
  onRetry?: () => void;
  className?: string;
}

const RateLimitAlert: React.FC<RateLimitAlertProps> = ({ 
  rateLimit, 
  onRetry, 
  className = '' 
}) => {
  if (!rateLimit.isRateLimited) {
    return null;
  }

  const formatTimeRemaining = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const getTimeRemaining = (): number => {
    if (rateLimit.resetTime) {
      return Math.max(0, rateLimit.resetTime - Math.floor(Date.now() / 1000));
    }
    if (rateLimit.retryAfter) {
      return rateLimit.retryAfter;
    }
    return 0;
  };

  const timeRemaining = getTimeRemaining();

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Rate Limit Exceeded
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              You've reached the maximum number of requests. Please wait before trying again.
            </p>
            
            {timeRemaining > 0 && (
              <div className="mt-2 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  Try again in <strong>{formatTimeRemaining(timeRemaining)}</strong>
                </span>
              </div>
            )}
            
            {rateLimit.remainingRequests !== undefined && (
              <p className="mt-1">
                Remaining requests: <strong>{rateLimit.remainingRequests}</strong>
              </p>
            )}
          </div>
          
          {onRetry && timeRemaining === 0 && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-3 py-1.5 border border-yellow-300 text-sm font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RateLimitAlert;
