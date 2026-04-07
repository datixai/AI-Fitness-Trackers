// src/components/FormInput.jsx
import { AlertCircle } from 'lucide-react';

export default function FormInput({
  label,
  type = 'text',
  placeholder,
  error,
  required = false,
  ...rest
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="label">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`input-field ${error ? 'border-danger focus:ring-danger' : ''}`}
        {...rest}
      />
      {error && (
        <div className="error-message flex items-center gap-1 mt-1">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
