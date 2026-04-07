// src/components/Alert.jsx
import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export default function Alert({
  type = 'info',
  title,
  message,
  dismissible = true,
  onDismiss
}) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const styles = {
    success: {
      container: 'alert-success',
      icon: CheckCircle
    },
    error: {
      container: 'alert-danger',
      icon: AlertCircle
    },
    warning: {
      container: 'alert-warning',
      icon: AlertTriangle
    },
    info: {
      container: 'alert-info',
      icon: InfoIcon
    }
  };

  const config = styles[type];
  const Icon = config.icon;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div className={`${config.container} flex items-start gap-3 mb-4`}>
      <Icon size={20} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {message && <p className="text-sm">{message}</p>}
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 hover:opacity-70"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
