// ===========================================
// Orders Page
// ===========================================
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import { HiOutlineEye, HiOutlineTruck, HiOutlineCheck, HiOutlineClock } from 'react-icons/hi';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#f59e0b', icon: '⏳', bg: 'rgba(245, 158, 11, 0.1)' },
  confirmed: { label: 'Confirmed', color: '#3b82f6', icon: '✅', bg: 'rgba(59, 130, 246, 0.1)' },
  baking: { label: 'Baking', color: '#e11d73', icon: '🎂', bg: 'rgba(225, 29, 115, 0.1)' },
  ready: { label: 'Ready', color: '#10b981', icon: '📦', bg: 'rgba(16, 185, 129, 0.1)' },
  out_for_delivery: { label: 'Out for Delivery', color: '#7c3aed', icon: '🚗', bg: 'rgba(124, 58, 237, 0.1)' },
  delivered: { label: 'Delivered', color: '#10b981', icon: '🎉', bg: 'rgba(16, 185, 129, 0.1)' },
  cancelled: { label: 'Cancelled', color: '#ef4444', icon: '❌', bg: 'rgba(239, 68, 68, 0.1)' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const { data } = await ordersAPI.getUserOrders();
      if (data.success) setOrders(data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="page-container" style={{ padding: '40px 24px 80px' }}>
      <h1 className="animate-fade-in-up" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
        📦 My <span className="gradient-text">Orders</span>
      </h1>
      <p className="animate-fade-in-up delay-100" style={{
        color: 'var(--color-text-light)',
        marginBottom: 32,
      }}>
        Track your orders and view order history
      </p>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>No orders yet</h3>
          <p style={{ color: 'var(--color-text-light)', marginBottom: 24 }}>
            Your delicious cakes are waiting!
          </p>
          <Link to="/cakes" className="btn-primary">🎂 Browse Cakes</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map((order, i) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const isExpanded = expandedOrder === order._id;

            return (
              <div
                key={order._id}
                className={`card animate-fade-in-up delay-${(i % 3 + 1) * 100}`}
                style={{ overflow: 'hidden' }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                  onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ fontSize: 32 }}>{statusConfig.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>
                        Order #{order._id.slice(-8).toUpperCase()}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span
                      className="badge"
                      style={{
                        background: statusConfig.bg,
                        color: statusConfig.color,
                      }}
                    >
                      {statusConfig.label}
                    </span>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: 'var(--color-primary)',
                    }}>
                      ₹{Math.round(order.totalAmount)}
                    </div>
                    <span style={{
                      transition: 'transform 0.3s',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                      fontSize: '0.9rem',
                    }}>
                      ▼
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="animate-fade-in" style={{
                    padding: '0 24px 24px',
                    borderTop: '1px solid var(--color-border)',
                  }}>
                    {/* Items */}
                    <div style={{ marginTop: 16 }}>
                      <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 12 }}>Items</h4>
                      {order.items.map((item, j) => (
                        <div key={j} style={{
                          display: 'flex',
                          gap: 12,
                          padding: '10px 0',
                          borderBottom: j < order.items.length - 1 ? '1px solid var(--color-border)' : 'none',
                        }}>
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100'}
                            alt=""
                            style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                              {item.size} • {item.flavor} • x{item.quantity}
                              {item.message && ` • "${item.message}"`}
                            </div>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            ₹{Math.round(item.price)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tracking */}
                    {order.trackingUpdates && order.trackingUpdates.length > 0 && (
                      <div style={{ marginTop: 20 }}>
                        <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 12 }}>
                          📍 Order Tracking
                        </h4>
                        <div style={{ paddingLeft: 16, borderLeft: '2px solid var(--color-primary-light)' }}>
                          {order.trackingUpdates.map((update, k) => (
                            <div key={k} style={{
                              position: 'relative',
                              paddingLeft: 16,
                              paddingBottom: k < order.trackingUpdates.length - 1 ? 16 : 0,
                            }}>
                              <div style={{
                                position: 'absolute',
                                left: -23,
                                top: 2,
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                background: k === 0 ? 'var(--color-primary)' : 'var(--color-primary-light)',
                              }} />
                              <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>
                                {update.message}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-light)' }}>
                                {new Date(update.timestamp).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Delivery Address */}
                    {order.deliveryAddress?.street && (
                      <div style={{ marginTop: 16 }}>
                        <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 8 }}>
                          🚚 Delivery Address
                        </h4>
                        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-light)' }}>
                          {order.deliveryAddress.street}, {order.deliveryAddress.city},{' '}
                          {order.deliveryAddress.state} {order.deliveryAddress.zip}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
