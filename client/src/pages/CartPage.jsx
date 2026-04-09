// ===========================================
// Cart Page
// ===========================================
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import { HiOutlineTrash, HiOutlineShoppingCart, HiOutlineArrowRight } from 'react-icons/hi';

export default function CartPage() {
  const { cart, cartCount, cartTotal, removeItem, updateItem, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="page-container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>Sign in to view your cart</h2>
        <p style={{ color: 'var(--color-text-light)', marginBottom: 24 }}>
          Please log in to add items and manage your cart
        </p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  if (loading) return <Loader fullPage />;

  if (cartCount === 0) {
    return (
      <div className="page-container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div className="animate-bounce-in" style={{ fontSize: 80, marginBottom: 16 }}>🛒</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>Your cart is empty</h2>
        <p style={{ color: 'var(--color-text-light)', marginBottom: 24 }}>
          Time to add some delicious cakes!
        </p>
        <Link to="/cakes" className="btn-primary">
          🎂 Browse Cakes
        </Link>
      </div>
    );
  }

  const deliveryFee = cartTotal >= 999 ? 0 : 49;

  return (
    <div className="page-container" style={{ padding: '40px 24px 80px' }}>
      <h1 className="animate-fade-in-up" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 32 }}>
        🛒 Your <span className="gradient-text">Cart</span>
        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', fontWeight: 500, marginLeft: 12 }}>
          ({cartCount} items)
        </span>
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: 32,
        alignItems: 'start',
      }} className="cart-grid">
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cart.items.map((item, i) => (
            <div
              key={item._id}
              className={`card animate-fade-in-up delay-${(i % 3 + 1) * 100}`}
              style={{
                display: 'flex',
                gap: 20,
                padding: 20,
              }}
            >
              {/* Image */}
              <Link to={`/cakes/${item.cakeId?._id || item.cakeId}`}>
                <img
                  src={item.cakeId?.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200'}
                  alt={item.cakeId?.name || 'Cake'}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 'var(--radius-md)',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
              </Link>

              {/* Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
                  {item.cakeId?.name || 'Cake'}
                </h3>
                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-text-light)',
                  marginBottom: 8,
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                }}>
                  <span>📐 {item.size}</span>
                  <span>🎨 {item.flavor}</span>
                  {item.message && <span>✍️ "{item.message}"</span>}
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => {
                      if (item.quantity <= 1) {
                        removeItem(item._id);
                      } else {
                        updateItem(item._id, { quantity: item.quantity - 1 });
                      }
                    }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-bg)',
                      cursor: 'pointer',
                      fontWeight: 700,
                      color: 'var(--color-text)',
                      fontSize: '0.9rem',
                    }}
                  >
                    −
                  </button>
                  <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateItem(item._id, { quantity: item.quantity + 1 })}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-bg)',
                      cursor: 'pointer',
                      fontWeight: 700,
                      color: 'var(--color-text)',
                      fontSize: '0.9rem',
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price & Remove */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: 'var(--color-primary)',
                  marginBottom: 8,
                }}>
                  ₹{Math.round(item.price)}
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: 'none',
                    color: 'var(--color-error)',
                    cursor: 'pointer',
                    padding: 6,
                    borderRadius: 6,
                    transition: 'background 0.2s',
                  }}
                >
                  <HiOutlineTrash size={18} />
                </button>
              </div>
            </div>
          ))}

          {/* Clear Cart */}
          <button
            onClick={clearCart}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '1px solid var(--color-error)',
              color: 'var(--color-error)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              alignSelf: 'flex-start',
              transition: 'all 0.2s',
            }}
          >
            🗑️ Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="card" style={{ padding: 28, position: 'sticky', top: 96 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 20 }}>
            📋 Order Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--color-text-light)' }}>Subtotal ({cartCount} items)</span>
              <span style={{ fontWeight: 600 }}>₹{Math.round(cartTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--color-text-light)' }}>Delivery</span>
              <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
            <div style={{
              borderTop: '2px solid var(--color-border)',
              paddingTop: 12,
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.1rem',
              fontWeight: 800,
            }}>
              <span>Total</span>
              <span className="gradient-text">
                ₹{Math.round(cartTotal + deliveryFee)}
              </span>
            </div>
          </div>

          {cartTotal < 999 && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: 'var(--color-accent)',
              fontWeight: 600,
              marginBottom: 16,
            }}>
              🚚 Add ₹{Math.round(999 - cartTotal)} more for free delivery!
            </div>
          )}

          <button
            onClick={() => navigate('/checkout')}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
          >
            Proceed to Checkout
            <HiOutlineArrowRight size={18} />
          </button>

          <Link
            to="/cakes"
            style={{
              display: 'block',
              textAlign: 'center',
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginTop: 14,
            }}
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
