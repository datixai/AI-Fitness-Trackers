// src/pages/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [apiError, setApiError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const password = watch('password');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setApiError('Invalid reset link. Please request a new one.');
    }
  }, [token]);

  const onSubmit = async (data) => {
    setApiError('');

    const result = await resetPassword(token, data.password, data.password_confirm);

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
          <h2 className="text-2xl font-bold text-dark">Create New Password</h2>
          <p className="text-gray-600 mt-2">Secure your account with a new password</p>
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

              {token && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Password */}
                  <div>
                    <label className="label">New Password</label>
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
                    <div className="mt-2 text-sm text-gray-600">
                      <p>✓ At least 8 characters</p>
                      <p>✓ Can contain letters, numbers, and symbols</p>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="label">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input-field"
                      {...register('password_confirm', {
                        required: 'Please confirm password',
                        validate: value => value === password || 'Passwords do not match'
                      })}
                    />
                    {errors.password_confirm && (
                      <p className="error-message">{errors.password_confirm.message}</p>
                    )}
                  </div>

                  {/* Info */}
                  <div className="bg-info bg-opacity-10 border-l-4 border-info p-4">
                    <p className="text-sm text-dark">
                      Make sure to use a strong password that you haven't used before.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn btn-primary py-3 mt-6"
                  >
                    {isLoading ? 'Updating...' : 'Reset Password'}
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center py-8">
                <div className="flex items-center justify-center w-16 h-16 bg-success bg-opacity-10 rounded-full mx-auto mb-4">
                  <CheckCircle className="text-success" size={32} />
                </div>

                <h3 className="text-xl font-bold text-dark mb-2">Password Reset Successful</h3>

                <div className="bg-success bg-opacity-10 border-l-4 border-success p-4 mb-6">
                  <p className="text-sm text-dark">
                    Your password has been successfully reset. You can now login with your new password.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="w-full block text-center btn btn-primary py-3"
                >
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-8 text-sm">
          This link will expire in 1 hour for security reasons
        </p>
      </div>
    </div>
  );
}
