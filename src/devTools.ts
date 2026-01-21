// Development tools and utilities
export const devTools = {
  // Performance monitoring
  measurePerformance: (name: string, fn: () => void) => {
    if (process.env.NODE_ENV === 'development') {
      const start = performance.now();
      fn();
      const end = performance.now();
      console.log(`[Performance] ${name}: ${end - start}ms`);
    } else {
      fn();
    }
  },

  // Component debugging
  logComponentRender: (componentName: string, props?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Component] ${componentName} rendered`, props);
    }
  },

  // API debugging
  logApiCall: (method: string, url: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${method} ${url}`, data);
    }
  },

  // State debugging
  logStateChange: (stateName: string, newState: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[State] ${stateName} changed:`, newState);
    }
  },

  // Error debugging
  logError: (error: Error, context?: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Error] ${context || 'Unknown context'}:`, error);
    }
  },
};

// Development-only hooks
export const useDevTools = () => {
  if (process.env.NODE_ENV !== 'development') {
    return { log: () => {}, warn: () => {}, error: () => {} };
  }

  return {
    log: (...args: any[]) => console.log('[Dev]', ...args),
    warn: (...args: any[]) => console.warn('[Dev]', ...args),
    error: (...args: any[]) => console.error('[Dev]', ...args),
  };
};
