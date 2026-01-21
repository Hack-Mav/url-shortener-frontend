interface CacheStats {
  total: number;
  valid: number;
  expired: number;
}

interface PerformanceNavigationTiming extends PerformanceEntry {
  loadEventEnd: number;
  loadEventStart: number;
  domContentLoadedEventEnd: number;
  domContentLoadedEventStart: number;
}

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface Window {
  performance: Performance & {
    memory?: PerformanceMemory;
  };
}

interface Navigator {
  connection?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

// Performance monitoring utilities
export const performanceMonitor = {
  // Measure component render time
  measureRender: <T>(componentName: string, fn: () => T): T => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${componentName} render time: ${end - start}ms`);
    return result;
  },

  // Measure API call time
  measureApiCall: async <T>(apiName: string, apiCall: () => Promise<T>): Promise<T> => {
    const start = performance.now();
    try {
      const result = await apiCall();
      const end = performance.now();
      console.log(`${apiName} API call time: ${end - start}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`${apiName} API call failed after ${end - start}ms:`, error);
      throw error;
    }
  },

  // Log cache performance
  logCacheStats: (cacheStats: CacheStats): void => {
    console.log('Cache Performance:', {
      total: cacheStats.total,
      valid: cacheStats.valid,
      expired: cacheStats.expired,
      hitRate: cacheStats.valid > 0 ? ((cacheStats.valid / cacheStats.total) * 100).toFixed(2) + '%' : '0%'
    });
  },

  // Track page load performance
  trackPageLoad: (): void => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        
        console.log('Page Load Performance:', {
          loadTime: `${loadTime}ms`,
          domContentLoaded: `${domContentLoaded}ms`,
          firstContentfulPaint: window.performance.getEntriesByType('paint')[0]?.startTime || 'N/A'
        });
      }
    }
  }
};

// Debounce utility for search and other input events
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memory usage tracker (for development)
export const trackMemoryUsage = (): void => {
  if (typeof window !== 'undefined' && (window as any).performance && (window as any).performance.memory) {
    const memory = (window as any).performance.memory;
    console.log('Memory Usage:', {
      used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
    });
  }
};

// Network connection info
export const getNetworkInfo = (): any => {
  if (typeof window !== 'undefined' && (navigator as any).connection) {
    const connection = (navigator as any).connection;
    console.log('Network Info:', {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt
    });
    return connection;
  }
  return null;
};
