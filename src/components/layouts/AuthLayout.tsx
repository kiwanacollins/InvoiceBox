import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { BarChart4 } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const { user } = useAuthStore();

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Brand info */}
      <div className="hidden md:flex md:w-2/5 bg-primary p-8 text-white flex-col justify-between">
        <div className="animate-fade-in">
          <div className="flex items-center mb-8">
            <BarChart4 className="w-10 h-10 text-secondary mr-2" />
            <h1 className="text-2xl font-bold">InvoiceBox</h1>
          </div>
          
          <div className="mt-10">
            <h2 className="text-3xl font-bold mb-6">Streamline your invoicing process</h2>
            <p className="text-gray-100 mb-6">
              Used by over 400 providers and 170 purchasers to manage 12,000+ invoices across 50+ industries.
            </p>
            
            <div className="space-y-4 mt-10">
              <div className="flex items-center">
                <div className="bg-primary-500 p-2 rounded-full mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p>Create and send professional invoices in seconds</p>
              </div>
              
              <div className="flex items-center">
                <div className="bg-primary-500 p-2 rounded-full mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p>Track payments and manage your cash flow</p>
              </div>
              
              <div className="flex items-center">
                <div className="bg-primary-500 p-2 rounded-full mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p>Multi-currency support for global business</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-300 mt-8">
          © 2025 InvoiceBox. All rights reserved.
        </div>
      </div>
      
      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-in">
          <div className="md:hidden flex items-center justify-center mb-8">
            <BarChart4 className="w-10 h-10 text-primary mr-2" />
            <h1 className="text-2xl font-bold text-primary">InvoiceBox</h1>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;