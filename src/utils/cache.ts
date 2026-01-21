interface CacheStats {
  total: number;
  valid: number;
  expired: number;
}

class Cache {
  private cache: Map<string, any>;
  private timestamps: Map<string, number>;
  private defaultTTL: number;

  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
  }

  set(key: string, value: any, ttl: number = this.defaultTTL): void {
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now() + ttl);
  }

  get(key: string): any | null {
    if (!this.cache.has(key)) {
      return null;
    }

    const expiry = this.timestamps.get(key);
    if (expiry && Date.now() > expiry) {
      this.delete(key);
      return null;
    }

    return this.cache.get(key);
  }

  delete(key: string): void {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.timestamps.clear();
  }

  has(key: string): boolean {
    if (!this.cache.has(key)) {
      return false;
    }

    const expiry = this.timestamps.get(key);
    if (expiry && Date.now() > expiry) {
      this.delete(key);
      return false;
    }

    return true;
  }

  size(): number {
    // Clean up expired entries before returning size
    const keys = Array.from(this.timestamps.keys());
    for (const key of keys) {
      const expiry = this.timestamps.get(key);
      if (expiry && Date.now() > expiry) {
        this.delete(key);
      }
    }
    return this.cache.size;
  }

  // Get cache statistics
  getStats(): CacheStats {
    const now = Date.now();
    let expiredCount = 0;
    let validCount = 0;

    const keys = Array.from(this.timestamps.keys());
    for (const key of keys) {
      const expiry = this.timestamps.get(key);
      if (expiry && now > expiry) {
        expiredCount++;
      } else {
        validCount++;
      }
    }

    return {
      total: this.cache.size,
      valid: validCount,
      expired: expiredCount
    };
  }
}

// Create a singleton instance
const cache = new Cache();

export default cache;
