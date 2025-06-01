import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Layouts
import AuthLayout from './components/layouts/AuthLayout';
import DashboardLayout from './components/layouts/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import ProviderDashboard from './pages/dashboard/ProviderDashboard';
import PurchaserDashboard from './pages/dashboard/PurchaserDashboard';

// Invoice Pages
import InvoiceList from './pages/invoices/InvoiceList';
import InvoiceDetails from './pages/invoices/InvoiceDetails';
import CreateInvoice from './pages/invoices/CreateInvoice';

// Account Pages
import Profile from './pages/account/Profile';


function App() {
  const { user, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  };

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={
          user?.role === 'provider' 
            ? <ProviderDashboard /> 
            : <PurchaserDashboard />
        } />
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/invoices/:id" element={<InvoiceDetails />} />
        <Route path="/invoices/create" element={<CreateInvoice />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Redirect root to dashboard or login */}
      <Route 
        path="/" 
        element={
          user 
            ? <Navigate to="/dashboard\" replace /> 
            : <Navigate to="/login" replace />
        } 
      />

      {/* Catch all unmatched routes */}
      <Route path="*" element={<Navigate to="/\" replace />} />
    </Routes>
  );
}

export default App;