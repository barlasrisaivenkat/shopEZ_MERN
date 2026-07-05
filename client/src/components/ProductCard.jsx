import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product, isWishlisted, onAddToCart, onToggleWishlist }) {
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80';
  const discount = product.discount || 15;
  const originalPrice = Math.round(product.price * (1 + discount / 100));
  const [mainImage, setMainImage] = useState(image);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddCart = (event) => {
    event.stopPropagation();
    onAddToCart(product);
  };

  const handleBuyNow = (event) => {
    event.stopPropagation();
    navigate(`/cart?checkout=true&buyNowProduct=${product._id}&qty=1`);
  };

  const handleWishlist = (event) => {
    event.stopPropagation();
    onToggleWishlist(product);
  };

  return (
    <article className="product-card catalog-card" onClick={handleCardClick}>
      <div className="card-media">
        <div className="product-badge">{discount}% off</div>
        <button className="wishlist-btn" onClick={handleWishlist} aria-label="toggle wishlist">
          {isWishlisted ? '♥' : '♡'}
        </button>
        <img src={mainImage} alt={product.title} className="product-image" />
      </div>

      <div className="product-content">
        <p className="product-category">{product.category?.name || 'General'}</p>
        <h3 className="product-title">{product.title}</h3>
        <div className="rating-row">
          <span className="rating">★ {product.rating?.toFixed(1) || '0.0'}</span>
          <span className="rating-count">{product.numReviews || 0}</span>
        </div>

        <p className="product-description muted-text">{product.description?.slice(0, 120)}{product.description && product.description.length > 120 ? '…' : ''}</p>

        <div className="product-meta price-row">
          <div>
            <div className="price">₹{product.price}</div>
            <div className="old-price">₹{originalPrice}</div>
          </div>
          <div className="discount-pill">{discount}% OFF</div>
        </div>

        <div className="product-actions catalog-actions">
          <button className="add-btn" onClick={handleAddCart}>Add to Cart</button>
          <button className="buy-btn" onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
