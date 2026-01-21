import { isValidUrl, getUrlValidationError } from '../urlValidator';

describe('urlValidator', () => {
  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://www.example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path')).toBe(true);
      expect(isValidUrl('https://example.com:8080')).toBe(true);
      expect(isValidUrl('ftp://example.com')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('mailto:test@example.com')).toBe(false);
      expect(isValidUrl('file:///path/to/file')).toBe(false);
      expect(isValidUrl(null)).toBe(false);
      expect(isValidUrl(undefined)).toBe(false);
      expect(isValidUrl(123)).toBe(false);
    });

    it('should handle whitespace correctly', () => {
      expect(isValidUrl('  https://example.com  ')).toBe(true);
      expect(isValidUrl('   ')).toBe(false);
    });
  });

  describe('getUrlValidationError', () => {
    it('should return null for valid URLs', () => {
      expect(getUrlValidationError('https://example.com')).toBe(null);
      expect(getUrlValidationError('http://example.com')).toBe(null);
    });

    it('should return appropriate error messages', () => {
      expect(getUrlValidationError('')).toBe('URL is required');
      expect(getUrlValidationError(null)).toBe('URL is required');
      expect(getUrlValidationError('   ')).toBe('URL cannot be empty');
      expect(getUrlValidationError('example.com')).toBe('URL must start with http://, https://, or ftp://');
      expect(getUrlValidationError('not-a-url')).toBe('Please enter a valid URL format (e.g., https://example.com)');
    });

    it('should validate URL length', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(2048);
      expect(getUrlValidationError(longUrl)).toBe('URL is too long (maximum 2048 characters)');
    });
  });
});
