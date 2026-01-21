import React from 'react';
import { useURLAnalytics } from '../../hooks/useURLAnalytics';

interface AnalyticsProps {
  shortId: string;
  baseUrl?: string;
}

interface AnalyticsData {
  totalClicks: number;
  uniqueClicks: number;
  todayClicks: number;
  avgClicksPerDay: number;
  lastClickDate?: string;
  topReferrers?: Array<{
    source: string;
    count: number;
  }>;
}

const Analytics: React.FC<AnalyticsProps> = ({ shortId, baseUrl }) => {
  const { analytics, loading, error } = useURLAnalytics(shortId);

  if (loading) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-sm">Analytics unavailable: {error}</p>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num || 0);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const analyticsData = analytics as AnalyticsData;

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 className="text-sm font-semibold text-blue-800 mb-3">URL Analytics</h4>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatNumber(analyticsData.totalClicks)}
          </div>
          <div className="text-xs text-gray-600">Total Clicks</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {formatNumber(analyticsData.uniqueClicks)}
          </div>
          <div className="text-xs text-gray-600">Unique Clicks</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {formatNumber(analyticsData.todayClicks)}
          </div>
          <div className="text-xs text-gray-600">Today's Clicks</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {formatNumber(analyticsData.avgClicksPerDay)}
          </div>
          <div className="text-xs text-gray-600">Avg/Day</div>
        </div>
      </div>

      {analyticsData.lastClickDate && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-xs text-gray-600">
            <span className="font-medium">Last clicked:</span>{' '}
            {formatDate(analyticsData.lastClickDate)}
          </p>
        </div>
      )}

      {analyticsData.topReferrers && analyticsData.topReferrers.length > 0 && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-xs font-medium text-gray-700 mb-2">Top Referrers:</p>
          <div className="space-y-1">
            {analyticsData.topReferrers.slice(0, 3).map((referrer, index: number) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-gray-600 truncate mr-2">
                  {referrer.source || 'Direct'}
                </span>
                <span className="font-medium text-gray-800">
                  {formatNumber(referrer.count)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
