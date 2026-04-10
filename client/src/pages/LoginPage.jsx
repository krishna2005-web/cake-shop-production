// ===========================================
// Login Page
// ===========================================
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { isAuthenticated, demoLogin, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    const result = await demoLogin(name.trim(), email.trim());
    if (result.success) {
      toast.success('Welcome! 🎂');
      navigate('/');
    } else {
      toast.error(result.message || 'Login failed');
    }
    setLoading(false);
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    const result = await demoLogin('Demo User', 'demo@sweetdelights.com');
    if (result.success) {
      toast.success('Welcome, Demo User! 🎂');
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      background: 'var(--gradient-hero)',
    }}>
      <div className="card animate-fade-in-up" style={{
        maxWidth: 440,
        width: '100%',
        padding: '40px 36px',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎂</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>
            Welcome <span className="gradient-text">Back!</span>
          </h1>
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
            Sign in to order your favorite cakes
          </p>
        </div>

        {/* Google Login */}
        <button
          onClick={loginWithGoogle}
          style={{
            width: '100%',
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--color-border)',
            background: 'var(--color-bg-card)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontWeight: 600,
            fontSize: '0.95rem',
            color: 'var(--color-text)',
            transition: 'all 0.2s',
            marginBottom: 20,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          margin: '20px 0',
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          <span style={{ color: 'var(--color-text-light)', fontSize: '0.8rem', fontWeight: 500 }}>
            or use demo login
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
        </div>

        {/* Demo Login Form */}
        <form onSubmit={handleDemoLogin} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}>
          <div>
            <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: 6 }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="form-input"
              required
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="form-input"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          <button
            onClick={handleQuickLogin}
            disabled={loading}
            style={{
              padding: '10px',
              background: 'rgba(124, 58, 237, 0.08)',
              color: 'var(--color-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            ⚡ Demo Login
          </button>

          <button
            onClick={async () => {
              setLoading(true);
              const result = await demoLogin('Owner Admin', 'admin@sweetdelights.com');
              if (result.success) {
                toast.success('Welcome, Admin! 👑');
                navigate('/admin');
              }
              setLoading(false);
            }}
            disabled={loading}
            style={{
              padding: '10px',
              background: 'rgba(239, 68, 68, 0.08)',
              color: 'var(--color-danger, #ef4444)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            👑 Admin Login
          </button>
        </div>

        <p style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--color-text-light)',
          marginTop: 20,
          lineHeight: 1.5,
        }}>
          Demo mode: No real credentials needed. 
          Use any name & email to create a test account.
        </p>
      </div>
    </div>
  );
}
