// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Activity, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const { forgotPassword, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [apiError, setApiError] = useState('');

  const onSubmit = async (data) => {
    setApiError('');
    setEmail(data.email);

    const result = await forgotPassword(data.email);

    if (result.success) {
      setSubmitted(true);
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
          <h2 className="text-2xl font-bold text-dark">Reset Password</h2>
          <p className="text-gray-600 mt-2">We'll help you regain access to your account</p>
        </div>

        {/* Card */}
        <div className="card shadow-lg">
          {!submitted ? (
            <>
              {/* Error Alert */}
              {apiError && (
                <div className="alert-danger mb-6 flex items-center gap-3">
                  <AlertCircle size={20} />
                  <span>{apiError}</span>
                </div>
              )}

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

                {/* Info */}
                <div className="bg-info bg-opacity-10 border-l-4 border-info p-4">
                  <p className="text-sm text-dark">
                    Enter your email address and we'll send you a link to reset your password.
                    The link will expire in 1 hour.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn btn-primary py-3 mt-6"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center py-8">
                <div className="flex items-center justify-center w-16 h-16 bg-success bg-opacity-10 rounded-full mx-auto mb-4">
                  <CheckCircle className="text-success" size={32} />
                </div>

                <h3 className="text-xl font-bold text-dark mb-2">Check Your Email</h3>

                <div className="bg-success bg-opacity-10 border-l-4 border-success p-4 mb-6 text-left">
                  <p className="text-sm text-dark">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-dark mt-2">
                    The link will expire in 1 hour. Check your spam folder if you don't see it.
                  </p>
                </div>

                <p className="text-gray-600 mb-6">
                  Click the link in the email to create a new password.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="w-full btn btn-secondary py-2"
                  >
                    Try Another Email
                  </button>

                  <Link
                    to="/login"
                    className="block text-center text-primary hover:text-secondary font-medium"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* Divider */}
          {!submitted && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-600">Remember your password?</span>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full text-center btn btn-secondary py-2"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="block text-center text-primary hover:text-secondary font-medium"
                >
                  Create New Account
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
