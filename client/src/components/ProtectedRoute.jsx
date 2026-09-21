import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="flex items-center space-x-3 text-brand-600 animate-pulse mb-4">
          <div className="p-3 bg-brand-100 rounded-2xl">
            <Car className="w-8 h-8 text-brand-600 animate-bounce" />
          </div>
          <span className="text-xl font-bold tracking-tight">CarPool Connect</span>
        </div>
        <p className="text-slate-500 text-sm">Authenticating your journey...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
