import { sanitizeURL, sanitizeInput } from './security';

export const isValidUrl = (url: unknown): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Sanitize input first
  const sanitizedUrl = sanitizeInput(url.trim());
  if (!sanitizedUrl) {
    return false;
  }

  // Apply URL sanitization for security
  const secureUrl = sanitizeURL(sanitizedUrl);
  if (!secureUrl) {
    return false;
  }

  try {
    const urlObject = new URL(secureUrl);
    
    // Prefer HTTPS over HTTP
    const validProtocols = ['https:', 'http:', 'ftp:', 'ftps:'];
    if (!validProtocols.includes(urlObject.protocol)) {
      return false;
    }

    // Check if domain is valid
    if (!urlObject.hostname) {
      return false;
    }

    // Additional validation for common patterns
    const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!domainPattern.test(urlObject.hostname)) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const getUrlValidationError = (url: unknown): string | null => {
  if (!url || typeof url !== 'string') {
    return 'URL is required';
  }

  // Sanitize input first
  const sanitizedUrl = sanitizeInput(url.trim());
  if (!sanitizedUrl) {
    return 'URL contains invalid characters';
  }

  if (!sanitizedUrl) {
    return 'URL cannot be empty';
  }

  if (sanitizedUrl.length > 2048) {
    return 'URL is too long (maximum 2048 characters)';
  }

  if (!sanitizedUrl.match(/^(https?|ftp):\/\//)) {
    return 'URL must start with http://, https://, or ftp://';
  }

  if (!isValidUrl(sanitizedUrl)) {
    return 'Please enter a valid URL format (e.g., https://example.com)';
  }

  return null;
};

// Export function to get sanitized and secure URL
export const getSecureUrl = (url: string): string => {
  const sanitized = sanitizeInput(url.trim());
  return sanitizeURL(sanitized) || '';
};
