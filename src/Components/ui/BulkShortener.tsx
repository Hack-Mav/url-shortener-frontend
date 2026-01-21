import React, { useState, FormEvent } from 'react';
import { useBulkShortenURL } from '../../hooks/useBulkShortenURL';
import { useRateLimit } from '../../hooks/useRateLimit';
import toast from 'react-hot-toast';
import { getUrlValidationError, getSecureUrl } from '../../utils/urlValidator';
import CopyButton from './CopyButton';
import QRCodeGenerator from './QRCodeGenerator';
import RateLimitAlert from './RateLimitAlert';

interface BulkShortenerResult {
  original_url?: string;
  longUrl?: string;
  short_url?: string;
  shortUrl?: string;
  status?: string;
}

interface ShowQRCodeState {
  [key: number]: boolean;
}

const BulkShortener: React.FC = () => {
  const [urls, setUrls] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [showQRCode, setShowQRCode] = useState<ShowQRCodeState>({});
  const { results, loading, error, bulkShorten, reset } = useBulkShortenURL();
  const { isRateLimited, timeRemaining, updateRateLimit } = useRateLimit();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Check rate limiting first
    if (isRateLimited) {
      toast.error(`Rate limit exceeded. Try again in ${timeRemaining}s`);
      return;
    }
    
    const urlList = urls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urlList.length === 0) {
      toast.error('Please enter at least one URL');
      return;
    }

    // Validate each URL
    const validationErrors: string[] = [];
    urlList.forEach((url, index) => {
      const validationError = getUrlValidationError(url);
      if (validationError) {
        validationErrors.push(`Line ${index + 1}: ${validationError}`);
      }
    });

    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    try {
      // Use sanitized URLs
      const secureUrls = urlList.map(url => getSecureUrl(url));
      await bulkShorten(secureUrls, expirationDate);
      toast.success(`Successfully shortened ${urlList.length} URLs!`);
    } catch (err: any) {
      // Handle rate limiting from API response
      if (err?.rateLimit) {
        updateRateLimit(err.rateLimit);
        toast.error(`Rate limit exceeded. Try again in ${timeRemaining}s`);
      } else {
        toast.error(error || 'Failed to shorten URLs');
      }
    }
  };

  const handleReset = (): void => {
    setUrls('');
    setExpirationDate('');
    reset();
    setShowQRCode({});
    toast('Ready to shorten more URLs');
  };

  const toggleQRCode = (index: number): void => {
    setShowQRCode(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const exportResults = (): void => {
    const csvContent = [
      ['Original URL', 'Short URL', 'Status'],
      ...results.map((result: BulkShortenerResult) => [
        result.original_url || result.longUrl || '',
        result.short_url || result.shortUrl || '',
        result.status || 'success'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-shortened-urls-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Bulk URL Shortener
        </h2>

        {/* Rate Limit Alert */}
        {isRateLimited && (
          <div className="mb-6">
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

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="urls" className="block text-sm font-medium text-gray-700 mb-2">
              Enter URLs (one per line)
              <span className="text-red-500" aria-label="required"> *</span>
            </label>
            <textarea
              id="urls"
              rows={6}
              placeholder="https://example.com/very-long-url-1&#10;https://example.com/very-long-url-2&#10;https://example.com/very-long-url-3"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              required
              aria-required="true"
              aria-describedby="urls-help"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-sm"
              disabled={loading}
              autoComplete="off"
            />
            <p id="urls-help" className="text-xs text-gray-500 mt-1">
              Enter each URL on a new line. Maximum 50 URLs per batch.
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={loading}
              min={new Date().toISOString().split('T')[0]}
              autoComplete="off"
            />
            <p id="expiration-help" className="text-xs text-gray-500 mt-1">
              The URLs will expire on this date. Leave blank for no expiration.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-describedby={loading ? 'submit-status' : undefined}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span id="submit-status">Shortening URLs...</span>
              </span>
            ) : (
              'Shorten All URLs'
            )}
          </button>
        </form>

        {results.length > 0 && (
          <div className="mt-8" role="region" aria-label="Bulk shortening results">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Results ({results.length} URLs)
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={exportResults}
                  className="text-sm bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  aria-label="Export results as CSV file"
                >
                  Export CSV
                </button>
                <button
                  onClick={handleReset}
                  className="text-sm bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  aria-label="Start new bulk shortening batch"
                >
                  Start New Batch
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto" role="list">
              {results.map((result: BulkShortenerResult, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4" role="listitem">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-semibold text-gray-600">Original URL:</span>
                      <div className="mt-1">
                        <a
                          href={result.original_url || result.longUrl || ''}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 break-all text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                          aria-label={`Open original URL in new tab: ${result.original_url || result.longUrl}`}
                        >
                          {result.original_url || result.longUrl}
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-semibold text-gray-600">Shortened URL:</span>
                      <div className="mt-1 flex items-center gap-2">
                        <a
                          href={result.short_url || result.shortUrl || ''}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 font-mono text-sm break-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
                          aria-label={`Open shortened URL in new tab: ${result.short_url || result.shortUrl}`}
                        >
                          {result.short_url || result.shortUrl}
                        </a>
                        <CopyButton 
                          text={result.short_url || result.shortUrl || ''}
                          aria-label={`Copy shortened URL to clipboard: ${result.short_url || result.shortUrl}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </CopyButton>
                        <button
                          onClick={() => toggleQRCode(index)}
                          className="text-blue-600 hover:text-blue-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1 py-0.5"
                          aria-expanded={showQRCode[index] ? 'true' : 'false'}
                          aria-controls={`qr-code-${index}`}
                        >
                          {showQRCode[index] ? 'Hide QR' : 'Show QR'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {showQRCode[index] && (
                    <div id={`qr-code-${index}`} className="mt-3 pt-3 border-t border-gray-100">
                      <div role="img" aria-label={`QR code for ${result.short_url || result.shortUrl}`}>
                        <QRCodeGenerator url={result.short_url || result.shortUrl || ''} size={100} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkShortener;
