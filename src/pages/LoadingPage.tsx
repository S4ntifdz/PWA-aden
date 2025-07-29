import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useAuthStore } from '../stores/useAuthStore';
import { useTokenFromUrl } from '../hooks/useTokenFromUrl';

export function LoadingPage() {
  const navigate = useNavigate();
  const { validateAdecashToken, isValidating, error, setAdecashToken, setUser } = useAuthStore();
  const token = useTokenFromUrl();

  useEffect(() => {
    const handleAuth = async () => {
      if (!token) {
        navigate('/error', { 
          state: { 
            error: 'No se encontró token de Adecash en la URL' 
          } 
        });
        return;
      }

      setAdecashToken(token);
      const isValid = await validateAdecashToken(token);
      
      if (isValid) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/error', { 
          state: { 
            error: 'Acceso no autorizado. Token de Adecash inválido o expirado.' 
          } 
        });
      }
    };

    handleAuth();
  }, [token, validateAdecashToken, navigate, setAdecashToken, setUser]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#264252] flex items-center justify-center">
        <ErrorMessage
          title="Error de Autenticación"
          message={error}
          action={
            <button
              onClick={() => window.location.reload()}
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#264252] flex items-center justify-center">
      <LoadingSpinner 
        message="Validando acceso de Adecash..." 
        size="lg"
      />
    </div>
  );
}