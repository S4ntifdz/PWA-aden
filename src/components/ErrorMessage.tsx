import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  action?: React.ReactNode;
}

export function ErrorMessage({ 
  title = 'Error', 
  message, 
  action 
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="card-organic p-8 max-w-md w-full">
        <div className="w-20 h-20 glass rounded-full flex items-center justify-center mb-6 mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-red-600/20 animate-pulse"></div>
          <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400 relative z-10" />
        </div>
        <h2 className="text-2xl font-bold text-brand-navy dark:text-cream mb-3">
          {title}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          {message}
        </p>
        {action && (
          <div className="mt-4">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}