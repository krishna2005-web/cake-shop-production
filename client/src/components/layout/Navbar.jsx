// ===========================================
// Navbar Component
// ===========================================
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { HiOutlineShoppingCart, HiOutlineUser, HiOutlineSun, HiOutlineMoon, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/cakes', label: 'Our Cakes' },
    { to: '/orders', label: 'My Orders' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '0 24px',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 72,
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 32 }}>🎂</span>
          <span className="gradient-text" style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            letterSpacing: '-0.5px',
          }}>
            Sweet Delights
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }} className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                textDecoration: 'none',
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: isActive(link.to) ? 'var(--color-primary)' : 'var(--color-text)',
                background: isActive(link.to) ? 'rgba(225, 29, 115, 0.08)' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" style={{
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
            }}>
              👑 Dashboard
            </Link>
          )}
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              borderRadius: '50%',
              color: 'var(--color-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
            aria-label="Toggle theme"
          >
            {isDark ? <HiOutlineSun size={22} /> : <HiOutlineMoon size={22} />}
          </button>

          {/* Cart */}
          <Link to="/cart" style={{
            position: 'relative',
            textDecoration: 'none',
            color: 'var(--color-text)',
            padding: 8,
            display: 'flex',
            alignItems: 'center',
          }}>
            <HiOutlineShoppingCart size={24} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: 'var(--gradient-primary)',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: 700,
                width: 18,
                height: 18,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth Button */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'transparent',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '6px 14px 6px 6px',
                  cursor: 'pointer',
                  color: 'var(--color-text)',
                  transition: 'all 0.2s',
                }}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <HiOutlineUser size={20} />
                )}
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name?.split(' ')[0]}</span>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div
                  className="card animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 8,
                    padding: 8,
                    minWidth: 200,
                    zIndex: 1001,
                  }}
                >
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{user?.email}</div>
                  </div>
                  <Link
                    to="/orders"
                    onClick={() => setProfileOpen(false)}
                    style={{
                      display: 'block',
                      padding: '10px 16px',
                      textDecoration: 'none',
                      color: 'var(--color-text)',
                      fontSize: '0.85rem',
                      borderRadius: 8,
                      transition: 'background 0.2s',
                    }}
                  >
                    📦 My Orders
                  </Link>
                  <button
                    onClick={() => { logout(); setProfileOpen(false); }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 16px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-error)',
                      fontSize: '0.85rem',
                      borderRadius: 8,
                      transition: 'background 0.2s',
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text)',
              padding: 4,
            }}
          >
            {mobileOpen ? <HiOutlineX size={26} /> : <HiOutlineMenu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="mobile-nav animate-fade-in"
          style={{
            padding: '16px 0',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                padding: '12px 16px',
                textDecoration: 'none',
                color: isActive(link.to) ? 'var(--color-primary)' : 'var(--color-text)',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                padding: '12px 16px',
                textDecoration: 'none',
                color: 'var(--color-primary)',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
              }}
            >
              👑 Dashboard
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
