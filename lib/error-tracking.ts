// Error tracking utility
// In production, integrate with services like Sentry, LogRocket, or similar

interface ErrorContext {
  userId?: string;
  storeId?: string;
  action?: string;
  [key: string]: any;
}

interface ErrorEvent {
  error: Error;
  context: ErrorContext;
  timestamp: string;
  userAgent: string;
  url: string;
}

class ErrorTracker {
  private isProduction = process.env.NODE_ENV === 'production';
  private errors: ErrorEvent[] = [];
  private maxErrors = 100; // Keep last 100 errors in memory

  trackError(error: Error, context: ErrorContext = {}): void {
    const errorEvent: ErrorEvent = {
      error,
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server'
    };

    // Add to local storage
    this.errors.push(errorEvent);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log error
    console.error('Error tracked:', errorEvent);

    // In production, send to error tracking service
    if (this.isProduction) {
      this.sendToErrorService(errorEvent);
    }
  }

  private async sendToErrorService(errorEvent: ErrorEvent): Promise<void> {
    try {
      // Example: Send to your error tracking endpoint
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorEvent)
      // });
      
      // For now, just log to console
      console.log('Error sent to tracking service:', errorEvent);
    } catch (sendError) {
      console.error('Failed to send error to tracking service:', sendError);
    }
  }

  getErrors(): ErrorEvent[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }

  // Get error statistics
  getErrorStats(): {
    total: number;
    byType: Record<string, number>;
    recent: number; // Last 24 hours
  } {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const byType: Record<string, number> = {};
    let recent = 0;

    this.errors.forEach(errorEvent => {
      const errorType = errorEvent.error.name || 'Unknown';
      byType[errorType] = (byType[errorType] || 0) + 1;

      if (new Date(errorEvent.timestamp) > oneDayAgo) {
        recent++;
      }
    });

    return {
      total: this.errors.length,
      byType,
      recent
    };
  }
}

export const errorTracker = new ErrorTracker();

// React error boundary integration
export const trackReactError = (error: Error, errorInfo: any) => {
  errorTracker.trackError(error, {
    action: 'react-error-boundary',
    errorInfo
  });
};

// API error tracking
export const trackApiError = (error: Error, context: ErrorContext) => {
  errorTracker.trackError(error, {
    action: 'api-error',
    ...context
  });
};

// Global error handler
export const setupGlobalErrorHandling = () => {
  if (typeof window !== 'undefined') {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      errorTracker.trackError(new Error(event.reason), {
        action: 'unhandled-promise-rejection'
      });
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      errorTracker.trackError(event.error || new Error(event.message), {
        action: 'global-error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
  }
};
