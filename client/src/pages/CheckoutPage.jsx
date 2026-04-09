// ===========================================
// Checkout Page (Razorpay + GPay + UPI)
// ===========================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { paymentAPI, ordersAPI } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineLockClosed, HiOutlineCheck } from 'react-icons/hi';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, cartCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: address, 2: payment, 3: success
  const [orderId, setOrderId] = useState(null);

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });

  const deliveryFee = cartTotal >= 999 ? 0 : 49;
  const total = Math.round(cartTotal + deliveryFee);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (cartCount === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.zip || !address.phone) {
      toast.error('Please fill in all fields');
      return;
    }
    setStep(2);
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);

      // Step 1: Create Razorpay order on backend
      const { data: orderData } = await paymentAPI.createOrder({ amount: total });

      if (!orderData.success) {
        toast.error('Failed to create order');
        setProcessing(false);
        return;
      }

      // Step 2: If demo mode, auto-complete
      if (orderData.isDemo) {
        await completeOrder('demo_pay_' + Date.now());
        return;
      }

      // Step 3: Open Razorpay Checkout (supports GPay, UPI, Cards, NetBanking)
      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Sweet Delights Bakery',
        description: `Order of ${cartCount} item(s)`,
        order_id: orderData.order.id,
        handler: async function (response) {
          // Step 4: Verify payment on backend
          try {
            const { data: verifyData } = await paymentAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.success && verifyData.verified) {
              await completeOrder(verifyData.paymentId);
            } else {
              toast.error('Payment verification failed');
              setProcessing(false);
            }
          } catch (err) {
            toast.error('Payment verification failed');
            setProcessing(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: address.phone,
        },
        theme: {
          color: '#e11d73',
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
        // Enable all payment methods including GPay
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
      setProcessing(false);
    }
  };

  const completeOrder = async (paymentId) => {
    try {
      const { data: orderResult } = await ordersAPI.create({
        deliveryAddress: address,
        paymentId: paymentId,
        paymentStatus: 'paid',
      });

      if (orderResult.success) {
        setOrderId(orderResult.data?._id);
        setStep(3);
        toast.success('Order placed successfully! 🎉');
      }
    } catch (error) {
      toast.error('Order creation failed');
    } finally {
      setProcessing(false);
    }
  };

  // Success Step
  if (step === 3) {
    return (
      <div className="page-container" style={{
        padding: '80px 24px',
        textAlign: 'center',
        maxWidth: 600,
        margin: '0 auto',
      }}>
        <div className="animate-bounce-in" style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <HiOutlineCheck size={40} style={{ color: 'var(--color-success)' }} />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>
          Order Placed! 🎉
        </h1>
        <p style={{ color: 'var(--color-text-light)', fontSize: '1rem', marginBottom: 32, lineHeight: 1.7 }}>
          Thank you for your order! Your delicious cakes are being prepared with love.
          You'll receive updates on your order status.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/orders')}
            className="btn-primary"
          >
            📦 View Orders
          </button>
          <button
            onClick={() => navigate('/cakes')}
            className="btn-secondary"
          >
            🎂 Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '40px 24px 80px', maxWidth: 900, margin: '0 auto' }}>
      <h1 className="animate-fade-in-up" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
        💳 <span className="gradient-text">Checkout</span>
      </h1>

      {/* Steps Indicator */}
      <div className="animate-fade-in-up delay-100" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 40,
      }}>
        {['Delivery', 'Payment'].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: step > i + 1 ? 'var(--color-success)' : step === i + 1 ? 'var(--gradient-primary)' : 'var(--color-border)',
              color: step >= i + 1 ? 'white' : 'var(--color-text-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem',
            }}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span style={{
              fontWeight: step === i + 1 ? 700 : 500,
              fontSize: '0.9rem',
              color: step === i + 1 ? 'var(--color-text)' : 'var(--color-text-light)',
            }}>
              {s}
            </span>
            {i < 1 && (
              <div style={{
                width: 60,
                height: 2,
                background: step > i + 1 ? 'var(--color-success)' : 'var(--color-border)',
                margin: '0 8px',
              }} />
            )}
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 350px',
        gap: 32,
        alignItems: 'start',
      }} className="checkout-grid">
        {/* Main Content */}
        <div>
          {step === 1 && (
            <form onSubmit={handleAddressSubmit} className="card animate-fade-in" style={{ padding: 32 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 24 }}>
                🚚 Delivery Address
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder="House No., Street, Area"
                    className="form-input"
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>
                      City
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="Mumbai"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>
                      State
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      placeholder="Maharashtra"
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>
                      PIN Code
                    </label>
                    <input
                      type="text"
                      value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      placeholder="400001"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '14px',
                  marginTop: 8,
                }}>
                  Continue to Payment →
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="card animate-fade-in" style={{ padding: 32 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 24 }}>
                💳 Payment
              </h2>

              {/* Payment Methods Info */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: 16,
                marginBottom: 24,
                fontSize: '0.85rem',
              }}>
                <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--color-success)' }}>
                  🔒 Secure Payment via Razorpay
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--color-text-light)' }}>
                  <span>📱 GPay / UPI</span>
                  <span>💳 Credit/Debit Cards</span>
                  <span>🏦 Net Banking</span>
                  <span>👛 Wallets</span>
                </div>
              </div>

              {/* Delivery Summary */}
              <div style={{
                background: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                padding: 16,
                marginBottom: 24,
                fontSize: '0.85rem',
              }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>📍 Delivering to:</div>
                <div style={{ color: 'var(--color-text-light)' }}>
                  {address.street}, {address.city}, {address.state} {address.zip}
                  <br />
                  📞 {address.phone}
                </div>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    marginTop: 8,
                    padding: 0,
                  }}
                >
                  ✏️ Edit Address
                </button>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '16px',
                  fontSize: '1.05rem',
                }}
              >
                <HiOutlineLockClosed size={20} />
                {processing ? 'Processing...' : `Pay ₹${total} Now`}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="card" style={{ padding: 24, position: 'sticky', top: 96 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 16 }}>📋 Order Summary</h3>

          {cart.items?.map((item) => (
            <div key={item._id} style={{
              display: 'flex',
              gap: 12,
              marginBottom: 12,
              paddingBottom: 12,
              borderBottom: '1px solid var(--color-border)',
            }}>
              <img
                src={item.cakeId?.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100'}
                alt=""
                style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 2 }}>
                  {item.cakeId?.name || 'Cake'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-light)' }}>
                  {item.size} • x{item.quantity}
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                ₹{Math.round(item.price)}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-text-light)' }}>Subtotal</span>
              <span>₹{Math.round(cartTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-text-light)' }}>Delivery</span>
              <span style={{ color: deliveryFee === 0 ? 'var(--color-success)' : 'inherit' }}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
            <div style={{
              borderTop: '2px solid var(--color-border)',
              paddingTop: 8,
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 800,
              fontSize: '1.05rem',
            }}>
              <span>Total</span>
              <span className="gradient-text">₹{total}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
