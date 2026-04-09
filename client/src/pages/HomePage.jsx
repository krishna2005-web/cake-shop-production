// ===========================================
// Home Page
// ===========================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cakesAPI } from '../services/api';
import CakeCard from '../components/cake/CakeCard';
import Loader from '../components/ui/Loader';
import { HiOutlineSparkles, HiOutlineTruck, HiOutlineHeart, HiOutlineCake } from 'react-icons/hi';

export default function HomePage() {
  const [featuredCakes, setFeaturedCakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await cakesAPI.getFeatured();
        if (data.success) setFeaturedCakes(data.data);
      } catch (error) {
        console.error('Failed to fetch featured cakes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Birthday', emoji: '🎈', color: '#f472b6', slug: 'birthday' },
    { name: 'Wedding', emoji: '💍', color: '#a78bfa', slug: 'wedding' },
    { name: 'Chocolate', emoji: '🍫', color: '#92400e', slug: 'chocolate' },
    { name: 'Cupcakes', emoji: '🧁', color: '#f59e0b', slug: 'cupcake' },
    { name: 'Fruit', emoji: '🍓', color: '#10b981', slug: 'fruit' },
    { name: 'Custom', emoji: '🎨', color: '#7c3aed', slug: 'custom' },
    { name: 'Pastries', emoji: '🥐', color: '#ea580c', slug: 'pastry' },
  ];

  const features = [
    {
      icon: <HiOutlineSparkles size={28} />,
      title: 'Premium Quality',
      desc: 'Made with the finest ingredients sourced from local farms',
    },
    {
      icon: <HiOutlineTruck size={28} />,
      title: 'Fast Delivery',
      desc: 'Same-day delivery available. Free on orders over $50',
    },
    {
      icon: <HiOutlineHeart size={28} />,
      title: 'Made with Love',
      desc: 'Each cake handcrafted by our expert pastry chefs',
    },
    {
      icon: <HiOutlineCake size={28} />,
      title: 'Fully Customizable',
      desc: 'Choose size, flavor, and add your personal message',
    },
  ];

  return (
    <div>
      {/* ============ Hero Section ============ */}
      <section style={{
        background: 'var(--gradient-hero)',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(225, 29, 115, 0.05)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(124, 58, 237, 0.05)',
          filter: 'blur(40px)',
        }} />

        <div className="page-container" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          <div className="animate-fade-in-up">
            <span className="badge badge-primary" style={{ marginBottom: 16, fontSize: '0.8rem' }}>
              ✨ Handcrafted with Love
            </span>
            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-1px',
              marginBottom: 20,
            }}>
              Life is Short,
              <br />
              <span className="gradient-text">Eat More Cake!</span>
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-light)',
              lineHeight: 1.7,
              marginBottom: 32,
              maxWidth: 480,
            }}>
              Discover our collection of handcrafted cakes, made with premium ingredients 
              and designed to make your celebrations unforgettable.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/cakes" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                🎂 Browse Cakes
              </Link>
              <Link to="/cakes?category=custom" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                🎨 Custom Order
              </Link>
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              gap: 40,
              marginTop: 48,
            }}>
              {[
                { num: '2K+', label: 'Happy Customers' },
                { num: '150+', label: 'Cake Varieties' },
                { num: '4.9', label: 'Avg Rating ⭐' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                    {stat.num}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', fontWeight: 500 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="animate-fade-in-up delay-200 hero-image-container" style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 420,
              height: 420,
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-glow)',
              border: '4px solid rgba(225, 29, 115, 0.2)',
            }} className="animate-float">
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"
                alt="Beautiful chocolate cake"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .hero-image-container { display: none !important; }
            section > .page-container { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ============ Categories Section ============ */}
      <section className="page-container" style={{ padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
            Browse by <span className="gradient-text">Category</span>
          </h2>
          <p style={{ color: 'var(--color-text-light)', fontSize: '1rem' }}>
            Find the perfect cake for every occasion
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 16,
        }}>
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              to={`/cakes?category=${cat.slug}`}
              className={`card animate-fade-in-up delay-${(i % 5 + 1) * 100}`}
              style={{
                textDecoration: 'none',
                padding: '24px 16px',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <div style={{
                fontSize: 36,
                marginBottom: 10,
                transition: 'transform 0.3s ease',
              }}>
                {cat.emoji}
              </div>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--color-text)',
              }}>
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ Featured Cakes ============ */}
      <section style={{ background: 'var(--color-bg-card)', padding: '80px 0' }}>
        <div className="page-container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 48,
            flexWrap: 'wrap',
            gap: 16,
          }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
                ⭐ <span className="gradient-text">Featured</span> Cakes
              </h2>
              <p style={{ color: 'var(--color-text-light)', fontSize: '1rem' }}>
                Our most loved creations, hand-picked for you
              </p>
            </div>
            <Link to="/cakes" className="btn-secondary">
              View All →
            </Link>
          </div>

          {loading ? (
            <Loader fullPage />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 24,
            }}>
              {featuredCakes.slice(0, 8).map((cake, i) => (
                <CakeCard key={cake._id} cake={cake} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ Features Section ============ */}
      <section className="page-container" style={{ padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
            Why Choose <span className="gradient-text">Sweet Delights</span>?
          </h2>
          <p style={{ color: 'var(--color-text-light)', fontSize: '1rem' }}>
            We go above and beyond for every order
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 24,
        }}>
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`card animate-fade-in-up delay-${(i + 1) * 100}`}
              style={{
                padding: 32,
                textAlign: 'center',
              }}
            >
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(225, 29, 115, 0.08)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8 }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', lineHeight: 1.6 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CTA Section ============ */}
      <section style={{
        background: 'var(--gradient-primary)',
        padding: '60px 24px',
        textAlign: 'center',
        color: 'white',
      }}>
        <div className="page-container animate-fade-in-up">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>
            🎂 Ready to Order Your Dream Cake?
          </h2>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
            Order online and get it delivered fresh to your doorstep. 
            Free delivery on orders over $50!
          </p>
          <Link
            to="/cakes"
            style={{
              background: 'white',
              color: 'var(--color-primary)',
              padding: '14px 36px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'transform 0.3s ease',
            }}
          >
            Order Now →
          </Link>
        </div>
      </section>
    </div>
  );
}
