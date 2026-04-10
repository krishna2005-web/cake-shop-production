// ===========================================
// Admin Dashboard Page (Owner View with Swiggy Alerts)
// ===========================================
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'confirmed', label: 'Accepted ✅', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { value: 'baking', label: 'Baking 🎂', color: '#e11d73', bg: 'rgba(225, 29, 115, 0.1)' },
  { value: 'out_for_delivery', label: 'Out for Delivery 🚗', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.1)' },
  { value: 'delivered', label: 'Delivered 🎉', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  { value: 'cancelled', label: 'Cancelled ❌', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
];

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Ref to track the latest order ID so we know when to DING!
  const latestOrderIdRef = useRef(null);

  // Audio object (Standard HTML5 Ding)
  // We use a reliable public notification sound
  const playDing = () => {
    try {
      const audio = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3');
      audio.play().catch(e => console.log('Audio autoplay blocked by browser', e));
    } catch(err) {}
  };

  useEffect(() => {
    // Security check: only admins
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      toast.error('Unauthorized Access');
      return;
    }
    
    // Initial fetch
    fetchAllOrders(true);

    // Live Polling every 10 seconds (Swiggy mode)
    const intervalId = setInterval(() => {
      fetchAllOrders(false);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [isAuthenticated, user, navigate]);

  const fetchAllOrders = async (isInitial = false) => {
    try {
      const { data } = await ordersAPI.getAllOrders();
      if (data.success && data.data.length > 0) {
        setOrders(data.data);
        
        // Check for new orders
        const newestOrder = data.data[0];
        if (!isInitial && latestOrderIdRef.current && latestOrderIdRef.current !== newestOrder._id) {
          // A brand new order arrived!
          playDing();
          toast.success(\`NEW ORDER DETECTED! 🎉 \`, { duration: 6000, icon: '🔔' });
        }
        latestOrderIdRef.current = newestOrder._id;
      }
    } catch (error) {
      console.error('Failed to fetch admin orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await ordersAPI.updateStatus(orderId, newStatus);
      if (data.success) {
        toast.success(newStatus === 'cancelled' ? 'Order Rejected' : 'Status Updated');
        // Update local state smoothly
        setOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="page-container" style={{ padding: '40px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 className="animate-fade-in-up" style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
            👑 <span className="gradient-text">Live Dashboard</span>
          </h1>
          <p className="animate-fade-in-up delay-100" style={{ color: 'var(--color-text-light)', marginTop: 8 }}>
            Real-time Swiggy-style order management
          </p>
        </div>
        <div className="animate-pulse" style={{ background: 'rgba(225, 29, 115, 0.1)', padding: '8px 16px', borderRadius: 20, color: 'var(--color-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, background: 'var(--color-primary)', borderRadius: '50%' }}/> ACTIVE POLLING
        </div>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--color-bg-card)', borderRadius: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🖥️</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Orders Yet</h3>
          <p style={{ color: 'var(--color-text-light)' }}>Waiting for the first customer...</p>
        </div>
      ) : (
        <div className="card animate-fade-in" style={{ overflowX: 'auto', padding: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-light)' }}>Time</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-light)' }}>Order ID</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-light)' }}>Customer</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-light)' }}>Items</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-light)' }}>Total</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-light)', width: 220 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const config = STATUS_OPTIONS.find(s => s.value === order.status) || STATUS_OPTIONS[0];
                const isNew = order.status === 'pending';
                
                return (
                  <tr key={order._id} style={{ 
                    borderBottom: '1px solid var(--color-border)', 
                    background: isNew ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                    transition: 'background 0.2s' 
                  }}>
                    
                    {/* Time */}
                    <td style={{ padding: '16px', color: 'var(--color-text-light)', fontSize: '0.8rem', fontWeight: 600 }}>
                      {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' })}
                    </td>

                    {/* ID */}
                    <td style={{ padding: '16px', fontWeight: 800, fontSize: '0.9rem' }}>
                      #{order._id.slice(-6).toUpperCase()}
                    </td>

                    {/* Customer Info */}
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{order.userId?.name || 'Guest'}</div>
                      <div style={{ color: 'var(--color-text-light)', fontSize: '0.75rem', marginTop: 4 }}>
                        📞 {order.deliveryAddress?.phone || 'No phone'}<br />
                        📍 {order.deliveryAddress?.city || 'No address'}
                      </div>
                    </td>

                    {/* Items */}
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ marginBottom: 4 }}>
                            <strong>{item.quantity}x</strong> {item.name} ({item.size})
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total */}
                    <td style={{ padding: '16px', fontWeight: 800, color: 'var(--color-primary)' }}>
                      ₹{Math.round(order.totalAmount)}
                    </td>

                    {/* ACTION (Swiggy Logic) */}
                    <td style={{ padding: '16px' }}>
                      {isNew ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button 
                            onClick={() => handleStatusChange(order._id, 'confirmed')}
                            style={{ flex: 1, padding: '8px', background: '#10b981', color: 'white', border: 'none', borderRadius: 4, fontWeight: 700, cursor: 'pointer' }}
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleStatusChange(order._id, 'cancelled')}
                            style={{ padding: '8px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={order.status === 'cancelled' || order.status === 'delivered'}
                          style={{
                            width: '100%',
                            background: order.status === 'cancelled' ? 'rgba(239,68,68,0.1)' : config.bg,
                            color: order.status === 'cancelled' ? '#ef4444' : config.color,
                            border: \`1px solid \${order.status === 'cancelled' ? '#ef4444' : config.color}40\`,
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 700,
                            cursor: (order.status === 'cancelled' || order.status === 'delivered') ? 'not-allowed' : 'pointer',
                            outline: 'none',
                            fontSize: '0.85rem'
                          }}
                        >
                           {order.status === 'cancelled' && <option value="cancelled">Rejected ❌</option>}
                           {order.status === 'delivered' && <option value="delivered">Delivered 🎉</option>}
                           {order.status !== 'cancelled' && order.status !== 'delivered' && STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value} style={{ background: 'var(--color-bg-card)', color: opt.color }}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
