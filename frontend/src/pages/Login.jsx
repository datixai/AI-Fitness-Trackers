// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Activity, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [apiError, setApiError] = useState('');

  const onSubmit = async (data) => {
    setApiError('');
    const result = await login(data.email, data.password, 'client');

    if (result.success) {
      navigate('/dashboard');
    } else {
      setApiError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-light flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="text-white" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-primary">AM CULTURISMO</h1>
          </div>
          <h2 className="text-2xl font-bold text-dark">Client Login</h2>
          <p className="text-gray-600 mt-2">Welcome back to your fitness journey</p>
        </div>

        {/* Card */}
        <div className="card shadow-lg">
          {/* Error Alert */}
          {(apiError || error) && (
            <div className="alert-danger mb-6 flex items-center gap-3">
              <AlertCircle size={20} />
              <span>{apiError || error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="input-field"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email format'
                  }
                })}
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
              />
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary py-3 mt-6"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-600">Don't have an account?</span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <Link
              to="/register"
              className="block w-full text-center btn btn-secondary py-2"
            >
              Create Account
            </Link>

            <Link
              to="/forgot-password"
              className="block text-center text-primary hover:text-secondary font-medium"
            >
              Forgot Password?
            </Link>

            <Link
              to="/admin"
              className="block text-center text-gray-600 hover:text-dark font-medium"
            >
              Admin Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-8 text-sm">
          By logging in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
