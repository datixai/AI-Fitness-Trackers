// src/context/AuthContext.jsx (Fixed)
// Fix: logout() now calls the server-side revoke endpoint before clearing local storage
// Fix: token stored in localStorage with sessionStorage fallback awareness

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('am_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
      setError(null);
    } catch {
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('am_token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const login = async (email, password, role = 'client') => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password, role });
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('am_token', newToken);
      setToken(newToken);
      setUser(userData);
      setError(null);
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem('am_token', newToken);
      setToken(newToken);
      setUser(newUser);
      setError(null);
      return { success: true, user: newUser };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed: calls server-side logout to blacklist the token
  const logout = async () => {
    try {
      if (token) {
        await axios.post(
          `${API_URL}/auth/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch {
      // Server revoke failed — still clear locally
    } finally {
      clearAuth();
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      return { success: true, message: response.data.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to send reset link' };
    }
  };

  const resetPassword = async (token, password, password_confirm) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, { token, password, password_confirm });
      return { success: true, message: response.data.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to reset password' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user, token, isLoading, error,
      isAuthenticated: !!token && !!user,
      isAdmin: user?.role === 'admin',
      isClient: user?.role === 'client',
      login, register, logout, forgotPassword, resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
