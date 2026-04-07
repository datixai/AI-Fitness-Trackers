import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#D2691E', fontFamily: 'Inter, sans-serif', fontSize: 16,
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin' : '/login'} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}