import React, { Fragment, useRef } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  closeOnClickOutside?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  closeOnClickOutside = true,
  maxWidth = 'md',
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnClickOutside && backdropRef.current === e.target) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 animate-fade-in"
      onClick={handleBackdropClick}
      ref={backdropRef}
      aria-modal="true"
      role="dialog"
    >
      <div className={cn(
        'bg-white rounded-lg shadow-xl w-full mx-4 animate-scale-in',
        maxWidthClasses[maxWidth],
        className
      )}>
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              {description && (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              )}
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className={!title ? 'pt-4' : ''}>{children}</div>
      </div>
    </div>
  );
};

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalBody: React.FC<ModalBodyProps> = ({ children, className }) => {
  return <div className={cn('p-4', className)}>{children}</div>;
};

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => {
  return (
    <div className={cn('p-4 border-t border-gray-200 flex justify-end space-x-3', className)}>
      {children}
    </div>
  );
};