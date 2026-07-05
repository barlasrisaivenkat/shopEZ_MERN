import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../services/api';

function SellerDashboardPage({ user }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productApi.list({ seller: user._id, limit: 20 });
        setProducts(response.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadProducts();
  }, [user]);

  return (
    <div className="page dashboard-page">
      <div className="section-header">
        <div>
          <h1>Seller Dashboard</h1>
          <p className="text-muted">Manage your product listings and view sales activity.</p>
        </div>
      </div>

      <section className="dashboard-card">
        <div className="section-header">
          <div>
            <h2>My Products</h2>
            <p className="text-muted">{products.length} active listings</p>
          </div>
          <Link to="/manage-products" className="secondary-btn">Manage products</Link>
        </div>
        <div className="summary-item">
          <span>Average price</span>
          <strong>₹{products.length > 0 ? Math.round(products.reduce((sum, item) => sum + item.price, 0) / products.length) : 0}</strong>
        </div>
        {products.map((product) => (
          <div key={product._id} className="summary-item">
            <span>{product.title}</span>
            <strong>₹{product.price}</strong>
          </div>
        ))}
      </section>
    </div>
  );
}

export default SellerDashboardPage;
