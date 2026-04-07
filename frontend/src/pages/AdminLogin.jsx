import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password, 'admin');
    setLoading(false);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Accesso non autorizzato');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        background: '#141414', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: 48, width: '100%', maxWidth: 400,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 52, height: 52, background: 'linear-gradient(135deg,#8B4513,#D2691E)',
            borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 22, color: '#fff', margin: '0 auto 16px',
          }}>AM</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Admin Panel</h1>
          <p style={{ color: '#555', fontSize: 14 }}>Accesso riservato</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
            borderRadius: 8, padding: '12px 16px', marginBottom: 20,
            color: '#f87171', fontSize: 14,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#888', fontSize: 13, display: 'block', marginBottom: 6 }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{
                width: '100%', padding: '12px 14px', background: '#1e1e1e',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ color: '#888', fontSize: 13, display: 'block', marginBottom: 6 }}>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{
                width: '100%', padding: '12px 14px', background: '#1e1e1e',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', background: 'linear-gradient(135deg,#8B4513,#D2691E)',
            color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Accesso...' : 'Accedi al Pannello'}
          </button>
        </form>
      </div>
    </div>
  );
}
