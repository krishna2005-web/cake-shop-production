// ===========================================
// Cake Detail & Customization Page
// ===========================================
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { cakesAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CakeCard from '../components/cake/CakeCard';
import Loader from '../components/ui/Loader';
import { HiOutlineStar, HiOutlineShoppingCart, HiOutlineHeart, HiOutlineArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function CakeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [cake, setCake] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Customization state
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCake();
    window.scrollTo({ top: 0 });
  }, [id]);

  const fetchCake = async () => {
    try {
      setLoading(true);
      const { data } = await cakesAPI.getById(id);
      if (data.success) {
        setCake(data.data);
        setSelectedSize(data.data.sizes[1]?.label || data.data.sizes[0]?.label || '');
        setSelectedFlavor(data.data.flavors[0] || '');

        // Fetch recommendations
        const recData = await cakesAPI.getRecommendations({
          category: data.data.category,
          exclude: data.data._id,
        });
        if (recData.data.success) {
          setRecommendations(recData.data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch cake:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPrice = () => {
    if (!cake) return 0;
    const sizeConfig = cake.sizes.find((s) => s.label === selectedSize);
    return Math.round(cake.basePrice * (sizeConfig?.multiplier || 1) * quantity);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      navigate('/login');
      return;
    }

    setAdding(true);
    const result = await addToCart({
      cakeId: cake._id,
      quantity,
      size: selectedSize,
      flavor: selectedFlavor,
      message,
    });

    if (result.success) {
      toast.success('Added to cart! 🎂');
    } else {
      toast.error(result.message || 'Failed to add to cart');
    }
    setAdding(false);
  };

  if (loading) return <Loader fullPage />;
  if (!cake) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h2>Cake not found 🎂</h2>
      <Link to="/cakes" className="btn-primary" style={{ marginTop: 16, display: 'inline-block' }}>
        Browse Cakes
      </Link>
    </div>
  );

  return (
    <div className="page-container" style={{ padding: '40px 24px 80px' }}>
      {/* Back Button */}
      <Link
        to="/cakes"
        className="animate-fade-in"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--color-text-light)',
          textDecoration: 'none',
          marginBottom: 24,
          fontSize: '0.9rem',
          fontWeight: 600,
        }}
      >
        <HiOutlineArrowLeft size={18} />
        Back to Cakes
      </Link>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 48,
        marginBottom: 64,
      }} className="cake-detail-grid">
        {/* Image */}
        <div className="animate-fade-in-up">
          <div className="card" style={{
            overflow: 'hidden',
            borderRadius: 'var(--radius-xl)',
          }}>
            <img
              src={cake.image}
              alt={cake.name}
              style={{
                width: '100%',
                height: 480,
                objectFit: 'cover',
              }}
            />
          </div>
        </div>

        {/* Details & Customization */}
        <div className="animate-fade-in-up delay-100">
          {/* Category & Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span className="badge badge-primary">{cake.category}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <HiOutlineStar size={16} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cake.rating}</span>
              <span style={{ color: 'var(--color-text-light)', fontSize: '0.8rem' }}>
                ({cake.reviews} reviews)
              </span>
            </div>
          </div>

          {/* Name & Description */}
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
            {cake.name}
          </h1>
          <p style={{
            color: 'var(--color-text-light)',
            fontSize: '0.95rem',
            lineHeight: 1.7,
            marginBottom: 24,
          }}>
            {cake.description}
          </p>

          {/* Price */}
          <div style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--color-primary)',
            marginBottom: 28,
          }}>
            ₹{getPrice()}
          </div>

          {/* Size Selection */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 10 }}>
              📐 Select Size
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {cake.sizes.map((size) => (
                <button
                  key={size.label}
                  onClick={() => setSelectedSize(size.label)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedSize === size.label ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                    background: selectedSize === size.label ? 'rgba(225, 29, 115, 0.08)' : 'var(--color-bg-card)',
                    color: selectedSize === size.label ? 'var(--color-primary)' : 'var(--color-text)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flavor Selection */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 10 }}>
              🎨 Select Flavor
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {cake.flavors.map((flavor) => (
                <button
                  key={flavor}
                  onClick={() => setSelectedFlavor(flavor)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedFlavor === flavor ? '2px solid var(--color-secondary)' : '2px solid var(--color-border)',
                    background: selectedFlavor === flavor ? 'rgba(124, 58, 237, 0.08)' : 'var(--color-bg-card)',
                    color: selectedFlavor === flavor ? 'var(--color-secondary)' : 'var(--color-text)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {flavor}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 10 }}>
              ✍️ Custom Message (optional)
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='e.g. "Happy Birthday John!"'
              maxLength={100}
              className="form-input"
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: 4 }}>
              {message.length}/100 characters
            </div>
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 10 }}>
              🔢 Quantity
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--color-border)',
                  background: 'var(--color-bg-card)',
                  color: 'var(--color-text)',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                −
              </button>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, minWidth: 30, textAlign: 'center' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--color-border)',
                  background: 'var(--color-bg-card)',
                  color: 'var(--color-text)',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="btn-primary"
              style={{ flex: 1, padding: '14px 24px', fontSize: '1rem', justifyContent: 'center' }}
            >
              <HiOutlineShoppingCart size={20} />
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              style={{
                width: 52,
                height: 52,
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--color-border)',
                background: 'var(--color-bg-card)',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <HiOutlineHeart size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>
            You Might Also Like ✨
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {recommendations.map((rec, i) => (
              <CakeCard key={rec._id} cake={rec} index={i} />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .cake-detail-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </div>
  );
}
