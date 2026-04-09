// ===========================================
// Loader Component
// ===========================================
export default function Loader({ size = 40, fullPage = false }) {
  if (fullPage) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div className="spinner" style={{ width: size, height: size }} />
        <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Loading...</p>
      </div>
    );
  }

  return <div className="spinner" style={{ width: size, height: size, margin: '0 auto' }} />;
}
