import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ message = 'Cargando...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} border-4 border-brand-blue/20 dark:border-brand-teal/20 rounded-full animate-spin`}></div>
        {/* Inner spinning element */}
        <Loader2 className={`${sizeClasses[size]} absolute inset-0 animate-spin text-brand-blue dark:text-brand-teal`} />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-gradient-to-r from-brand-blue to-brand-green rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="glass px-4 py-2 rounded-2xl mt-6">
        <p className="text-sm font-medium text-brand-navy dark:text-cream">{message}</p>
      </div>
    </div>
  );
}