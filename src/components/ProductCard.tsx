import React from 'react';
import { Product } from '../types';
import { QuantityControl } from './QuantityControl';
import { useCartStore } from '../stores/useCartStore';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items, updateQuantity } = useCartStore();
  
  const cartItem = items.find(item => item.product.uuid === product.uuid);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  const handleIncrease = () => {
    updateQuantity(product.uuid, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      updateQuantity(product.uuid, quantity - 1);
    }
  };

  return (
    <div className="card-organic hover:scale-[1.02] group">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 via-transparent to-brand-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
       
      <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-4 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
        <img
          src="/src/media/rapimozo_test_image.png"
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-3 right-3 z-20">
            <span className="glass px-2 py-1 text-xs font-medium text-brand-gold rounded-full">
              ¡Últimos {product.stock}!
            </span>
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-brand-navy dark:text-cream group-hover:text-brand-blue dark:group-hover:text-brand-teal transition-colors duration-300">
            {product.name}
          </h3>
          <span className="text-xl font-bold bg-gradient-to-r from-brand-green to-brand-blue bg-clip-text text-[#DAAD29]">
            ${product.price.toFixed(2)}
          </span>
        </div>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          {quantity > 0 ? (
            <QuantityControl
              quantity={quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              max={product.stock}
            />
          ) : (
            <div className="flex items-center gap-3">
              <div className="glass px-3 py-1 rounded-full">
                <span className="text-sm text-slate-500 dark:text-slate-400">0</span>
              </div>
            </div>
          )}
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group/btn"
          >
            <span className="relative z-10">
            Agregar al Carrito
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-green to-brand-blue opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
}