import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './pages/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ClientDashboard from './pages/ClientDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Hidden admin login - only accessible if you know the URL */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* Protected client */}
            <Route path="/dashboard" element={
              <ProtectedRoute role="client">
                <ClientDashboard />
              </ProtectedRoute>
            } />

            {/* Protected admin */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}
