// ===========================================
// Admin Dashboard Page (Owner View)
// ===========================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending ⏳', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  { value: 'confirmed', label: 'Confirmed ✅', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { value: 'baking', label: 'Baking 🎂', color: '#e11d73', bg: 'rgba(225, 29, 115, 0.1)' },
  { value: 'ready', label: 'Ready 📦', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  { value: 'out_for_delivery', label: 'Out for Delivery 🚗', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.1)' },
  { value: 'delivered', label: 'Delivered 🎉', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  { value: 'cancelled', label: 'Cancelled ❌', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
];

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Security check: only admins
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      toast.error('Unauthorized Access');
      return;
    }
    fetchAllOrders();
  }, [isAuthenticated, user, navigate]);

  const fetchAllOrders = async () => {
    try {
      const { data } = await ordersAPI.getAllOrders();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch admin orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await ordersAPI.updateStatus(orderId, newStatus);
      if (data.success) {
        toast.success('Order status updated!');
        // Update local state smoothly
        setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
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
          <h1 className="animate-fade-in-up" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
            👑 <span className="gradient-text">Admin Dashboard</span>
          </h1>
          <p className="animate-fade-in-up delay-100" style={{ color: 'var(--color-text-light)' }}>
            Manage all {orders.length} Cake Shop orders in real-time.
          </p>
        </div>
        <button onClick={fetchAllOrders} className="btn-secondary" style={{ padding: '8px 16px' }}>
          🔄 Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--color-bg-card)', borderRadius: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😴</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Orders Available</h3>
          <p style={{ color: 'var(--color-text-light)' }}>Waiting for customers to order...</p>
        </div>
      ) : (
        <div className="card animate-fade-in" style={{ overflowX: 'auto', padding: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--color-text-light)' }}>Order ID & Date</th>
                <th style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--color-text-light)' }}>Customer</th>
                <th style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--color-text-light)' }}>Items</th>
                <th style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--color-text-light)' }}>Total</th>
                <th style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--color-text-light)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const config = STATUS_OPTIONS.find(s => s.value === order.status) || STATUS_OPTIONS[0];
                return (
                  <tr key={order._id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}>
                    
                    {/* ID & Date */}
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>#{order._id.slice(-6).toUpperCase()}</div>
                      <div style={{ color: 'var(--color-text-light)', fontSize: '0.75rem', marginTop: 4 }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{order.userId?.name || 'Guest'}</div>
                      <div style={{ color: 'var(--color-text-light)', fontSize: '0.75rem', marginTop: 4 }}>
                        📞 {order.deliveryAddress?.phone || 'No phone'}<br />
                        📍 {order.deliveryAddress?.city || 'No address'}
                      </div>
                    </td>

                    {/* Items */}
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ marginBottom: 4 }}>
                            <strong>{item.quantity}x</strong> {item.name} ({item.size})
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total */}
                    <td style={{ padding: '16px 8px', fontWeight: 800, color: 'var(--color-primary)' }}>
                      ₹{Math.round(order.totalAmount)}
                    </td>

                    {/* Status Dropdown */}
                    <td style={{ padding: '16px 8px' }}>
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{
                          background: config.bg,
                          color: config.color,
                          border: `1px solid ${config.color}40`,
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          outline: 'none',
                          fontSize: '0.8rem'
                        }}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value} style={{ background: 'var(--color-bg-card)', color: opt.color }}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
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
