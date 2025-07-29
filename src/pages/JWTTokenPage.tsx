import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useAuthStore } from '../stores/useAuthStore';
import { JWTManager } from '../lib/jwt';

export function JWTTokenPage() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { validateAdecashToken, isValidating, error, setUser, setAdecashToken } = useAuthStore();

  useEffect(() => {
    const handleAuth = async () => {
      if (!token) {
        console.log('No token found in URL');
        navigate('/error', { 
          state: { 
            error: 'No se encontró token de Adecash en la URL' 
          } 
        });
        return;
      }

      console.log('Adecash token from URL:', token.substring(0, 20) + '...');
      
      try {
        // Decode Adecash JWT to extract user data
        const user = JWTManager.decodeAdecashToken(token);
        
        if (!user) {
          console.log('Invalid Adecash token payload');
          navigate('/error', { 
            state: { 
              error: 'Token de Adecash no contiene información de usuario válida' 
            } 
          });
          return;
        }

        console.log('Setting user data:', user.first_name, user.last_name);
        setAdecashToken(token);
        setUser(user);
        
        console.log('Starting token validation...');
        const isValid = await validateAdecashToken(token);
        console.log('Token validation completed. Is valid:', isValid);
        
        if (isValid) {
          console.log('Redirecting to dashboard...');
          navigate('/dashboard', { replace: true });
        } else {
          console.log('Token validation failed, redirecting to error');
          navigate('/error', { 
            state: { 
              error: 'Acceso no autorizado. Token de Adecash inválido o expirado.' 
            } 
          });
        }
      } catch (decodeError) {
        console.error('Error decoding Adecash JWT:', decodeError);
        navigate('/error', { 
          state: { 
            error: 'Token de Adecash malformado o inválido' 
          } 
        });
      }
    };

    handleAuth();
  }, [token, validateAdecashToken, navigate, setUser, setAdecashToken]);

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