// src/pages/AdminLogin.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Activity, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [apiError, setApiError] = useState('');

  const onSubmit = async (data) => {
    setApiError('');
    const result = await login(data.email, data.password, 'admin');

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setApiError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <Lock className="text-primary" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-white">AM CULTURISMO</h1>
          </div>
          <h2 className="text-2xl font-bold text-white">Coach Login</h2>
          <p className="text-primary mt-2">Admin Dashboard Access</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Alert */}
          {(apiError || error) && (
            <div className="alert-danger mb-6 flex items-center gap-3">
              <AlertCircle size={20} />
              <span>{apiError || error}</span>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-primary bg-opacity-10 border-l-4 border-primary p-4 mb-6">
            <p className="text-sm text-dark">
              <strong>Secure Admin Access</strong><br/>
              This area is restricted to authorized coaches only.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="label">Admin Email</label>
              <input
                type="email"
                placeholder="coach@example.com"
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
              className="w-full btn bg-primary text-white py-3 mt-6"
            >
              {isLoading ? 'Logging in...' : 'Admin Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-600">Need access?</span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full text-center btn btn-secondary py-2"
            >
              Client Login
            </Link>

            <Link
              to="/forgot-password"
              className="block text-center text-primary hover:text-secondary font-medium"
            >
              Forgot Password?
            </Link>

            <a
              href="mailto:support@amculturismo.com"
              className="block text-center text-gray-600 hover:text-dark font-medium text-sm"
            >
              Contact Support
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white mt-8 text-sm">
          Secure area - All access is logged and monitored
        </p>
      </div>
    </div>
  );
}
