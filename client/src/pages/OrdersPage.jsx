// ===========================================
// Orders Page (Swiggy Tracking Style)
// ===========================================
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';

const STATUS_STAGES = [
  { id: 'pending', label: 'Placed' },
  { id: 'confirmed', label: 'Accepted' },
  { id: 'baking', label: 'Baking' },
  { id: 'out_for_delivery', label: 'On the Way' },
  { id: 'delivered', label: 'Delivered' }
];

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
    
    // Initial fetch
    fetchOrders();

    // Swiggy-style Live Polling (every 10 seconds)
    const intervalId = setInterval(() => {
      fetchOrders(false); // false means don't show loading spinner
    }, 10000);

    return () => clearInterval(intervalId);
  }, [isAuthenticated, navigate]);

  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading && orders.length === 0) setLoading(true);
      const { data } = await ordersAPI.getUserOrders();
      if (data.success) {
        // If there's exactly 1 order and it's active, auto-expand it!
        if (data.data.length > 0 && !expandedOrder && data.data[0].status !== 'delivered' && data.data[0].status !== 'cancelled') {
             setExpandedOrder(data.data[0]._id);
        }
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressIndex = (status) => {
    if (status === 'cancelled') return -1;
    const index = STATUS_STAGES.findIndex(s => s.id === status || status === 'ready' && s.id === 'baking');
    return index === -1 ? 0 : index;
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="page-container" style={{ padding: '40px 24px 80px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 className="animate-fade-in-up" style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
          📦 Live <span className="gradient-text">Tracking</span>
        </h1>
        <div className="animate-pulse" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, background: 'var(--color-primary)', borderRadius: '50%' }} /> Live
        </div>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>No orders yet</h3>
          <p style={{ color: 'var(--color-text-light)', marginBottom: 24 }}>Your delicious cakes are waiting!</p>
          <Link to="/cakes" className="btn-primary">🎂 Browse Cakes</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {orders.map((order, i) => {
            const isExpanded = expandedOrder === order._id;
            const progressIndex = getProgressIndex(order.status);
            const isCancelled = order.status === 'cancelled';

            return (
              <div key={order._id} className={`card animate-fade-in-up delay-${(i % 3 + 1) * 100}`} style={{ overflow: 'hidden', padding: 24 }}>
                
                {/* Header Overview */}
                <div 
                  onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: 16 }}
                >
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0 0 4px 0' }}>Order #{order._id.slice(-6).toUpperCase()}</h3>
                    <div style={{ color: 'var(--color-text-light)', fontSize: '0.8rem' }}>
                      {new Date(order.createdAt).toLocaleDateString()} • ₹{Math.round(order.totalAmount)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {isCancelled ? (
                       <span style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: 20, fontWeight: 700, fontSize: '0.8rem' }}>
                         Cancelled
                       </span>
                    ) : (
                       <span style={{ padding: '6px 12px', background: progressIndex === 4 ? 'rgba(16,185,129,0.1)' : 'var(--gradient-primary)', color: progressIndex === 4 ? '#10b981' : 'white', borderRadius: 20, fontWeight: 700, fontSize: '0.8rem' }}>
                         {progressIndex === 4 ? 'Delivered 🎉' : 'Active ⏳'}
                       </span>
                    )}
                    <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s' }}>▼</span>
                  </div>
                </div>

                {/* Swiggy Style Progress Bar! (Visible even when collapsed if active) */}
                {!isCancelled && progressIndex < 4 && (
                  <div style={{ marginTop: 24, marginBottom: isExpanded ? 32 : 8 }}>
                    <div style={{ position: 'relative', height: 4, background: 'var(--color-border)', borderRadius: 4, margin: '0 10px' }}>
                      <div style={{ 
                        position: 'absolute', top: 0, left: 0, height: '100%', 
                        background: 'var(--color-primary)', borderRadius: 4, 
                        width: \`\${(progressIndex / (STATUS_STAGES.length - 1)) * 100}%\`,
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                      }} />
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', width: '100%', top: -8 }}>
                        {STATUS_STAGES.map((stage, idx) => (
                           <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20 }}>
                              <div style={{ 
                                width: 20, height: 20, borderRadius: '50%', 
                                background: idx <= progressIndex ? 'var(--color-primary)' : 'var(--color-bg-card)',
                                border: \`2px solid \${idx <= progressIndex ? 'var(--color-primary)' : 'var(--color-border)'}\`,
                                transition: 'all 0.5s', zIndex: 2
                              }} />
                              <div style={{ 
                                position: 'absolute', top: 24, whiteSpace: 'nowrap', fontSize: '0.75rem', 
                                fontWeight: idx === progressIndex ? 800 : 600,
                                color: idx <= progressIndex ? 'var(--color-text)' : 'var(--color-text-light)',
                                marginLeft: idx === 0 ? 10 : idx === 4 ? -20 : 0
                              }}>
                                {stage.label}
                              </div>
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="animate-fade-in" style={{ marginTop: progressIndex < 4 && !isCancelled ? 48 : 16, paddingTop: 24, borderTop: '1px dashed var(--color-border)' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: 12 }}>Items in Order</h4>
                    {order.items.map((item, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{ fontWeight: 800, background: 'var(--color-bg)', padding: '4px 8px', borderRadius: 6, fontSize: '0.8rem' }}>
                          x{item.quantity}
                        </div>
                        <img src={item.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100'} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{item.size} • {item.flavor}</div>
                        </div>
                        <div style={{ fontWeight: 700 }}>₹{Math.round(item.price)}</div>
                      </div>
                    ))}
                    
                    {/* Delivery Address */}
                    {order.deliveryAddress?.street && (
                      <div style={{ marginTop: 24, background: 'var(--color-bg)', padding: 16, borderRadius: 'var(--radius-md)' }}>
                        <h4 style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 4, color: 'var(--color-text-light)' }}>📍 Delivery to</h4>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                          {order.deliveryAddress.street}, {order.deliveryAddress.city}<br/>
                          📞 {order.deliveryAddress.phone}
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
