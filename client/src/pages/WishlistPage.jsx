import { useEffect, useState } from 'react';
import { wishlistApi } from '../services/api';

function WishlistPage({ onCartUpdated }) {
  const [products, setProducts] = useState([]);

  const loadWishlist = async () => {
    try {
      const response = await wishlistApi.get();
      setProducts(response.data?.data?.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeProduct = async (productId) => {
    try {
      await wishlistApi.remove(productId);
      loadWishlist();
      onCartUpdated();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to remove wishlist item');
    }
  };

  return (
    <div className="page">
      <h1>My wishlist</h1>
      {products.length === 0 ? <p>No saved products yet.</p> : (
        <div className="product-grid">
          {products.map((product) => (
            <article key={product._id} className="product-card">
              <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'} alt={product.title} className="product-image" />
              <div className="product-content">
                <h3>{product.title}</h3>
                <p className="price">₹{product.price}</p>
                <button className="ghost-btn" onClick={() => removeProduct(product._id)}>Remove</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
