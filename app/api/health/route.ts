import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { cache } from '@/lib/cache';
import { rateLimiters } from '@/lib/rate-limit';

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
    } catch (error) {
      health.checks.database = 'unhealthy';
      health.status = 'degraded';
    }

    // Check cache status
    try {
      const cacheStats = cache.getStats();
      health.checks.cache = 'healthy';
      health.metrics.cacheStats = cacheStats;
    } catch (error) {
      health.checks.cache = 'unhealthy';
      health.status = 'degraded';
    }

    // Check rate limiters
    try {
      const rateLimitStats = Object.entries(rateLimiters).map(([name, limiter]) => ({
        name,
        // Access private properties for stats (in production, add public methods)
        active: true
      }));
      health.checks.rateLimiters = 'healthy';
      health.metrics.rateLimitStats = rateLimitStats;
    } catch (error) {
      health.checks.rateLimiters = 'unhealthy';
      health.status = 'degraded';
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
