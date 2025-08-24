"use client"

import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: 'default' | 'destructive' | 'warning';
  onDismiss?: () => void;
  className?: string;
  showIcon?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  variant = 'default',
  onDismiss,
  className,
  showIcon = true
}) => {
  const variantStyles = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    destructive: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  const iconStyles = {
    default: 'text-blue-500',
    destructive: 'text-red-500',
    warning: 'text-yellow-500'
  };

  return (
    <div className={cn(
      'border rounded-lg p-4',
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start gap-3">
        {showIcon && (
          <AlertCircle className={cn('h-5 w-5 mt-0.5 flex-shrink-0', iconStyles[variant])} />
        )}
        
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="font-medium mb-1">
              {title}
            </h3>
          )}
          <p className="text-sm">
            {message}
          </p>
        </div>

        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="flex-shrink-0 h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

// Success message component
export const SuccessMessage: React.FC<Omit<ErrorMessageProps, 'variant'> & { variant?: 'success' }> = ({
  title,
  message,
  onDismiss,
  className,
  showIcon = true
}) => {
  return (
    <div className={cn(
      'bg-green-50 border-green-200 text-green-800 border rounded-lg p-4',
      className
    )}>
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className="h-5 w-5 mt-0.5 flex-shrink-0 rounded-full bg-green-100 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="font-medium mb-1">
              {title}
            </h3>
          )}
          <p className="text-sm">
            {message}
          </p>
        </div>

        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="flex-shrink-0 h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
