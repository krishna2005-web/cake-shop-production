// ===========================================
// Cakes Listing Page
// ===========================================
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cakesAPI } from '../services/api';
import CakeCard from '../components/cake/CakeCard';
import Loader from '../components/ui/Loader';
import { HiOutlineSearch, HiOutlineAdjustments } from 'react-icons/hi';

export default function CakesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  const categories = [
    { label: 'All Cakes', value: 'all' },
    { label: '🎈 Birthday', value: 'birthday' },
    { label: '💍 Wedding', value: 'wedding' },
    { label: '🍫 Chocolate', value: 'chocolate' },
    { label: '🧁 Cupcakes', value: 'cupcake' },
    { label: '🍓 Fruit', value: 'fruit' },
    { label: '🎨 Custom', value: 'custom' },
    { label: '🥐 Pastries', value: 'pastry' },
  ];

  const sortOptions = [
    { label: 'Newest', value: '' },
    { label: 'Price: Low → High', value: 'price_low' },
    { label: 'Price: High → Low', value: 'price_high' },
    { label: 'Top Rated', value: 'rating' },
    { label: 'Name A-Z', value: 'name' },
  ];

  useEffect(() => {
    fetchCakes();
  }, [category, sort, searchParams.get('page')]);

  const fetchCakes = async () => {
    try {
      setLoading(true);
      const params = {
        page: searchParams.get('page') || 1,
        limit: 12,
      };
      if (category !== 'all') params.category = category;
      if (sort) params.sort = sort;
      if (search.trim()) params.search = search.trim();

      const { data } = await cakesAPI.getAll(params);
      if (data.success) {
        setCakes(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch cakes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCakes();
  };

  return (
    <div className="page-container" style={{ padding: '40px 24px 80px' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 8 }}>
          Our <span className="gradient-text">Cake Collection</span>
        </h1>
        <p style={{ color: 'var(--color-text-light)', fontSize: '1rem' }}>
          {pagination.total} cakes available • Handcrafted with love
        </p>
      </div>

      {/* Filters Bar */}
      <div className="animate-fade-in-up delay-100" style={{
        display: 'flex',
        gap: 16,
        marginBottom: 32,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        {/* Search */}
        <form onSubmit={handleSearch} style={{
          flex: '1 1 300px',
          position: 'relative',
        }}>
          <HiOutlineSearch
            size={20}
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-light)',
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cakes..."
            className="form-input"
            style={{ paddingLeft: 42 }}
          />
        </form>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="form-input"
          style={{
            width: 'auto',
            minWidth: 180,
            cursor: 'pointer',
            appearance: 'auto',
          }}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Category Pills */}
      <div className="animate-fade-in-up delay-200" style={{
        display: 'flex',
        gap: 8,
        marginBottom: 32,
        overflowX: 'auto',
        paddingBottom: 8,
      }}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            style={{
              padding: '8px 20px',
              borderRadius: 999,
              border: category === cat.value ? 'none' : '2px solid var(--color-border)',
              background: category === cat.value ? 'var(--gradient-primary)' : 'var(--color-bg-card)',
              color: category === cat.value ? 'white' : 'var(--color-text)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cakes Grid */}
      {loading ? (
        <Loader fullPage />
      ) : cakes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          color: 'var(--color-text-light)',
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎂</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8, color: 'var(--color-text)' }}>
            No cakes found
          </h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {cakes.map((cake, i) => (
              <CakeCard key={cake._id} cake={cake} index={i} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              marginTop: 48,
            }}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setSearchParams({ ...Object.fromEntries(searchParams), page });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-sm)',
                    border: pagination.page === page ? 'none' : '2px solid var(--color-border)',
                    background: pagination.page === page ? 'var(--gradient-primary)' : 'var(--color-bg-card)',
                    color: pagination.page === page ? 'white' : 'var(--color-text)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
