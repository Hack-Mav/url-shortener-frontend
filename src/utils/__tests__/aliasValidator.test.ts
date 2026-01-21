import { isValidAlias, getAliasValidationError } from '../aliasValidator';

describe('aliasValidator', () => {
  describe('isValidAlias', () => {
    it('should return true for valid aliases', () => {
      expect(isValidAlias('test123')).toBe(true);
      expect(isValidAlias('my_url')).toBe(true);
      expect(isValidAlias('my-url')).toBe(true);
      expect(isValidAlias('test123abc')).toBe(true);
      expect(isValidAlias('a1b2c3')).toBe(true);
    });

    it('should return false for invalid aliases', () => {
      expect(isValidAlias('')).toBe(false);
      expect(isValidAlias('ab')).toBe(false); // too short
      expect(isValidAlias('a'.repeat(21))).toBe(false); // too long
      expect(isValidAlias('-invalid')).toBe(false); // starts with hyphen
      expect(isValidAlias('_invalid')).toBe(false); // starts with underscore
      expect(isValidAlias('invalid-')).toBe(false); // ends with hyphen
      expect(isValidAlias('invalid_')).toBe(false); // ends with underscore
      expect(isValidAlias('in--valid')).toBe(false); // consecutive hyphens
      expect(isValidAlias('in__valid')).toBe(false); // consecutive underscores
      expect(isValidAlias('in_-valid')).toBe(false); // consecutive special chars
      expect(isValidAlias('invalid@')).toBe(false); // invalid character
      expect(isValidAlias(null)).toBe(false);
      expect(isValidAlias(undefined)).toBe(false);
      expect(isValidAlias(123)).toBe(false);
    });
  });

  describe('getAliasValidationError', () => {
    it('should return null for valid aliases', () => {
      expect(getAliasValidationError('test123')).toBe(null);
      expect(getAliasValidationError('my_url')).toBe(null);
      expect(getAliasValidationError('my-url')).toBe(null);
    });

    it('should return null for empty or null alias (optional)', () => {
      expect(getAliasValidationError('')).toBe(null);
      expect(getAliasValidationError('   ')).toBe(null);
      expect(getAliasValidationError(null)).toBe(null);
      expect(getAliasValidationError(undefined)).toBe(null);
    });

    it('should return appropriate error messages', () => {
      expect(getAliasValidationError('ab')).toBe('Alias must be at least 3 characters long');
      expect(getAliasValidationError('a'.repeat(21))).toBe('Alias cannot be longer than 20 characters');
      expect(getAliasValidationError('-invalid')).toBe('Alias cannot start or end with hyphens or underscores');
      expect(getAliasValidationError('invalid-')).toBe('Alias cannot start or end with hyphens or underscores');
      expect(getAliasValidationError('in--valid')).toBe('Alias cannot contain consecutive special characters');
      expect(getAliasValidationError('invalid@')).toBe('Alias can only contain letters, numbers, hyphens, and underscores');
    });
  });
});
