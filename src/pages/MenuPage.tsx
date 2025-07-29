import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { OfferCard } from '../components/OfferCard';
import { CreditLineIndicator } from '../components/CreditLineIndicator';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuthStore } from '../stores/useAuthStore';
import { useCartStore } from '../stores/useCartStore';
import { apiClient } from '../lib/api';
import { Product, MenuCategory, Menu, Offer } from '../types';

export function MenuPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { getTotal, getItemCount, getCreditLineStatus } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/loading');
      return;
    }

    loadData();
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all data from API
      const [productsData, categoriesData, offersData] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getMenuCategories(),
        apiClient.getOffers()
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setOffers(offersData);
      
    } catch (error) {
      console.error('Error loading menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  // For now, show all products. In the future, you might want to filter by menu categories
  const filteredProducts = products;

  const cartTotal = getTotal();
  const cartItemCount = getItemCount();

  // Calculate credit line status
  const creditStatus = user ? getCreditLineStatus(user.max_credit_line, user.remaining_credit_line) : null;
  const isOverCreditLimit = creditStatus ? (creditStatus.used_credit_line + cartTotal) > creditStatus.max_credit_line : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#264252]">
        <Header title="Menú" showBack showCart />
        <LoadingSpinner message="Cargando menú..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#264252] pb-20">
      <Header title="Menú" showBack showCart />

      {/* Credit Line Indicator */}
      {user && creditStatus && (
        <div className="p-4 pb-0">
          <CreditLineIndicator 
            creditStatus={creditStatus}
            currentCartTotal={cartTotal}
            size="md"
            showDetails={true}
          />
        </div>
      )}

      {/* Category Tabs */}
      <div className="bg-white dark:bg-[#3C647C] p-4 shadow-sm">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-[#80D580]-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveCategory('offers')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'offers'
                ? 'bg-[#80D580]-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            🎉 Ofertas
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id.toString())}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category.id.toString()
                  ? 'bg-[#80D580]-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        <div className="grid gap-4">
          {activeCategory === 'offers' ? (
            offers.map((offer) => (
              <OfferCard key={offer.uuid} offer={offer} />
            ))
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.uuid} product={product} />
            ))
          )}
        </div>
      </div>

      {/* Cart Footer */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#80D580]-500 to-[#80D580]-600 shadow-lg p-4">
          <button
            onClick={() => navigate('/cart')}
            disabled={isOverCreditLimit}
            className={`w-full backdrop-blur-sm text-white py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-between px-6 shadow-lg border border-white/20 ${
              isOverCreditLimit 
                ? 'bg-red-500/20 hover:bg-red-500/30 cursor-not-allowed' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isOverCreditLimit ? 'bg-red-500/30' : 'bg-white/20'
              }`}>
                <span className="text-sm font-bold">{cartItemCount}</span>
              </div>
              <span className="text-sm">
                {cartItemCount === 1 ? 'Item' : 'Items'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                {isOverCreditLimit ? 'Límite Excedido' : 'Ver Carrito'}
              </span>
              {!isOverCreditLimit && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </div>
            
            <div className="text-right">
              <div className="text-xs opacity-80">Total</div>
              <div className="text-lg font-bold">${cartTotal.toFixed(2)}</div>
            </div>
          </button>
          
          {isOverCreditLimit && (
            <div className="mt-2 text-center">
              <p className="text-xs text-white/80">
                Reduce el monto del carrito o selecciona otro método de pago
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}