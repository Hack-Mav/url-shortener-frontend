import React, { useState, FormEvent } from 'react';
import { useShortenURL } from '../../hooks/useShortenURL';
import { useRateLimit } from '../../hooks/useRateLimit';
import toast from 'react-hot-toast';
import { getUrlValidationError, getSecureUrl } from '../../utils/urlValidator';
import { getAliasValidationError, getSanitizedAlias } from '../../utils/aliasValidator';
import CopyButton from './CopyButton';
import QRCodeGenerator from './QRCodeGenerator';
import RateLimitAlert from './RateLimitAlert';

const Shortener: React.FC = () => {
  const [longUrl, setLongUrl] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [customAlias, setCustomAlias] = useState<string>('');
  const { shortUrl, loading, error, shortenUrl, reset } = useShortenURL();
  const { isRateLimited, timeRemaining, updateRateLimit } = useRateLimit();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Check rate limiting first
    if (isRateLimited) {
      toast.error(`Rate limit exceeded. Try again in ${timeRemaining}s`);
      return;
    }
    
    const urlValidationError = getUrlValidationError(longUrl);
    if (urlValidationError) {
      toast.error(urlValidationError);
      return;
    }

    const aliasValidationError = getAliasValidationError(customAlias);
    if (aliasValidationError) {
      toast.error(aliasValidationError);
      return;
    }
    
    try {
      // Use sanitized inputs
      const secureUrl = getSecureUrl(longUrl);
      const sanitizedAlias = getSanitizedAlias(customAlias);
      
      await shortenUrl(secureUrl, expirationDate, sanitizedAlias || null);
      toast.success('URL shortened successfully!');
    } catch (err: any) {
      // Handle rate limiting from API response
      if (err?.rateLimit) {
        updateRateLimit(err.rateLimit);
        toast.error(`Rate limit exceeded. Try again in ${timeRemaining}s`);
      } else {
        toast.error(error || 'Failed to shorten URL');
      }
    }
  };

  const handleReset = (): void => {
    setLongUrl('');
    setExpirationDate('');
    setCustomAlias('');
    reset();
    toast('Ready to create a new short URL');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Shorten Your URL
        </h2>

        {/* Rate Limit Alert */}
        {isRateLimited && (
          <div className="mb-6" role="alert" aria-live="polite">
            <RateLimitAlert 
              rateLimit={{ 
                isRateLimited: true, 
                retryAfter: timeRemaining 
              }}
              onRetry={() => {
                // Clear rate limit and allow retry
                updateRateLimit({ isRateLimited: false });
              }}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Enter long URL
              <span className="text-red-500" aria-label="required"> *</span>
            </label>
            <input
              id="url"
              type="url"
              placeholder="https://example.com/very-long-url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
              aria-required="true"
              aria-describedby="url-help"
              aria-invalid={getUrlValidationError(longUrl) ? 'true' : 'false'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              disabled={loading}
              autoComplete="url"
            />
            <p id="url-help" className="text-xs text-gray-500 mt-2 mb-4">
              Enter a valid URL including http:// or https://
            </p>
          </div>

          <div>
            <label htmlFor="alias" className="block text-sm font-medium text-gray-700 mb-2">
              Custom Alias (optional)
            </label>
            <input
              id="alias"
              type="text"
              placeholder="my-custom-link"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              aria-describedby="alias-help"
              aria-invalid={getAliasValidationError(customAlias) ? 'true' : 'false'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              disabled={loading}
              maxLength={20}
              autoComplete="off"
            />
            <p id="alias-help" className="text-xs text-gray-500 mt-2 mb-4">
              3-20 characters, letters, numbers, hyphens, and underscores only
            </p>
          </div>

          <div>
            <label htmlFor="expiration" className="block text-sm font-medium text-gray-700 mb-2">
              Expiration Date (optional)
            </label>
            <input
              id="expiration"
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              aria-describedby="expiration-help"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              disabled={loading}
              min={new Date().toISOString().split('T')[0]}
              autoComplete="off"
            />
            <p id="expiration-help" className="text-xs text-gray-500 mt-2 mb-4">
              The URL will expire on this date. Leave blank for no expiration.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-describedby={loading ? 'submit-status' : undefined}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span id="submit-status">Shortening...</span>
              </span>
            ) : (
              'Shorten URL'
            )}
          </button>
        </form>

        {shortUrl && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg" role="status" aria-live="polite">
            <p className="text-sm font-medium text-green-800 mb-3">Your shortened URL:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={shortUrl}
                aria-label="Shortened URL"
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 font-mono text-sm"
              />
              <CopyButton 
                text={shortUrl}
                className="flex-1 py-2 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label="Copy shortened URL to clipboard"
              >
                Copy to Clipboard
              </CopyButton>
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Create new shortened URL"
              >
                Create New
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-green-200">
              <p className="text-sm font-medium text-green-800 mb-4 text-center">QR Code for your URL:</p>
              <div role="img" aria-label={`QR code for ${shortUrl}`}>
                <QRCodeGenerator url={shortUrl} size={150} />
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shortener;
