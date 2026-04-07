// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { Activity, Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-light flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Activity className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-primary">AM CULTURISMO</h1>
        </div>

        {/* Error */}
        <div className="mb-8">
          <div className="flex items-center justify-center w-24 h-24 bg-danger bg-opacity-10 rounded-full mx-auto mb-6">
            <AlertCircle className="text-danger" size={48} />
          </div>

          <h2 className="text-6xl font-bold text-dark mb-2">404</h2>
          <h3 className="text-2xl font-bold text-dark mb-4">Page Not Found</h3>

          <p className="text-gray-600 text-lg">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full btn btn-primary py-3"
          >
            <Home size={20} />
            Back to Home
          </Link>

          <Link
            to="/login"
            className="block w-full btn btn-secondary py-3"
          >
            Sign In
          </Link>
        </div>

        {/* Footer */}
        <p className="text-gray-600 mt-8 text-sm">
          If you think this is a mistake, please <a href="mailto:support@amculturismo.com" className="text-primary hover:text-secondary">contact support</a>.
        </p>
      </div>
    </div>
  );
}
