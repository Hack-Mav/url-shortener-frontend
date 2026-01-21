import { validateEnvironment, getEnvironmentConfig } from '../envValidator';

// Mock process.env
const originalEnv = process.env;

describe('envValidator', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('validateEnvironment', () => {
    it('should return valid when all required environment variables are present and valid', () => {
      process.env.REACT_APP_BASE_URL_FOR_URL_SHORTENER = 'https://api.example.com';

      const result = validateEnvironment();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.config.REACT_APP_BASE_URL_FOR_URL_SHORTENER).toBe('https://api.example.com');
    });

    it('should return errors when required environment variables are missing', () => {
      delete process.env.REACT_APP_BASE_URL_FOR_URL_SHORTENER;

      const result = validateEnvironment();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required environment variable: REACT_APP_BASE_URL_FOR_URL_SHORTENER');
    });

    it('should return errors when URL format is invalid', () => {
      process.env.REACT_APP_BASE_URL_FOR_URL_SHORTENER = 'not-a-valid-url';

      const result = validateEnvironment();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid URL format for REACT_APP_BASE_URL_FOR_URL_SHORTENER: not-a-valid-url');
    });

    it('should handle empty environment variable', () => {
      process.env.REACT_APP_BASE_URL_FOR_URL_SHORTENER = '';

      const result = validateEnvironment();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required environment variable: REACT_APP_BASE_URL_FOR_URL_SHORTENER');
    });
  });

  describe('getEnvironmentConfig', () => {
    it('should return config when environment is valid', () => {
      process.env.REACT_APP_BASE_URL_FOR_URL_SHORTENER = 'https://api.example.com';

      const config = getEnvironmentConfig();

      expect(config.REACT_APP_BASE_URL_FOR_URL_SHORTENER).toBe('https://api.example.com');
    });

    it('should throw error when environment is invalid', () => {
      delete process.env.REACT_APP_BASE_URL_FOR_URL_SHORTENER;

      expect(() => getEnvironmentConfig()).toThrow();
    });
  });
});
