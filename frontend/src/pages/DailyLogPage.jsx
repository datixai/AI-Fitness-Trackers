// src/pages/DailyLogPage.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Activity, Heart, Smile, AlertCircle, CheckCircle } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Alert from '../components/Alert';

export default function DailyLogPage() {
  const navigate = useNavigate();
  const { post, isLoading, error } = useApi();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    const today = new Date().toISOString().split('T')[0];
    
    const result = await post('/daily-logs/submit', {
      log_date: today,
      weight_kg: parseFloat(data.weight_kg),
      heart_rate_resting: parseInt(data.heart_rate_resting),
      heart_rate_exercise: parseInt(data.heart_rate_exercise),
      body_temp: parseFloat(data.body_temp),
      mood: parseInt(data.mood),
      stress: parseInt(data.stress),
      energy: parseInt(data.energy),
      sleep_hours: parseFloat(data.sleep_hours),
      sleep_quality: parseInt(data.sleep_quality),
      hunger: parseInt(data.hunger)
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Daily Log</h1>
        <p className="text-gray-600">Record today's metrics and progress</p>
      </div>

      {/* Success Alert */}
      {success && (
        <Alert
          type="success"
          title="Logged Successfully"
          message="Your daily metrics have been recorded. Redirecting..."
          dismissible={false}
        />
      )}

      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          title="Error"
          message={error}
          dismissible={true}
        />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        {/* Physical Metrics */}
        <fieldset className="border-b pb-6">
          <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
            <Heart className="text-primary" />
            Physical Metrics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Weight (kg)"
              type="number"
              step="0.1"
              placeholder="75.5"
              error={errors.weight_kg?.message}
              required
              {...register('weight_kg', {
                required: 'Weight is required',
                min: { value: 30, message: 'Weight must be at least 30 kg' },
                max: { value: 300, message: 'Invalid weight' }
              })}
            />

            <FormInput
              label="Resting Heart Rate (bpm)"
              type="number"
              placeholder="70"
              error={errors.heart_rate_resting?.message}
              {...register('heart_rate_resting', {
                min: { value: 40, message: 'Invalid heart rate' },
                max: { value: 120, message: 'Invalid heart rate' }
              })}
            />

            <FormInput
              label="Exercise Heart Rate (bpm)"
              type="number"
              placeholder="140"
              error={errors.heart_rate_exercise?.message}
              {...register('heart_rate_exercise', {
                min: { value: 80, message: 'Invalid heart rate' },
                max: { value: 220, message: 'Invalid heart rate' }
              })}
            />

            <FormInput
              label="Body Temperature (°C)"
              type="number"
              step="0.1"
              placeholder="36.8"
              error={errors.body_temp?.message}
              {...register('body_temp', {
                min: { value: 35, message: 'Invalid temperature' },
                max: { value: 40, message: 'Invalid temperature' }
              })}
            />
          </div>
        </fieldset>

        {/* Sleep */}
        <fieldset className="border-b pb-6">
          <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
            <Activity className="text-primary" />
            Sleep
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Sleep Hours"
              type="number"
              step="0.5"
              placeholder="8"
              error={errors.sleep_hours?.message}
              {...register('sleep_hours', {
                min: { value: 0, message: 'Invalid value' },
                max: { value: 14, message: 'Invalid value' }
              })}
            />

            <div>
              <label className="label">Sleep Quality (1-10)</label>
              <div className="flex gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <label key={i + 1} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value={i + 1}
                      {...register('sleep_quality', { required: true })}
                      className="mr-1"
                    />
                    <span className="text-sm">{i + 1}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </fieldset>

        {/* Mental/Physical State */}
        <fieldset>
          <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
            <Smile className="text-primary" />
            Mental & Physical State
          </h2>

          <div className="space-y-6">
            {/* Mood */}
            <div>
              <label className="label">Mood (1-10)</label>
              <div className="flex gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <label key={i + 1} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value={i + 1}
                      {...register('mood', { required: true })}
                      className="mr-1"
                    />
                    <span className="text-sm">{i + 1}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stress */}
            <div>
              <label className="label">Stress (1-10)</label>
              <div className="flex gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <label key={i + 1} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value={i + 1}
                      {...register('stress', { required: true })}
                      className="mr-1"
                    />
                    <span className="text-sm">{i + 1}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Energy */}
            <div>
              <label className="label">Energy (1-10)</label>
              <div className="flex gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <label key={i + 1} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value={i + 1}
                      {...register('energy', { required: true })}
                      className="mr-1"
                    />
                    <span className="text-sm">{i + 1}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hunger */}
            <div>
              <label className="label">Hunger (1-10)</label>
              <div className="flex gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <label key={i + 1} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value={i + 1}
                      {...register('hunger', { required: true })}
                      className="mr-1"
                    />
                    <span className="text-sm">{i + 1}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </fieldset>

        {/* Info */}
        <div className="bg-info bg-opacity-10 border-l-4 border-info p-4">
          <p className="text-sm text-dark flex items-start gap-2">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span>You can only submit this form once per day. Your data helps your coach track your progress and adjust your plan accordingly.</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            fullWidth
            type="submit"
            isLoading={isLoading}
          >
            Log Metrics
          </Button>
        </div>
      </form>
    </div>
  );
}
