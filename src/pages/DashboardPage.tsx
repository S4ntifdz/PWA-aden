import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { OffersCarousel } from '../components/OffersCarousel';
import { CreditLineIndicator } from '../components/CreditLineIndicator';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useAuthStore } from '../stores/useAuthStore';
import { useCartStore } from '../stores/useCartStore';
import { apiClient } from '../lib/api';
import { UnpaidOrdersResponse, Offer } from '../types';
import { Plus, CreditCard, Phone, X } from 'lucide-react';

export function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { getCreditLineStatus, getTotal } = useCartStore();
  const [unpaidOrders, setUnpaidOrders] = useState<UnpaidOrdersResponse | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [showWaiterModal, setShowWaiterModal] = useState(false);
  const [showCancelWaiterModal, setShowCancelWaiterModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/loading');
      return;
    }

    // Check if we just created an order
    if (location.state?.orderNumber) {
      setShowOrderSuccess(true);
      // Clear the state to prevent showing again on refresh
      window.history.replaceState({}, document.title);
      // Hide success message after 3 seconds
      setTimeout(() => setShowOrderSuccess(false), 3000);
    }

    loadData();
  }, [isAuthenticated, navigate, location.state]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      // Load unpaid orders and offers
      const [unpaidOrdersData, offersData] = await Promise.all([
        apiClient.getUnpaidOrders(user.curp),
        apiClient.getOffers()
      ]);
      
      setUnpaidOrders(unpaidOrdersData);
      setOffers(offersData);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Error al cargar los datos de la mesa');
    } finally {
      setLoading(false);
    }
  };

  const handleCallWaiter = async () => {
    setShowWaiterModal(true);
  };

  const confirmCallWaiter = async () => {
    if (!user) return;
    
    try {
      const response = await apiClient.callWaiter(user.curp);
      if (response.calling) {
        setWaiterCalled(true);
        setShowWaiterModal(false);
      }
    } catch (error) {
      console.error('Error calling waiter:', error);
      alert('Error al llamar al mozo. Intenta nuevamente.');
      setShowWaiterModal(false);
    }
  };

  const handleCancelWaiter = async () => {
    if (!user) return;
    
    try {
      await apiClient.cancelWaiterCall(user.curp);
      setWaiterCalled(false);
      setShowCancelWaiterModal(false);
    } catch (error) {
      console.error('Error canceling waiter call:', error);
      alert('Error al cancelar llamado. Intenta nuevamente.');
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'RECEIVED': 'Recibida',
      'IN_PREPARATION': 'En preparación',
      'READY': 'Lista',
      'DELIVERED': 'Entregada'
    };
    return statusMap[status] || status;
  };

  // Calculate credit line status
  const cartTotal = getTotal();
  const creditStatus = user ? getCreditLineStatus(user.max_credit_line, user.remaining_credit_line) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#264252]">
        <Header title="Cargando..." />
        <LoadingSpinner message="Cargando información de la mesa..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#264252]">
        <Header title="Error" />
        <ErrorMessage
          message={error}
          action={
            <button
              onClick={loadData}
              className="bg-[#80D580]-500 hover:bg-[#80D580]-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reintentar
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title={`Hola, ${user?.first_name || 'Usuario'}`}
        showCallWaiter
        onCallWaiter={handleCallWaiter}
      />

      <div className="p-6 space-y-8">
        {/* Credit Line Status */}
        {user && creditStatus && (
          <CreditLineIndicator 
            creditStatus={creditStatus}
            currentCartTotal={cartTotal}
            size="lg"
            showDetails={true}
          />
        )}

        {/* Order Success Message */}
        {showOrderSuccess && (
          <div className="card-organic bg-gradient-to-r from-brand-green/10 to-brand-blue/10 border-2 border-brand-green/30 dark:border-brand-teal/30">
            <div className="flex items-center relative">
              <div className="w-8 h-8 glass bg-gradient-to-r from-brand-green to-brand-blue rounded-full flex items-center justify-center mr-4 animate-pulse">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h3 className="text-brand-navy dark:text-cream font-bold text-lg">
                  ¡Orden creada exitosamente!
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Tu pedido ha sido enviado a la cocina
                  {location.state?.orderNumber && ` - Orden #${location.state.orderNumber}`}
                  {location.state?.takeAwayCode && ` - Código: ${location.state.takeAwayCode}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Waiter Called Banner */}
        {waiterCalled && (
          <div 
            onClick={() => setShowCancelWaiterModal(true)}
            className="card-organic bg-gradient-to-r from-brand-blue/10 to-brand-teal/10 border-2 border-brand-blue/30 dark:border-brand-teal/30 cursor-pointer hover:scale-[1.02] group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 glass bg-gradient-to-r from-brand-blue to-brand-teal rounded-full flex items-center justify-center mr-4">
                  <Phone className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h3 className="text-brand-navy dark:text-cream font-bold text-lg">
                    Mozo en camino
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Toca para cancelar llamado
                  </p>
                </div>
              </div>
              <div className="animate-pulse">
                <Phone className="w-5 h-5 text-brand-blue dark:text-brand-teal" />
              </div>
            </div>
          </div>
        )}

        {/* Offers Carousel */}
        <OffersCarousel offers={offers} />

        {/* Órdenes en Proceso */}
        {unpaidOrders && unpaidOrders.orders.length > 0 && (
          <div className="space-y-6">
            {unpaidOrders.orders.map((order) => (
              <div key={order.id} className="card-organic bg-gradient-to-br from-brand-green/10 via-transparent to-brand-blue/10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-brand-navy dark:text-cream">
                    Orden en Proceso
                  </h2>
                  <span className="glass px-3 py-1 rounded-full text-sm font-bold text-brand-blue dark:text-brand-teal">
                    #{order.order_number}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {order.order_products.map((item, index) => (
                    <div key={index} className="flex justify-between items-center glass p-3 rounded-xl">
                      <span className="text-brand-navy dark:text-cream font-medium">
{item.quantity}x {item.product_details?.name || item.offer_details?.name || 'Producto'}
                        
                      </span>
                      <span className="text-sm font-semibold text-brand-green dark:text-brand-lightGreen">
                        {getStatusText(order.status || 'RECEIVED')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resumen de Cuenta */}
{/* Resumen de Cuenta */}
{unpaidOrders && unpaidOrders.total_amount_owed > 0 && (
  <div className="card">
    <h2 className="text-xl font-bold text-brand-navy dark:text-cream mb-6">
      Resumen de Cuenta
    </h2>

    <div className="space-y-4">
      {unpaidOrders.orders.flatMap(order => {
        return order.order_products.map((item, index) => (
          <div
            key={`${order.id}-${index}`}
            className="flex justify-between items-center glass p-3 rounded-xl"
          >
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {item.quantity}x{" "}
              {item.product_details?.name ||
                item.offer_details?.name ||
                "Producto"}
            </span>
            <span className="font-bold text-brand-navy dark:text-cream">
              $
              {(
                (item.product_details?.price ||
                  item.offer_details?.price ||
                  0) * item.quantity
              ).toFixed(2)}
            </span>
          </div>
        ));
      })}

      <div className="glass p-4 rounded-xl bg-gradient-to-r from-brand-blue/10 to-brand-green/10">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-brand-navy dark:text-cream">
            Total
          </span>
          <span className="text-2xl font-bold bg-gradient-to-r from-brand-green to-brand-blue bg-clip-text text-[#DAAD29]">
            ${unpaidOrders.total_amount_owed.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  </div>
)}


        {/* Action Buttons */}
        <div className="flex gap-6">
          <button
            onClick={() => navigate('/menu')}
            className="flex-1 btn-secondary py-4 flex items-center justify-center gap-3 text-lg"
          >
            <Plus className="w-5 h-5" />
            Ordenar
          </button>
          
          {unpaidOrders && unpaidOrders.total_amount_owed > 0 && (
            <button
              onClick={() => navigate('/payment', { 
                state: { unpaidOrders } 
              })}
              className="flex-1 btn-primary py-4 flex items-center justify-center gap-3 text-lg bg-gradient-to-r from-brand-green/20 to-brand-blue/20 hover:from-brand-green/30 hover:to-brand-blue/30"
            >
              <CreditCard className="w-5 h-5" />
              Pagar Mesa
            </button>
          )}
        </div>
      </div>

      {/* Waiter Call Confirmation Modal */}
      {showWaiterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="card max-w-sm w-full animate-float">
            <div className="text-center">
              <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-brand-blue/20 to-brand-teal/20">
                <Phone className="w-10 h-10 text-brand-blue dark:text-brand-teal" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy dark:text-cream mb-3">
                ¿Llamar al mozo?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                El mozo será notificado y se dirigirá a tu mesa
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowWaiterModal(false)}
                  className="flex-1 btn-secondary py-3"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmCallWaiter}
                  className="flex-1 btn-primary py-3 bg-gradient-to-r from-brand-blue/20 to-brand-teal/20 hover:from-brand-blue/30 hover:to-brand-teal/30"
                >
                  Llamar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
            {/* Mini Footer with Logo */}
      {/* <div className="mt-16 pb-8">
        <div className="glass-strong rounded-3xl p-6 text-center">
          <div className="flex justify-center items-center"> Un producto de 
            <img
              src="/src/media/adecash.svg"
              alt="ADECASH Logo"
              className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>
      </div> */}

      {/* Cancel Waiter Call Modal */}
      {showCancelWaiterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="card max-w-sm w-full animate-float">
            <div className="text-center">
              <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-red-400/20 to-red-600/20">
                <X className="w-10 h-10 text-red-500 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy dark:text-cream mb-3">
                ¿Cancelar llamado?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Se cancelará la notificación al mozo
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCancelWaiterModal(false)}
                  className="flex-1 btn-secondary py-3"
                >
                  Mantener
                </button>
                <button
                  onClick={handleCancelWaiter}
                  className="flex-1 btn-primary py-3 bg-gradient-to-r from-red-400/20 to-red-600/20 hover:from-red-400/30 hover:to-red-600/30"
                >
                  Cancelar Llamado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}