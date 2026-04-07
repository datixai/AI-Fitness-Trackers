import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
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
    const result = await login(email, password, 'client');
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Email o password non corretti');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Left panel - image */}
      <div style={{
        flex: 1,
        display: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
        className="login-left"
      >
        <img
          src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=900&q=80"
          alt="athlete"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(139,69,19,0.4) 100%)',
        }} />
        <div style={{ position: 'absolute', bottom: 48, left: 48, right: 48 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
            "Il cambiamento inizia con una decisione."
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>— AM Culturismo</div>
        </div>
      </div>

      {/* Right panel - form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        minWidth: 0,
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{
              width: 40, height: 40,
              background: 'linear-gradient(135deg,#8B4513,#D2691E)',
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 16, color: '#fff',
            }}>AM</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
              AM <span style={{ color: '#D2691E' }}>CULTURISMO</span>
            </span>
          </Link>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
            Bentornato 👋
          </h1>
          <p style={{ color: '#666', fontSize: 14, marginBottom: 32 }}>
            Accedi al tuo account per continuare il tuo percorso
          </p>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.1)',
              border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: 8, padding: '12px 16px',
              color: '#f87171', fontSize: 14, marginBottom: 20,
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#888', fontSize: 13, display: 'block', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="la-tua@email.com"
                style={{
                  width: '100%', padding: '12px 14px',
                  background: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: '#fff', fontSize: 15,
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color .2s',
                }}
                onFocus={e => e.target.style.borderColor = '#D2691E'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ color: '#888', fontSize: 13 }}>Password</label>
                <Link to="/forgot-password" style={{ color: '#D2691E', fontSize: 12, textDecoration: 'none' }}>
                  Password dimenticata?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '12px 14px',
                  background: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: '#fff', fontSize: 15,
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color .2s',
                }}
                onFocus={e => e.target.style.borderColor = '#D2691E'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? '#555' : 'linear-gradient(135deg,#8B4513,#D2691E)',
                color: '#fff', border: 'none', borderRadius: 8,
                fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity .2s',
              }}
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: '#444', fontSize: 12 }}>oppure</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Register link */}
          <div style={{
            background: '#141414',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '16px 20px',
            textAlign: 'center',
          }}>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
              Non hai ancora un account?
            </p>
            <Link to="/register" style={{
              display: 'block', padding: '11px',
              border: '1px solid #D2691E', color: '#D2691E',
              borderRadius: 8, textDecoration: 'none',
              fontSize: 14, fontWeight: 600, transition: 'all .2s',
            }}
              onMouseOver={e => { e.currentTarget.style.background = '#D2691E'; e.currentTarget.style.color = '#fff'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#D2691E'; }}
            >
              Crea il tuo account gratuito →
            </Link>
          </div>

          <p style={{ color: '#333', fontSize: 12, textAlign: 'center', marginTop: 24 }}>
            Accedendo accetti i nostri Termini di Servizio e la Privacy Policy
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .login-left { display: block !important; }
        }
      `}</style>
    </div>
  );
}