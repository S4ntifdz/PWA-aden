import React from 'react';
import { CreditCard, AlertTriangle } from 'lucide-react';
import { CreditLineStatus } from '../types';

interface CreditLineIndicatorProps {
  creditStatus: CreditLineStatus;
  currentCartTotal?: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function CreditLineIndicator({ 
  creditStatus, 
  currentCartTotal = 0,
  size = 'md',
  showDetails = true 
}: CreditLineIndicatorProps) {
  const projectedUsed = creditStatus.used_credit_line + currentCartTotal;
  const projectedRemaining = creditStatus.max_credit_line - projectedUsed;
  const projectedPercentage = (projectedUsed / creditStatus.max_credit_line) * 100;
  
  const isOverLimit = projectedUsed > creditStatus.max_credit_line;
  const isNearLimit = projectedPercentage > 80;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const barHeight = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="card-organic bg-gradient-to-r from-brand-blue/10 to-brand-green/10 border border-brand-blue/20">
      <div className="flex items-center gap-3 mb-3">
        <div className={`glass rounded-full p-2 ${isOverLimit ? 'bg-red-500/20' : 'bg-brand-blue/20'}`}>
          {isOverLimit ? (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          ) : (
            <CreditCard className="w-4 h-4 text-brand-blue dark:text-brand-teal" />
          )}
        </div>
        <div>
          <h3 className={`font-bold text-brand-navy dark:text-cream ${sizeClasses[size]}`}>
            Línea de Crédito
          </h3>
          {showDetails && (
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Adecash • {creditStatus.max_credit_line.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} disponible
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full ${barHeight[size]} overflow-hidden`}>
          <div 
            className={`${barHeight[size]} transition-all duration-500 ${
              isOverLimit 
                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                : isNearLimit
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-brand-green to-brand-blue'
            }`}
            style={{ width: `${Math.min(projectedPercentage, 100)}%` }}
          />
        </div>

        {showDetails && (
          <div className="flex justify-between items-center text-xs">
            <div className="text-slate-600 dark:text-slate-400">
              Usado: {projectedUsed.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
            </div>
            <div className={`font-semibold ${
              isOverLimit 
                ? 'text-red-500' 
                : isNearLimit 
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-brand-green dark:text-brand-lightGreen'
            }`}>
              {isOverLimit ? 'Límite excedido' : `Disponible: ${projectedRemaining.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`}
            </div>
          </div>
        )}

        {currentCartTotal > 0 && (
          <div className="glass p-2 rounded-xl bg-gradient-to-r from-brand-gold/10 to-brand-amber/10">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-400">Carrito actual:</span>
              <span className="font-semibold text-brand-gold dark:text-brand-amber">
                {currentCartTotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
              </span>
            </div>
          </div>
        )}
      </div>

      {isOverLimit && (
        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">
            ⚠️ El monto del carrito excede tu línea de crédito disponible
          </p>
        </div>
      )}
    </div>
  );
}