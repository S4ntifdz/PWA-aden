import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  min = 0,
  max = 999,
  size = 'md'
}: QuantityControlProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm'
  };

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        className={`${sizeClasses[size]} glass hover:bg-white/40 dark:hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all duration-300 active:scale-95 hover:shadow-lg`}
      >
        <Minus className={iconSize} />
      </button>
      
      <div className="glass px-4 py-2 rounded-xl min-w-[3rem]">
        <span className="text-center font-bold text-brand-navy dark:text-cream block">
        {quantity}
        </span>
      </div>
      
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className={`${sizeClasses[size]} glass hover:bg-white/40 dark:hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all duration-300 active:scale-95 hover:shadow-lg`}
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
}