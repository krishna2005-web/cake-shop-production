// ===========================================
// Cake Card Component
// ===========================================
import { Link } from 'react-router-dom';
import { HiOutlineStar, HiOutlineShoppingCart } from 'react-icons/hi';

export default function CakeCard({ cake, index = 0 }) {
  return (
    <div
      className={`card animate-fade-in-up delay-${(index % 4 + 1) * 100}`}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* Image */}
      <Link to={`/cakes/${cake._id}`} style={{ textDecoration: 'none' }}>
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          height: 220,
        }}>
          <img
            src={cake.image}
            alt={cake.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.08)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          />
          {/* Category Badge */}
          <span
            className="badge badge-primary"
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
            }}
          >
            {cake.category}
          </span>
          {/* Featured Badge */}
          {cake.featured && (
            <span
              className="badge"
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'var(--gradient-primary)',
                color: 'white',
              }}
            >
              ⭐ Featured
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Link to={`/cakes/${cake._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            marginBottom: 6,
            color: 'var(--color-text)',
            lineHeight: 1.3,
          }}>
            {cake.name}
          </h3>
        </Link>

        <p style={{
          fontSize: '0.82rem',
          color: 'var(--color-text-light)',
          marginBottom: 12,
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {cake.description}
        </p>

        {/* Rating */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 14,
        }}>
          <HiOutlineStar size={16} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{cake.rating}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
            ({cake.reviews} reviews)
          </span>
        </div>

        {/* Price & Action */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
        }}>
          <div>
            <span style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              color: 'var(--color-primary)',
            }}>
              ₹{cake.basePrice}
            </span>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-light)',
              marginLeft: 4,
            }}>
              from
            </span>
          </div>
          <Link
            to={`/cakes/${cake._id}`}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
          >
            <HiOutlineShoppingCart size={16} />
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
