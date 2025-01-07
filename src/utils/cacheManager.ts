interface CacheConfig {
    ttl: number; // Time to live in milliseconds
    version: string;
    maxSize?: number; // Maximum size in bytes
}

interface CacheItem<T> {
    data: T;
    timestamp: number;
    size: number;
}

export class CacheManager {
    private cache: Map<string, CacheItem<unknown>>;
    private config: CacheConfig;
    private currentSize: number;

    constructor(config: Partial<CacheConfig> = {}) {
        this.cache = new Map();
        this.currentSize = 0;
        this.config = {
            ttl: 1000 * 60 * 60, // 1 hour default
            version: '1.0.0',
            maxSize: 1024 * 1024 * 5, // 5MB default
            ...config
        };
    }

    set<T>(key: string, data: T): void {
        const item: CacheItem<T> = {
            data,
            timestamp: Date.now(),
            size: this.calculateSize(data)
        };

        // Check if we need to make space
        if (this.config.maxSize) {
            while (this.currentSize + item.size > this.config.maxSize) {
                this.removeOldest();
            }
        }

        this.cache.set(key, item);
        this.currentSize += item.size;
    }

    get<T>(key: string): T | null {
        const item = this.cache.get(key) as CacheItem<T>;
        
        if (!item) return null;

        // Check if expired
        if (Date.now() - item.timestamp > this.config.ttl) {
            this.cache.delete(key);
            this.currentSize -= item.size;
            return null;
        }

        return item.data;
    }

    clear(): void {
        this.cache.clear();
        this.currentSize = 0;
    }

    private calculateSize(data: any): number {
        try {
            const str = JSON.stringify(data);
            return str.length * 2; // Aproximate size in bytes
        } catch {
            return 0;
        }
    }

    private removeOldest(): void {
        let oldestKey: string | null = null;
        let oldestTime = Infinity;

        for (const [key, item] of this.cache.entries()) {
            if (item.timestamp < oldestTime) {
                oldestTime = item.timestamp;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            const item = this.cache.get(oldestKey);
            if (item) {
                this.currentSize -= item.size;
                this.cache.delete(oldestKey);
            }
        }
    }
}

function setCache(_key: string, _value: unknown) {
  // ...existing code...
}

function getCache(_key: string): unknown {
  // ...existing code...
  return null;
}

function cacheFunction(_param: Record<string, unknown>) {
  // ...existing code...
}

function anotherCacheFunction(_param: Record<string, unknown>) {
  // ...existing code...
}

export { setCache, getCache, cacheFunction, anotherCacheFunction };
