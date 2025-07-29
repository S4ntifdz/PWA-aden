import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AdecashUser } from '../types';
import { apiClient } from '../lib/api';
import { JWTManager } from '../lib/jwt';

interface AuthStore extends AuthState {
  setAdecashToken: (token: string) => void;
  setUser: (user: AdecashUser) => void;
  validateAdecashToken: (token: string) => Promise<boolean>;
  updateCreditLine: (remaining: number) => void;
  logout: () => void;
  setError: (error: string | null) => void;
  setValidating: (isValidating: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      coreToken: null,
      isValidating: false,
      error: null,
      user: null,

      setAdecashToken: (token: string) => {
        set({ token });
      },

      setUser: (user: AdecashUser) => {
        const coreToken = JWTManager.generateCoreToken(user);
        apiClient.setToken(coreToken);
        set({ user, coreToken, isAuthenticated: true });
      },

      validateAdecashToken: async (token: string) => {
        set({ isValidating: true, error: null });
        
        console.log('Starting Adecash token validation...');
        
        try {
          // Check if token is expired
          if (JWTManager.isTokenExpired(token)) {
            set({ 
              token: null, 
              user: null,
              coreToken: null,
              isAuthenticated: false, 
              isValidating: false,
              error: 'Token expirado' 
            });
            return false;
          }

          // Decode Adecash token
          const user = JWTManager.decodeAdecashToken(token);
          
          if (!user) {
            set({ 
              token: null, 
              user: null,
              coreToken: null,
              isAuthenticated: false, 
              isValidating: false,
              error: 'Token de Adecash inválido' 
            });
            return false;
          }

          // Generate core token and validate with API
          const coreToken = JWTManager.generateCoreToken(user);
          apiClient.setToken(coreToken);
          
          const isValid = await apiClient.validateJWT();
          
          console.log('Core token validation result:', isValid);
          
          if (isValid === true) {
            set({ 
              token, 
              user,
              coreToken,
              isAuthenticated: true, 
              isValidating: false,
              error: null 
            });
            return true;
          } else {
            set({ 
              token: null, 
              user: null,
              coreToken: null,
              isAuthenticated: false, 
              isValidating: false,
              error: 'Error de validación con el servidor' 
            });
            return false;
          }
        } catch (error) {
          console.error('Token validation error:', error);
          set({ 
            token: null, 
            user: null,
            coreToken: null,
            isAuthenticated: false, 
            isValidating: false,
            error: 'Error de conexión con el servidor' 
          });
          return false;
        }
      },

      updateCreditLine: (remaining: number) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              remaining_credit_line: remaining
            }
          });
        }
      },
      logout: () => {
        set({ 
          isAuthenticated: false, 
          token: null, 
          user: null,
          coreToken: null,
          error: null 
        });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setValidating: (isValidating: boolean) => {
        set({ isValidating });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user,
        coreToken: state.coreToken
      }),
    }
  )
);