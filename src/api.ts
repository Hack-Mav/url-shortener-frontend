import axios from "axios";
import { URLShortenResponse, URLHistoryItem, APIResponse } from "./types";
import { env } from "./utils/envValidator";
import { generateCSRFToken, enforceHTTPS, parseRateLimitHeaders, SECURITY_HEADERS } from "./utils/security";

// Enforce HTTPS for all API calls
const enforcedBaseURL = enforceHTTPS(env.REACT_APP_BASE_URL_FOR_URL_SHORTENER);

/**
 * Axios instance configured with base URL, security headers, and interceptors
 * Includes CSRF protection, HTTPS enforcement, and rate limiting detection
 */
const api = axios.create({
  baseURL: enforcedBaseURL,
    headers: {
        "Content-Type": "application/json",
        ...SECURITY_HEADERS,
    },
});

// Add request interceptor for CSRF protection
api.interceptors.request.use((config) => {
  const csrfToken = generateCSRFToken();
  config.headers['X-CSRF-Token'] = csrfToken;
  
  // Ensure request uses HTTPS
  if (config.url && !config.url.startsWith('http')) {
    config.url = enforceHTTPS(config.url);
  }
  
  return config;
});

// Add response interceptor for rate limiting and security
api.interceptors.response.use(
  (response) => {
    // Store rate limit info for UI components
    const rateLimitStatus = parseRateLimitHeaders(response.headers);
    if (rateLimitStatus.isRateLimited) {
      response.data.rateLimit = rateLimitStatus;
    }
    return response;
  },
  (error) => {
    // Handle rate limiting errors
    if (error.response?.status === 429) {
      const rateLimitStatus = parseRateLimitHeaders(error.response.headers);
      error.rateLimit = rateLimitStatus;
    }
    return Promise.reject(error);
  }
);

/**
 * Shortens a URL with optional expiration date
 * @param longUrl - The original URL to shorten
 * @param expirationDate - Optional expiration date for the short URL
 * @returns Promise resolving to the API response with shortened URL data
 */
export const shortenURL = (longUrl: string, expirationDate?: string) => {
  return api.post<APIResponse<URLShortenResponse>>("/shorten", { long_url: longUrl, expiry_date: expirationDate });
};

/**
 * Retrieves paginated URL history
 * @param page - Page number (default: 1)
 * @param limit - Number of items per page (default: 10)
 * @returns Promise resolving to the API response with URL history data
 */
export const shortenURLHistory = (page: number = 1, limit: number = 10) => {
  return api.post<APIResponse<URLHistoryItem[]>>("/history", { page, limit });
};

/**
 * Retrieves analytics data for a specific short URL
 * @param shortId - The short ID of the URL to get analytics for
 * @returns Promise resolving to the API response with analytics data
 */
export const getURLAnalytics = (shortId: string) => {
  return api.get<APIResponse<any>>(`/analytics/${shortId}`);
};

/**
 * Shortens multiple URLs in bulk with optional expiration date
 * @param urls - Array of URLs to shorten
 * @param expirationDate - Optional expiration date for all short URLs
 * @returns Promise resolving to the API response with array of shortened URL data
 */
export const bulkShortenURLs = (urls: string[], expirationDate?: string) => {
  return api.post<APIResponse<URLShortenResponse[]>>("/bulk-shorten", { urls, expiry_date: expirationDate });
};

/**
 * Shortens a URL with a custom alias and optional expiration date
 * @param longUrl - The original URL to shorten
 * @param alias - Custom alias for the short URL
 * @param expirationDate - Optional expiration date for the short URL
 * @returns Promise resolving to the API response with shortened URL data
 */
export const shortenURLWithAlias = (longUrl: string, alias: string, expirationDate?: string) => {
  return api.post<APIResponse<URLShortenResponse>>("/shorten", { long_url: longUrl, custom_alias: alias, expiry_date: expirationDate });
};
