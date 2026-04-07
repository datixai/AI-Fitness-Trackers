// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [apiError, setApiError] = useState('');
  const [step, setStep] = useState(1);
  const password = watch('password');

  const onSubmit = async (data) => {
    setApiError('');

    const result = await registerUser({
      email: data.email,
      password: data.password,
      password_confirm: data.password_confirm,
      first_name: data.first_name,
      last_name: data.last_name,
      height_cm: data.height_cm ? parseFloat(data.height_cm) : null,
      initial_weight_kg: data.initial_weight_kg ? parseFloat(data.initial_weight_kg) : null,
      gender: data.gender || null,
      birth_date: data.birth_date || null,
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setApiError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-light flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="text-white" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-primary">AM CULTURISMO</h1>
          </div>
          <h2 className="text-2xl font-bold text-dark">Create Account</h2>
          <p className="text-gray-600 mt-2">Step {step} of 2 - Let's get started</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-300'}`}></div>
          <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`}></div>
        </div>

        {/* Card */}
        <div className="card shadow-lg">
          {/* Error Alert */}
          {apiError && (
            <div className="alert-danger mb-6 flex items-center gap-3">
              <AlertCircle size={20} />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <>
                {/* First Name */}
                <div>
                  <label className="label">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    className="input-field"
                    {...register('first_name', {
                      required: 'First name is required'
                    })}
                  />
                  {errors.first_name && (
                    <p className="error-message">{errors.first_name.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="label">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="input-field"
                    {...register('last_name', {
                      required: 'Last name is required'
                    })}
                  />
                  {errors.last_name && (
                    <p className="error-message">{errors.last_name.message}</p>
                  )}
                </div>

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

                {/* Gender */}
                <div>
                  <label className="label">Gender (Optional)</label>
                  <select
                    className="input-field"
                    {...register('gender')}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Birth Date */}
                <div>
                  <label className="label">Birth Date (Optional)</label>
                  <input
                    type="date"
                    className="input-field"
                    {...register('birth_date')}
                  />
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full btn btn-primary py-3 mt-6"
                >
                  Next
                </button>
              </>
            )}

            {/* Step 2: Password & Measurements */}
            {step === 2 && (
              <>
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
                  <p className="text-sm text-gray-600 mt-1">
                    Minimum 8 characters required
                  </p>
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

                {/* Height */}
                <div>
                  <label className="label">Height (cm) - Optional</label>
                  <input
                    type="number"
                    placeholder="180"
                    className="input-field"
                    {...register('height_cm')}
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="label">Weight (kg) - Optional</label>
                  <input
                    type="number"
                    placeholder="75"
                    step="0.1"
                    className="input-field"
                    {...register('initial_weight_kg')}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 btn btn-secondary py-3"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 btn btn-primary py-3"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-600">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="block w-full text-center btn btn-secondary py-2"
          >
            Sign In
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-8 text-sm">
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
