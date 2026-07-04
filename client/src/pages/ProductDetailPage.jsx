import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cartApi, productApi, reviewApi, wishlistApi } from '../services/api';

function ProductDetailPage({ user, onCartUpdated, onWishlistUpdated }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDetails = async () => {
    try {
      const [productRes, reviewsRes] = await Promise.all([productApi.get(id), reviewApi.list(id)]);
      setProduct(productRes.data?.data || null);
      setReviews(reviewsRes.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  useEffect(() => {
    if (product?.images?.length) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    try {
      await cartApi.add({ productId: id, quantity: 1 });
      onCartUpdated();
      alert('Added to cart');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to add to cart');
    }
  };

  const handleSaveToWishlist = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    try {
      await wishlistApi.add(id);
      onWishlistUpdated();
      alert('Saved to wishlist');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to save');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    navigate(`/cart?checkout=true&buyNowProduct=${id}&qty=1`);
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      await reviewApi.create(id, { rating, comment });
      setComment('');
      setRating(5);
      loadDetails();
      alert('Review added');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to add review');
    }
  };

  if (loading) return <p className="page">Loading product...</p>;
  if (error) return <p className="page error-text">{error}</p>;
  if (!product) return <p className="page">Product not found.</p>;

  const discount = product.discount || 15;
  const originalPrice = Math.round(product.price * (1 + discount / 100));
  const totalReviews = reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((review) => review.rating === star).length,
  }));
  const maxRatingCount = Math.max(...ratingDistribution.map((item) => item.count), 1);

  return (
    <div className="page detail-page">
      <div className="detail-card">
        <div className="detail-gallery">
          <div className="detail-badge">{discount}% off</div>
          <img src={activeImage || product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'} alt={product.title} className="detail-image" />
          {product.images?.length > 1 && (
            <div className="thumbnail-row">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className={activeImage === image ? 'thumbnail-button active' : 'thumbnail-button'}
                  onClick={() => setActiveImage(image)}
                >
                  <img src={image} alt={`${product.title} thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="detail-info">
          <p className="breadcrumb">{product.category?.name || 'Product'}</p>
          <h1>{product.title}</h1>
          <div className="detail-summary-row">
            <div className="detail-rating-row">
              <span className="rating">★ {product.rating?.toFixed(1) || '0.0'}</span>
              <span className="rating-count">{product.numReviews || totalReviews} reviews</span>
            </div>
            <span className={product.stock > 0 ? 'stock in-stock' : 'stock out-of-stock'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          <p className="detail-description">{product.description}</p>

          <div className="price-box">
            <div className="price-block">
              <span className="price">₹{product.price}</span>
              <span className="old-price">₹{originalPrice}</span>
            </div>
            <div className="price-meta">
              <span className="discount-pill">{discount}% OFF</span>
              <span className="save-text">You save ₹{originalPrice - product.price}</span>
            </div>
          </div>

          <div className="product-color-row">
            <span className="color-label">Color:</span>
            <div className="color-options">
              <button className="color-chip active" type="button">Black</button>
              <button className="color-chip" type="button">Silver</button>
            </div>
          </div>

          <div className="product-actions detail-actions">
            <button className="secondary-btn outline-btn" onClick={handleAddToCart}>Add to Cart</button>
            <button className="primary-btn buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
          </div>

          <div className="offer-box">
            <h3>Available offers</h3>
            <ul>
              <li>Bank offer 10% instant discount</li>
              <li>Free delivery on orders above ₹500</li>
              <li>Easy returns and exchange</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="rating-block">
        <div className="rating-breakdown-card">
          <div className="rating-breakdown-title">Rating Breakdown</div>
          <div className="rating-breakdown-top">
            <span className="review-score-value">{product.rating?.toFixed(1) || '0.0'}</span>
            <div>
              <div className="rating-star-row">★★★★★</div>
              <div className="verified-count">{totalReviews} verified reviews</div>
            </div>
          </div>
          <div className="rating-bars">
            {ratingDistribution.map(({ star, count }) => {
              const fill = Math.round((count / maxRatingCount) * 100);
              return (
                <div key={star} className="rating-bar-item">
                  <span className="rating-star-label">{star}★</span>
                  <div className="rating-bar-shell">
                    <div className="rating-bar-fill" style={{ width: `${fill}%` }} />
                  </div>
                  <span className="rating-bar-percent">{totalReviews === 0 ? '0%' : `${Math.round((count / totalReviews) * 100)}%`}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="customer-reviews-section">
        <div className="reviews-heading">
          <h2>Customer Reviews</h2>
          <span className="review-sort">Latest</span>
        </div>

        <div className="review-list">
          {reviews.length === 0 && <p>No reviews yet.</p>}
          {reviews.map((review) => (
            <article key={review._id} className="review-card review-summary-card">
              <div className="review-row">
                <div>
                  <strong>{review.user?.name || 'Anonymous'}</strong>
                  <p className="muted-text">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="rating-pill">★ {review.rating}</span>
              </div>
              <p>{review.comment}</p>
            </article>
          ))}
        </div>

        <div className="review-form-block">
          <h3>Share your review</h3>
          <form className="card-form" onSubmit={handleReviewSubmit}>
            <label>
              Rating
              <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} stars
                  </option>
                ))}
              </select>
            </label>
            <label>
              Comment
              <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Tell us what you think" />
            </label>
            <button className="primary-btn" type="submit">Submit review</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ProductDetailPage;
