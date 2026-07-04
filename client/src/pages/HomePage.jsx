import { useEffect, useState, useMemo } from 'react';
import { categoryApi, productApi, cartApi, wishlistApi } from '../services/api';
import ProductCard from '../components/ProductCard';

function HomePage({
  user,
  searchKeyword,
  onCartUpdated,
  onWishlistUpdated,
}) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // UI filter state
  const [priceRange, setPriceRange] = useState('all'); // all | under1000 | 1k5k | above5k
  const [minRating, setMinRating] = useState(0);
  const [colorFilter, setColorFilter] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          categoryApi.list(),
         productApi.list({
    keyword: searchKeyword,
    category: selectedCategory,
}),
        ]);
        setCategories(categoriesRes.data?.data || []);
        setProducts(productsRes.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load products');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchKeyword, selectedCategory]);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) {
        setWishlistIds([]);
        return;
      }
      try {
        const response = await wishlistApi.get();
        setWishlistIds(response.data?.data?.products?.map((item) => item._id) || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadWishlist();
  }, [user]);

  const handleAddToCart = async (product) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      await cartApi.add({ productId: product._id, quantity: 1 });
      onCartUpdated();
      alert('Added to cart');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to add to cart');
    }
  };

  const handleWishlistToggle = async (product) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      if (wishlistIds.includes(product._id)) {
        await wishlistApi.remove(product._id);
      } else {
        await wishlistApi.add(product._id);
      }
      const response = await wishlistApi.get();
      setWishlistIds(response.data?.data?.products?.map((item) => item._id) || []);
      onWishlistUpdated();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to update wishlist');
    }
  };

  const clearFilters = () => {
    setPriceRange('all');
    setMinRating(0);
    setColorFilter('');
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.category?._id !== selectedCategory) return false;
      if (searchKeyword) {
  const q = searchKeyword.toLowerCase();

  const inTitle = p.title?.toLowerCase().includes(q);
  const inDesc = p.description?.toLowerCase().includes(q);
  const inBrand = p.brand?.toLowerCase().includes(q);
  const inCategory = p.category?.name?.toLowerCase().includes(q);

  if (!inTitle && !inDesc && !inBrand && !inCategory) {
    return false;
  }
}

      if (priceRange === 'under1000' && !(p.price < 1000)) return false;
      if (priceRange === '1k5k' && !(p.price >= 1000 && p.price <= 5000)) return false;
      if (priceRange === 'above5k' && !(p.price > 5000)) return false;

      if (minRating > 0 && !(p.rating >= minRating)) return false;

      if (colorFilter && p.color && p.color.toLowerCase() !== colorFilter.toLowerCase()) return false;

      return true;
    });
  }, [products, selectedCategory, searchKeyword, priceRange, minRating, colorFilter]);

  return (
    <div className="page">
      <section className="category-strip">
        <button className={`chip ${selectedCategory === '' ? 'active' : ''}`} onClick={() => setSelectedCategory('')}>
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            className={`chip ${selectedCategory === category._id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category._id)}
          >
            {category.name}
          </button>
        ))}
      </section>

      <section className="banner-row">
        <div className="banner-large">
          <h3>Big savings on your everyday favorites</h3>
          <p>Shop the newest arrivals and exclusive offers curated for you.</p>
        </div>
        <div className="banner-small">
          <h3>New season launch</h3>
          <p>Fresh picks for style, tech and home.</p>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <h2>Featured products</h2>
        </div>
        {loading && <p className="muted-text">Loading products...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && products.length === 0 && <p className="muted-text">No products available yet. Add some from the backend first.</p>}

        <div className="catalog-layout">
          <aside className="filters">
            <div className="filter-card">
              <div className="filter-head">
                <h4>Filters</h4>
                <button className="clear-all" onClick={clearFilters}>Clear All</button>
              </div>

              <div className="filter-section">
                <h5>PRICE RANGE</h5>
                <label><input type="radio" name="price" checked={priceRange === 'all'} onChange={() => setPriceRange('all')} /> All Prices</label>
                <label><input type="radio" name="price" checked={priceRange === 'under1000'} onChange={() => setPriceRange('under1000')} /> Under ₹1,000</label>
                <label><input type="radio" name="price" checked={priceRange === '1k5k'} onChange={() => setPriceRange('1k5k')} /> ₹1,000 – ₹5,000</label>
                <label><input type="radio" name="price" checked={priceRange === 'above5k'} onChange={() => setPriceRange('above5k')} /> Above ₹5,000</label>
              </div>

              <div className="filter-section">
                <h5>MINIMUM RATING</h5>
                <label><input type="radio" name="rating" checked={minRating === 0} onChange={() => setMinRating(0)} /> All Ratings</label>
                <label><input type="radio" name="rating" checked={minRating === 4.5} onChange={() => setMinRating(4.5)} /> 4.5★ & above</label>
                <label><input type="radio" name="rating" checked={minRating === 4} onChange={() => setMinRating(4)} /> 4★ & above</label>
                <label><input type="radio" name="rating" checked={minRating === 3.5} onChange={() => setMinRating(3.5)} /> 3.5★ & above</label>
              </div>

              <div className="filter-section">
                <h5>COLOR</h5>
                <div className="color-chips">
                  {['', 'black', 'silver', 'gold', 'rose gold'].map((c) => (
                    <button key={c} className={`chip small ${colorFilter === c ? 'active' : ''}`} onClick={() => setColorFilter(c)}>{c === '' ? 'Any' : c}</button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="products-area">
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product._id)}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleWishlistToggle}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;