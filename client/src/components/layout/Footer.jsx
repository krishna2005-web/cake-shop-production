// ===========================================
// Footer Component
// ===========================================
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--color-bg-card)',
      borderTop: '1px solid var(--color-border)',
      marginTop: 80,
    }}>
      <div className="page-container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 40,
        padding: '60px 24px',
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 28 }}>🎂</span>
            <span className="gradient-text" style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              Sweet Delights
            </span>
          </div>
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Handcrafted cakes made with love, premium ingredients, and a sprinkle of magic. 
            Making your celebrations sweeter since 2020.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { to: '/', label: 'Home' },
              { to: '/cakes', label: 'All Cakes' },
              { to: '/cart', label: 'Cart' },
              { to: '/orders', label: 'My Orders' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  textDecoration: 'none',
                  color: 'var(--color-text-light)',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Categories</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Birthday Cakes', 'Wedding Cakes', 'Cupcakes', 'Custom Cakes', 'Pastries'].map((cat) => (
              <Link
                key={cat}
                to={`/cakes?category=${cat.split(' ')[0].toLowerCase()}`}
                style={{
                  textDecoration: 'none',
                  color: 'var(--color-text-light)',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s',
                }}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Contact Us</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
              <HiOutlineLocationMarker size={18} style={{ color: 'var(--color-primary)' }} />
              123 Baker Street, Sweet City
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
              <HiOutlinePhone size={18} style={{ color: 'var(--color-primary)' }} />
              +1 (555) 123-4567
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
              <HiOutlineMail size={18} style={{ color: 'var(--color-primary)' }} />
              hello@sweetdelights.com
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid var(--color-border)',
        padding: '20px 24px',
        textAlign: 'center',
        color: 'var(--color-text-light)',
        fontSize: '0.8rem',
      }}>
        <p>© 2024 Sweet Delights Bakery. Made with 🤍 and 🍰</p>
      </div>
    </footer>
  );
}
