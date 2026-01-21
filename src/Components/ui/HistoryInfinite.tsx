import React, { useState } from 'react';
import { useURLHistoryInfinite } from '../../hooks/useURLHistoryInfinite';
import toast from 'react-hot-toast';
import CopyButton from './CopyButton';
import QRCodeGenerator from './QRCodeGenerator';
import Analytics from './Analytics';
import { env } from '../../utils/envValidator';
import { URLHistoryItem } from '../../types';

interface ShowQRCodeState {
  [key: number]: boolean;
}

interface ShowAnalyticsState {
  [key: number]: boolean;
}

const HistoryInfinite: React.FC = () => {
  const { 
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
    changeItemsPerPage,
    loadMoreRef
  } = useURLHistoryInfinite();
  const [showQRCode, setShowQRCode] = useState<ShowQRCodeState>({});
  const [showAnalytics, setShowAnalytics] = useState<ShowAnalyticsState>({});

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString();
  };

  const toggleQRCode = (index: number): void => {
    setShowQRCode(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleAnalytics = (index: number): void => {
    setShowAnalytics(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (isInitialLoad && loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Shortened URL History
          </h2>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Shortened URL History
          </h2>
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <p className="text-red-800 font-medium">Error: {error}</p>
            </div>
            <button 
              onClick={refresh}
              className="bg-purple-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Shortened URL History
          </h2>
          <div className="flex items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={(e) => changeItemsPerPage(parseInt(e.target.value))}
              disabled={loading}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <button 
              onClick={refresh}
              disabled={loading}
              className="bg-purple-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {history.length > 0 ? (
          <>
            <div className="space-y-4">
              {history.map((entry: URLHistoryItem, index: number) => (
                <div key={`${currentPage}-${index}`} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-semibold text-gray-600">Long URL:</span>
                      <div className="mt-1">
                        <a
                          href={entry.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 break-all"
                        >
                          {entry.originalUrl}
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-semibold text-gray-600">Shortened URL:</span>
                      <div className="mt-1 flex items-center gap-2">
                        <a
                          href={entry.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 font-mono text-sm break-all"
                        >
                          {entry.shortUrl}
                        </a>
                        <CopyButton 
                          text={entry.shortUrl}
                          className="text-gray-500 hover:text-gray-700 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </CopyButton>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500 pt-2 border-t border-gray-100">
                      <div>
                        <span className="font-medium">Created:</span>{' '}
                        {new Date(entry.createdAt).toLocaleString()}
                      </div>
                      {entry.clicks !== undefined && (
                        <div>
                          <span className="font-medium">Clicks:</span>{' '}
                          {entry.clicks}
                        </div>
                      )}
                      <div className="flex gap-3 sm:ml-auto">
                        <button
                          onClick={() => toggleAnalytics(index)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          {showAnalytics[index] ? 'Hide Analytics' : 'Show Analytics'}
                        </button>
                        <button
                          onClick={() => toggleQRCode(index)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          {showQRCode[index] ? 'Hide QR' : 'Show QR'}
                        </button>
                      </div>
                    </div>
                    
                    {showAnalytics[index] && (
                      <Analytics 
                        shortId={entry.alias}
                        baseUrl={env.REACT_APP_BASE_URL_FOR_URL_SHORTENER}
                      />
                    )}
                    
                    {showQRCode[index] && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <QRCodeGenerator 
                          url={entry.shortUrl} 
                          size={120} 
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Loading indicator for infinite scroll */}
            {loading && !isInitialLoad && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <span className="text-sm text-gray-600">Loading more...</span>
                </div>
              </div>
            )}

            {/* Load more trigger */}
            {hasMore && !loading && (
              <div ref={loadMoreRef} className="text-center py-4">
                <div className="text-sm text-gray-500">
                  Showing {history.length} of {totalItems} items
                </div>
              </div>
            )}

            {/* End of results */}
            {!hasMore && (
              <div className="text-center py-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing all {history.length} items
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 text-lg">No history available.</p>
              <p className="text-gray-500 text-sm mt-2">Start shortening URLs to see them here!</p>
            </div>
          </div>
        )}

        {error && history.length > 0 && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryInfinite;
