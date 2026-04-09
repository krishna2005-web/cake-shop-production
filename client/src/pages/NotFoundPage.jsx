// ===========================================
// 404 Not Found Page
// ===========================================
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <div className="animate-fade-in-up">
        <div className="animate-float" style={{ fontSize: 80, marginBottom: 20 }}>🎂</div>
        <h1 style={{ fontSize: '5rem', fontWeight: 900, marginBottom: 0 }}>
          <span className="gradient-text">404</span>
        </h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>
          Page Not Found
        </h2>
        <p style={{
          color: 'var(--color-text-light)',
          marginBottom: 32,
          maxWidth: 400,
          margin: '0 auto 32px',
          lineHeight: 1.6,
        }}>
          Oops! Looks like this cake page doesn't exist. 
          But don't worry, we have plenty of delicious options waiting for you!
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn-primary">🏠 Go Home</Link>
          <Link to="/cakes" className="btn-secondary">🎂 Browse Cakes</Link>
        </div>
      </div>
    </div>
  );
}
