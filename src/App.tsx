import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from './stores/useThemeStore';
import { LoadingPage } from './pages/LoadingPage';
import { ErrorPage } from './pages/ErrorPage';
import { DashboardPage } from './pages/DashboardPage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { PaymentPage } from './pages/PaymentPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { JWTTokenPage } from './pages/JWTTokenPage';

function App() {
  const { isDark } = useThemeStore();

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Also apply to body for better coverage
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="bg-blob bg-blob-1"></div>
          <div className="bg-blob bg-blob-2"></div>
          <div className="bg-blob bg-blob-3"></div>
        </div>
        
        {/* Main content */}
        <div className="relative z-10">
        <Routes>
          {/* Loading/Auth Route */}
          <Route path="/loading/:tableId" element={<LoadingPage />} />
          
          {/* JWT Token Route - for URLs like /jwt-token */}
          <Route path="/:token" element={<JWTTokenPage />} />
          
          {/* Error Route */}
          <Route path="/error" element={<ErrorPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard/:tableId" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/menu/:tableId" 
            element={
              <ProtectedRoute>
                <MenuPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/cart/:tableId" 
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/order-confirmation/:tableId" 
            element={
              <ProtectedRoute>
                <OrderConfirmationPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/payment/:tableId" 
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/confirmation/:tableId" 
            element={
              <ProtectedRoute>
                <ConfirmationPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect root to loading with a sample table ID */}
          <Route path="/" element={<Navigate to="/loading/sample-table-id" replace />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/error" replace />} />
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;