import React from 'react';
import { Offer } from '../types';
import { QuantityControl } from './QuantityControl';
import { useCartStore } from '../stores/useCartStore';

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  const { addOffer, offers, updateOfferQuantity } = useCartStore();
  
  const cartOffer = offers.find(item => item.offer.uuid === offer.uuid);
  const quantity = cartOffer?.quantity || 0;

  const handleAddToCart = () => {
    addOffer(offer, 1);
  };

  const handleIncrease = () => {
    updateOfferQuantity(offer.uuid, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      updateOfferQuantity(offer.uuid, quantity - 1);
    }
  };

  return (
    <div className="card-organic hover:scale-[1.02] group relative overflow-hidden">
      {/* Special offer background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/20 via-brand-green/10 to-brand-blue/20 dark:from-brand-gold/10 dark:via-brand-green/5 dark:to-brand-blue/10"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-gold/30 to-transparent rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-brand-green/30 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-4 relative glass-strong flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/20 to-brand-green/20 animate-pulse"></div>
        <div className="text-center p-4">
          <div className="text-6xl mb-3 animate-bounce">🎉</div>
          <div className="text-sm font-bold text-brand-gold dark:text-brand-amber tracking-wider">
            OFERTA ESPECIAL
          </div>
          <div className="mt-2 w-16 h-1 bg-gradient-to-r from-brand-gold to-brand-green rounded-full mx-auto"></div>
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl text-brand-navy dark:text-cream group-hover:text-brand-gold dark:group-hover:text-brand-amber transition-colors duration-300">
            {offer.name}
          </h3>
          <span className="text-2xl font-bold bg-gradient-to-r from-brand-gold to-brand-green bg-clip-text text-[#DAAD29]">
            ${offer.price.toFixed(2)}
          </span>
        </div>
        
        <div className="text-sm text-slate-700 dark:text-slate-300 mb-4">
          <p className="font-semibold mb-2 text-brand-navy dark:text-cream">Incluye:</p>
          {offer.products.map((item, index) => (
            <p key={index} className="text-sm mb-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gradient-to-r from-brand-green to-brand-blue rounded-full"></span>
              • {item.quantity}x {item.product.name}
            </p>
          ))}
        </div>

        <div className="flex items-center justify-between">
          {quantity > 0 ? (
            <QuantityControl
              quantity={quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
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
            className="btn-primary bg-gradient-to-r from-brand-gold/20 to-brand-green/20 hover:from-brand-gold/30 hover:to-brand-green/30 relative overflow-hidden group/btn"
          >
            <span className="relative z-10 font-semibold">
            Agregar Oferta
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-gold to-brand-green opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
}