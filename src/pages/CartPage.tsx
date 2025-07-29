import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { QuantityControl } from '../components/QuantityControl';
import { CreditLineIndicator } from '../components/CreditLineIndicator';
import { useCartStore } from '../stores/useCartStore';
import { useAuthStore } from '../stores/useAuthStore';
import { Trash2, CreditCard, Smartphone, DollarSign } from 'lucide-react';

export function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    items, 
    offers,
    notes, 
    paymentMethod,
    setNotes, 
    setPaymentMethod,
    updateQuantity, 
    updateOfferQuantity,
    removeItem, 
    removeOffer,
    getSubtotal, 
    getService, 
    getTotal,
    getCreditLineStatus
  } = useCartStore();

  const subtotal = getSubtotal();
  const service = getService();
  const total = getTotal();

  // Calculate credit line status
  const creditStatus = user ? getCreditLineStatus(user.max_credit_line, user.remaining_credit_line) : null;
  const isOverCreditLimit = creditStatus ? (creditStatus.used_credit_line + total) > creditStatus.max_credit_line : false;
  const canUseCreditPayment = !isOverCreditLimit && paymentMethod === 'credit';

  const handleProceedToOrder = () => {
    if (items.length === 0 && offers.length === 0) return;
    navigate('/order-confirmation');
  };

  const paymentMethods = [
    { id: 'credit', name: 'Línea de Crédito Adecash', icon: CreditCard, disabled: isOverCreditLimit },
    { id: 'mercado_pago', name: 'Mercado Pago', icon: Smartphone, disabled: false },
    { id: 'cash', name: 'Efectivo', icon: DollarSign, disabled: false }
  ];

  if (items.length === 0 && offers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#264252]">
        <Header title="Carrito" showBack />
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Agrega algunos productos del menú para continuar
            </p>
            <button
              onClick={() => navigate('/menu')}
              className="bg-[#80D580]-500 hover:bg-[#80D580]-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Ver Menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#264252] pb-32">
      <Header title="Carrito" showBack />

      <div className="p-4 space-y-6">
        {/* Credit Line Status */}
        {user && creditStatus && (
          <CreditLineIndicator 
            creditStatus={creditStatus}
            currentCartTotal={total}
            size="md"
            showDetails={true}
          />
        )}

        {/* Cart Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.product.uuid}
              className="bg-white dark:bg-[#3C647C] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start gap-3">
                <img
                  src="/src/media/rapimozo_test_image.png"
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    ${item.product.price.toFixed(2)} c/u
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <QuantityControl
                      quantity={item.quantity}
                      onIncrease={() => updateQuantity(item.product.uuid, item.quantity + 1)}
                      onDecrease={() => updateQuantity(item.product.uuid, item.quantity - 1)}
                    />
                    
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.product.uuid)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Cart Offers */}
          {offers.map((item) => (
            <div
              key={item.offer.uuid}
              className="bg-gradient-to-r from-[#80D580]-50 to-[#80D580]-100 dark:from-[#80D580]-900/20 dark:to-[#80D580]-800/20 rounded-lg p-4 shadow-sm border-2 border-[#80D580]-200 dark:border-[#80D580]-700"
            >
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-lg bg-[#80D580]-200 dark:bg-[#80D580]-800/30 flex items-center justify-center">
                  <span className="text-2xl">🎉</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-[#80D580]-900 dark:text-[#80D580]-100">
                    {item.offer.name}
                  </h3>
                  <p className="text-sm text-[#80D580]-700 dark:text-[#80D580]-300 mb-2">
                    ${item.offer.price.toFixed(2)} c/u • Oferta especial
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <QuantityControl
                      quantity={item.quantity}
                      onIncrease={() => updateOfferQuantity(item.offer.uuid, item.quantity + 1)}
                      onDecrease={() => updateOfferQuantity(item.offer.uuid, item.quantity - 1)}
                    />
                    
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[#80D580]-900 dark:text-[#80D580]-100">
                        ${(item.offer.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeOffer(item.offer.uuid)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notes Section */}
        <div className="bg-white dark:bg-[#3C647C] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Notas para la cocina
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Instrucciones especiales, alergias, etc."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#80D580]-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white dark:bg-[#3C647C] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Método de Pago
          </h3>
          
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <label
                  key={method.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    method.disabled
                      ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                      : paymentMethod === method.id
                      ? 'border-[#80D580]-500 bg-[#80D580]-50 dark:bg-[#80D580]-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value as 'credit' | 'mercado_pago' | 'cash')}
                    disabled={method.disabled}
                    className="sr-only"
                  />
                  
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === method.id && !method.disabled
                      ? 'border-[#80D580]-500 bg-[#80D580]-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {paymentMethod === method.id && !method.disabled && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 flex-1">
                    <IconComponent className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      {method.name}
                    </span>
                  </div>
                  
                  {method.disabled && method.id === 'credit' && (
                    <span className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                      Límite excedido
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-[#3C647C] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Resumen del Pedido
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Servicio (10%)</span>
              <span className="text-gray-900 dark:text-white">${service.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                <span className="font-bold text-xl text-gray-900 dark:text-white">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#3C647C] border-t border-gray-200 dark:border-gray-700 p-4">
        <button
          onClick={handleProceedToOrder}
          disabled={isOverCreditLimit && paymentMethod === 'credit'}
          className="w-full bg-[#80D580]-500 hover:bg-[#80D580]-600 text-white py-3 rounded-lg font-medium transition-colors"
        >
          {paymentMethod === 'credit' && isOverCreditLimit 
            ? 'Selecciona otro método de pago' 
            : `Encargar Pedido • ${total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`
          }
        </button>
      </div>
    </div>
  );
}