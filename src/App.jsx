// Build: 2025-10-26 16:34:52
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Suppliers from './pages/Suppliers';
import PurchaseOrders from './pages/PurchaseOrders';
import PurchaseReceptions from './pages/PurchaseReceptions';
import PurchaseHistory from './pages/PurchaseHistory';
import TableManagement from './pages/TableManagement';
import ProtectedRoute from './components/ProtectedRoute';

function RootRedirect() {
  const { user, loading } = useAuth();
  console.log('[RootRedirect] user:', user ? 'exists' : 'null', 'loading:', loading);

  if (loading) {
    console.log('[RootRedirect] Still loading, showing spinner');
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Chargement...</div>
      </div>
    );
  }

  const target = user ? "/dashboard" : "/login";
  console.log('[RootRedirect] Redirecting to:', target);
  return <Navigate to={target} replace />;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pos"
              element={
                <ProtectedRoute>
                  <POS />
                </ProtectedRoute>
              }
            />
            <Route
              path="/suppliers"
              element={
                <ProtectedRoute>
                  <Suppliers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchase-orders"
              element={
                <ProtectedRoute>
                  <PurchaseOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchase-receptions"
              element={
                <ProtectedRoute>
                  <PurchaseReceptions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchase-history"
              element={
                <ProtectedRoute>
                  <PurchaseHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/table-management"
              element={
                <ProtectedRoute>
                  <TableManagement standalone={true} />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<RootRedirect />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

