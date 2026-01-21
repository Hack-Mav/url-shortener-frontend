import { sanitizeInput } from './security';

export const isValidAlias = (alias: unknown): boolean => {
  if (!alias || typeof alias !== 'string') {
    return false;
  }

  // Sanitize input first
  const sanitizedAlias = sanitizeInput(alias.trim());
  if (!sanitizedAlias) {
    return false;
  }

  // Length validation
  if (sanitizedAlias.length < 3 || sanitizedAlias.length > 20) {
    return false;
  }

  // Character validation - only allow alphanumeric, hyphens, and underscores
  const aliasPattern = /^[a-zA-Z0-9_-]+$/;
  if (!aliasPattern.test(sanitizedAlias)) {
    return false;
  }

  // Cannot start or end with hyphen or underscore
  if (sanitizedAlias.startsWith('-') || sanitizedAlias.startsWith('_') ||
      sanitizedAlias.endsWith('-') || sanitizedAlias.endsWith('_')) {
    return false;
  }

  // No consecutive special characters
  if (sanitizedAlias.includes('--') || sanitizedAlias.includes('__') || 
      sanitizedAlias.includes('-_') || sanitizedAlias.includes('_-')) {
    return false;
  }

  return true;
};

export const getAliasValidationError = (alias: unknown): string | null => {
  if (!alias || typeof alias !== 'string') {
    return null; // Alias is optional
  }

  // Sanitize input first
  const sanitizedAlias = sanitizeInput(alias.trim());
  if (!sanitizedAlias) {
    return 'Alias contains invalid characters';
  }

  if (!sanitizedAlias) {
    return null; // Empty alias is valid (will use default)
  }

  if (sanitizedAlias.length < 3) {
    return 'Alias must be at least 3 characters long';
  }

  if (sanitizedAlias.length > 20) {
    return 'Alias cannot be longer than 20 characters';
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(sanitizedAlias)) {
    return 'Alias can only contain letters, numbers, hyphens, and underscores';
  }

  if (sanitizedAlias.startsWith('-') || sanitizedAlias.startsWith('_') ||
      sanitizedAlias.endsWith('-') || sanitizedAlias.endsWith('_')) {
    return 'Alias cannot start or end with hyphens or underscores';
  }

  if (sanitizedAlias.includes('--') || sanitizedAlias.includes('__') || 
      sanitizedAlias.includes('-_') || sanitizedAlias.includes('_-')) {
    return 'Alias cannot contain consecutive special characters';
  }

  return null;
};

// Export function to get sanitized alias
export const getSanitizedAlias = (alias: string): string => {
  return sanitizeInput(alias.trim()) || '';
};
