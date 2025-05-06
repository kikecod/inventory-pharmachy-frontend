import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  children: React.ReactNode;
  title?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  title,
  variant = 'info',
  className,
  icon,
  onClose,
}) => {
  const baseStyles = 'rounded-md p-4';
  
  const variants = {
    info: 'bg-secondary-50 text-secondary-800',
    success: 'bg-success-50 text-success-800',
    warning: 'bg-warning-50 text-warning-800',
    error: 'bg-error-50 text-error-800',
  };
  
  const icons = {
    info: <Info className="h-5 w-5 text-secondary-500" />,
    success: <CheckCircle className="h-5 w-5 text-success-500" />,
    warning: <AlertCircle className="h-5 w-5 text-warning-500" />,
    error: <XCircle className="h-5 w-5 text-error-500" />,
  };
  
  return (
    <div className={cn(baseStyles, variants[variant], className)}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {icon || icons[variant]}
        </div>
        <div className="ml-3 w-full">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          <div className="text-sm mt-1">{children}</div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className="inline-flex rounded-md p-1 text-gray-500 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-50 focus:ring-primary-500"
              onClick={onClose}
            >
              <span className="sr-only">Dismiss</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};