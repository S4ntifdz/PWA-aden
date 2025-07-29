import React from 'react';
import { ArrowLeft, Sun, Moon, ShoppingCart, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../stores/useThemeStore';
import { useCartStore } from '../stores/useCartStore';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showCart?: boolean;
  showThemeToggle?: boolean;
  showCallWaiter?: boolean;
  onCallWaiter?: () => void;
}

export function Header({
  title,
  showBack = false,
  showCart = false,
  showThemeToggle = true,
  showCallWaiter = false,
  onCallWaiter,
}: HeaderProps) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const { getItemCount } = useCartStore();
  const cartItemCount = getItemCount();

  return (
    <header className="header-glass text-brand-navy dark:text-cream px-6 py-4 flex items-center justify-between relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/5 to-brand-green/5 dark:from-brand-teal/5 dark:to-brand-blue/5"></div>
      
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 glass rounded-xl hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-300 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        <div>
          <h1 className="font-bold text-xl bg-gradient-to-r from-brand-navy to-brand-blue dark:from-cream dark:to-brand-teal bg-clip-text text-[#DAAD29]">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showCallWaiter && (
          <button
            onClick={onCallWaiter}
            className="glass px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 hover:bg-brand-blue/20 dark:hover:bg-brand-teal/20 active:scale-95"
          >
            <Phone className="w-4 h-4" />
            Llamar Mozo
          </button>
        )}

        {showCart && (
          <button
            onClick={() => navigate('/cart')}
            className="relative p-2 glass rounded-xl hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-300 active:scale-95"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-brand-green to-brand-blue text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>
        )}

        {showThemeToggle && (
          <button
            onClick={toggleTheme}
            className="p-2 glass rounded-xl hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-300 active:scale-95"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}
      </div>
    </header>
  );
}