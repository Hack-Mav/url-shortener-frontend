// Security utilities for CSRF protection, XSS prevention, and HTTPS enforcement

/**
 * Generates a CSRF token if one doesn't exist in session storage
 */
export const generateCSRFToken = (): string => {
  const token = sessionStorage.getItem('csrf-token');
  if (token) {
    return token;
  }
  
  const newToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  sessionStorage.setItem('csrf-token', newToken);
  return newToken;
};

/**
 * Validates CSRF token from request headers
 */
export const validateCSRFToken = (receivedToken: string): boolean => {
  const storedToken = sessionStorage.getItem('csrf-token');
  return storedToken === receivedToken;
};

/**
 * Sanitizes input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .trim();
};

/**
 * Sanitizes URL input while preserving valid URL structure
 */
export const sanitizeURL = (url: string): string => {
  if (typeof url !== 'string') {
    return '';
  }
  
  try {
    // Basic URL validation and sanitization
    const sanitized = sanitizeInput(url);
    
    // Ensure URL has a protocol
    if (!sanitized.match(/^https?:\/\//) && !sanitized.startsWith('/')) {
      return `https://${sanitized}`;
    }
    
    return sanitized;
  } catch {
    return '';
  }
};

/**
 * Enforces HTTPS by converting HTTP URLs to HTTPS
 */
export const enforceHTTPS = (url: string): string => {
  if (typeof url !== 'string') {
    return '';
  }
  
  try {
    const urlObj = new URL(url);
    if (urlObj.protocol === 'http:') {
      urlObj.protocol = 'https:';
    }
    return urlObj.toString();
  } catch {
    // If URL parsing fails, try simple string replacement
    return url.replace(/^http:/, 'https:');
  }
};

/**
 * Validates that a URL uses HTTPS
 */
export const isHTTPS = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Rate limiting status interface
 */
export interface RateLimitStatus {
  isRateLimited: boolean;
  remainingRequests?: number;
  resetTime?: number;
  retryAfter?: number;
}

/**
 * Parses rate limit headers from API response
 */
export const parseRateLimitHeaders = (headers: any): RateLimitStatus => {
  const status: RateLimitStatus = {
    isRateLimited: false
  };
  
  if (headers['x-ratelimit-remaining']) {
    status.remainingRequests = parseInt(headers['x-ratelimit-remaining'], 10);
  }
  
  if (headers['x-ratelimit-reset']) {
    status.resetTime = parseInt(headers['x-ratelimit-reset'], 10);
  }
  
  if (headers['retry-after']) {
    status.retryAfter = parseInt(headers['retry-after'], 10);
    status.isRateLimited = true;
  }
  
  if (status.remainingRequests !== undefined && status.remainingRequests <= 0) {
    status.isRateLimited = true;
  }
  
  return status;
};

/**
 * Security headers configuration
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self';"
};

/**
 * Content Security Policy meta tag for HTML head
 */
export const CSP_META_TAG = `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self';">`;
