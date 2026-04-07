// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

export const useApi = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (endpoint, method = 'GET', data = null, options = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const config = {
          method,
          url: `${API_URL}${endpoint}`,
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
          },
          ...options,
        };

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
          config.data = data;
        }

        const response = await axios(config);
        setLoading(false);
        return { success: true, data: response.data };
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Request failed';
        setError(errorMsg);
        setLoading(false);
        return { success: false, error: errorMsg };
      }
    },
    [token]
  );

  // Convenience methods
  const get = useCallback((endpoint, options = {}) => request(endpoint, 'GET', null, options), [request]);
  const post = useCallback((endpoint, data, options = {}) => request(endpoint, 'POST', data, options), [request]);
  const put = useCallback((endpoint, data, options = {}) => request(endpoint, 'PUT', data, options), [request]);
  const del = useCallback((endpoint, options = {}) => request(endpoint, 'DELETE', null, options), [request]);

  return { get, post, put, del, isLoading, error };
};
