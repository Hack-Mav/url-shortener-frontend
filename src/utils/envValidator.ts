interface EnvironmentConfig {
  REACT_APP_BASE_URL_FOR_URL_SHORTENER: string;
}

const requiredEnvVars: (keyof EnvironmentConfig)[] = [
  'REACT_APP_BASE_URL_FOR_URL_SHORTENER',
];

export const validateEnvironment = (): {
  isValid: boolean;
  errors: string[];
  config: Partial<EnvironmentConfig>;
} => {
  const errors: string[] = [];
  const config: Partial<EnvironmentConfig> = {};

  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar];
    
    if (!value) {
      errors.push(`Missing required environment variable: ${envVar}`);
      continue;
    }

    if (envVar === 'REACT_APP_BASE_URL_FOR_URL_SHORTENER') {
      try {
        new URL(value);
        (config as any)[envVar] = value;
      } catch {
        errors.push(`Invalid URL format for ${envVar}: ${value}`);
      }
    } else {
      (config as any)[envVar] = value;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    config,
  };
};

export const getEnvironmentConfig = (): EnvironmentConfig => {
  const validation = validateEnvironment();
  
  if (!validation.isValid) {
    const errorMessage = `Environment validation failed:\n${validation.errors.join('\n')}`;
    console.error(errorMessage);
    
    // In development, throw an error to make it obvious
    if (process.env.NODE_ENV === 'development') {
      throw new Error(errorMessage);
    }
    
    // In production, we might want to fail gracefully
    // For now, we'll throw in all environments to prevent runtime issues
    throw new Error(errorMessage);
  }

  // Type assertion is safe here because we validated that all required fields exist
  return validation.config as EnvironmentConfig;
};

// Export individual environment variables with proper typing
export const env = getEnvironmentConfig();
