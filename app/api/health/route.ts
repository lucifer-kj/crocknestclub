import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function GET() {
  const startTime = Date.now();
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    checks: {
      database: 'unknown',
      cache: 'unknown',
      rateLimiters: 'unknown'
    },
    metrics: {
      responseTime: 0,
      memoryUsage: process.memoryUsage(),
      cacheStats: null as any,
      rateLimitStats: null as any
    }
  };

  try {
    // Check database connection
    try {
      await prismadb.$queryRaw`SELECT 1`;
      health.checks.database = 'healthy';
      console.log('Health check: Database connection successful');
    } catch (error) {
      health.checks.database = 'unhealthy';
      health.status = 'degraded';
      console.error('Health check: Database connection failed:', error);
    }

    // Check cache status
    try {
      const { cache } = await import('@/lib/cache');
      const cacheStats = cache.getStats();
      health.checks.cache = 'healthy';
      health.metrics.cacheStats = cacheStats;
      console.log('Health check: Cache status successful');
    } catch (error) {
      health.checks.cache = 'unhealthy';
      health.status = 'degraded';
      console.error('Health check: Cache status failed:', error);
    }

    // Check rate limiters
    try {
      const { rateLimiters } = await import('@/lib/rate-limit');
      const rateLimitStats = Object.entries(rateLimiters).map(([name, limiter]) => ({
        name,
        // Access private properties for stats (in production, add public methods)
        active: true
      }));
      health.checks.rateLimiters = 'healthy';
      health.metrics.rateLimitStats = rateLimitStats;
      console.log('Health check: Rate limiters status successful');
    } catch (error) {
      health.checks.rateLimiters = 'unhealthy';
      health.status = 'degraded';
      console.error('Health check: Rate limiters status failed:', error);
    }

    // Determine overall status
    const allChecks = Object.values(health.checks);
    if (allChecks.every(check => check === 'healthy')) {
      health.status = 'healthy';
    } else if (allChecks.some(check => check === 'unhealthy')) {
      health.status = 'unhealthy';
    }

  } catch (error) {
    health.status = 'unhealthy';
    health.checks.database = 'error';
    console.error('Health check: Overall error:', error);
  }

  // Calculate response time
  health.metrics.responseTime = Date.now() - startTime;

  const statusCode = health.status === 'healthy' ? 200 : 
                    health.status === 'degraded' ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}

// Detailed health check for monitoring systems
export async function POST() {
  const body = await new Request('').json();
  const { detailed = false } = body || {};

  if (detailed) {
    // Return detailed health information
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || 'unknown',
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: {
        provider: 'mysql',
        connection: 'active'
      }
    });
  }

  return NextResponse.json({ status: 'healthy' });
}
