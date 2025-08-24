// Simple in-memory rate limiting for development
// In production, consider using Redis or similar

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      return true;
    }

    if (entry.count >= this.config.maxRequests) {
      return false;
    }

    // Increment count
    entry.count++;
    return true;
  }

  getRemaining(identifier: string): number {
    const entry = this.limits.get(identifier);
    if (!entry) {
      return this.config.maxRequests;
    }
    return Math.max(0, this.config.maxRequests - entry.count);
  }

  getResetTime(identifier: string): number {
    const entry = this.limits.get(identifier);
    return entry?.resetTime || Date.now();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    // Convert to array for better compatibility
    const entries = Array.from(this.limits.entries());
    for (const [key, entry] of entries) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// Create rate limiters for different endpoints
export const rateLimiters = {
  // General API rate limiting
  api: new RateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 100 }), // 100 requests per 15 minutes
  
  // Auth endpoints
  auth: new RateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 5 }), // 5 requests per 15 minutes
  
  // Product operations
  products: new RateLimiter({ windowMs: 1 * 60 * 1000, maxRequests: 30 }), // 30 requests per minute
  
  // File uploads
  uploads: new RateLimiter({ windowMs: 1 * 60 * 1000, maxRequests: 10 }), // 10 uploads per minute
};

// Rate limiting middleware for Next.js API routes
export function withRateLimit(
  limiter: RateLimiter,
  identifier: string
): { allowed: boolean; remaining: number; resetTime: number } {
  const allowed = limiter.isAllowed(identifier);
  const remaining = limiter.getRemaining(identifier);
  const resetTime = limiter.getResetTime(identifier);

  return { allowed, remaining, resetTime };
}

// Helper to get client identifier (IP address or user ID)
export function getClientIdentifier(req: Request): string {
  // In production, you'd get the real IP address
  // For now, we'll use a simple hash of the request headers
  const headers = Array.from(req.headers.entries())
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
  
  return `client:${headers.length}`;
}

// Clean up expired rate limit entries periodically
setInterval(() => {
  Object.values(rateLimiters).forEach(limiter => limiter.cleanup());
}, 60 * 1000); // Clean up every minute
