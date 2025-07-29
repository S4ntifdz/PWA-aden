import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useThemeStore } from '../stores/useThemeStore';
import { useAuthStore } from '../stores/useAuthStore';

export function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();

  const { orderNumber, takeAwayCode, total, paymentMethod, userName } = location.state || {};

  const handleBackToHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#264252] flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-[#3C647C] rounded-lg p-8 shadow-lg text-center max-w-md w-full">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          ¡Orden Confirmada!
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Tu orden ha sido enviada a la cocina
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Número de Orden:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                #{orderNumber || 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Código de Retiro:</span>
              <span className="font-bold text-2xl text-[#80D580]-600 dark:text-[#80D580]-400">
                {takeAwayCode || `${user?.first_name} ${user?.last_name}`}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {total ? total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : '$0.00'}
              </span>
            </div>
            
            {paymentMethod && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Método de Pago:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {paymentMethod === 'credit' ? 'Línea de Crédito' : 
                   paymentMethod === 'mercado_pago' ? 'Mercado Pago' : 'Efectivo'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Pickup Instructions */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            📋 Instrucciones de Retiro
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {takeAwayCode 
              ? `Presenta el código "${takeAwayCode}" en el mostrador para retirar tu pedido.`
              : `Presenta tu identificación con el nombre "${userName || `${user?.first_name} ${user?.last_name}`}" para retirar tu pedido.`
            }
          </p>
        </div>

        {/* Status */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estado:</p>
          <p className="text-[#80D580]-600 dark:text-[#80D580]-400 font-medium">
            Recibida
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Tiempo estimado: 15-20 minutos
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleBackToHome}
          className="w-full bg-[#80D580]-500 hover:bg-[#80D580]-600 text-white py-3 rounded-lg font-medium transition-colors mb-4"
        >
          Volver al Inicio
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          {isDark ? 'Modo Claro' : 'Modo Oscuro'}
        </button>
      </div>
    </div>
  );
}