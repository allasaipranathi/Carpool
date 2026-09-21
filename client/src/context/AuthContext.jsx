import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister, getCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('carpool_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('carpool_token') || null);
  const [loading, setLoading] = useState(true);

  // Synchronize authentication state on initial load
  useEffect(() => {
    const verifyAuth = async () => {
      const savedToken = localStorage.getItem('carpool_token');
      if (savedToken) {
        try {
          const data = await getCurrentUser();
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('carpool_user', JSON.stringify(data.user));
          } else {
            logout();
          }
        } catch (error) {
          console.warn('Session verification failed, logging out:', error.message);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  // Login handler
  const login = async (credentials) => {
    const data = await apiLogin(credentials);
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('carpool_token', data.token);
      localStorage.setItem('carpool_user', JSON.stringify(data.user));
      return data;
    }
    throw new Error(data.message || 'Login failed');
  };

  // Register handler
  const register = async (userData) => {
    const data = await apiRegister(userData);
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('carpool_token', data.token);
      localStorage.setItem('carpool_user', JSON.stringify(data.user));
      return data;
    }
    throw new Error(data.message || 'Registration failed');
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('carpool_token');
    localStorage.removeItem('carpool_user');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
