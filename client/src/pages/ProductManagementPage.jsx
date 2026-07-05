import { useEffect, useState } from 'react';
import { categoryApi, productApi } from '../services/api';

const emptyProduct = {
  title: '',
  description: '',
  price: 0,
  discount: 0,
  stock: 1,
  brand: '',
  images: ['', '', ''],
  category: '',
};

function ProductManagementPage({ user }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          categoryApi.list(),
          productApi.list(user.role === 'seller' ? { seller: user._id, limit: 50 } : { limit: 50 }),
        ]);
        setCategories(categoriesRes.data?.data || []);
        setProducts(productsRes.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load product management data');
      }
    };

    loadData();
  }, [user]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      title: product.title || '',
      description: product.description || '',
      price: product.price || 0,
      discount: product.discount || 0,
      stock: product.stock || 1,
      brand: product.brand || '',
      images: [product.images?.[0] || '', product.images?.[1] || '', product.images?.[2] || ''],
      category: product.category?._id || '',
    });
  };

  const handleNew = () => {
    setEditingProduct(null);
    setForm(emptyProduct);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      discount: Number(form.discount),
      stock: Number(form.stock),
      brand: form.brand,
      images: form.images.filter((src) => src.trim()),
      category: form.category,
    };

    try {
      if (editingProduct) {
        await productApi.update(editingProduct._id, payload);
        alert('Product updated');
      } else {
        await productApi.create(payload);
        alert('Product created');
      }
      const response = await productApi.list({ seller: user._id, limit: 50 });
      setProducts(response.data?.data || []);
      handleNew();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save product');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productApi.remove(productId);
      setProducts((prev) => prev.filter((item) => item._id !== productId));
      if (editingProduct?._id === productId) handleNew();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to delete product');
    }
  };

  return (
    <div className="page dashboard-page">
      <div className="section-header">
        <div>
          <h1>Product Management</h1>
          <p className="text-muted">Add or update products available through your seller/admin account.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <h2>{editingProduct ? 'Edit product' : 'Add new product'}</h2>
          <form className="card-form" onSubmit={handleSubmit}>
            <label>
              Title
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            </label>
            <label>
              Description
              <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required rows={4} />
            </label>
            <label>
              Category
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </label>
            <div className="form-row">
              <label>
                Price
                <input type="number" min="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
              </label>
              <label>
                Discount (%)
                <input type="number" min="0" max="100" value={form.discount} onChange={(event) => setForm({ ...form, discount: event.target.value })} />
              </label>
            </div>
            <div className="form-row">
              <label>
                Stock
                <input type="number" min="0" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} required />
              </label>
              <label>
                Brand
                <input value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} />
              </label>
            </div>
            <label>
              Image URLs
              <input value={form.images[0]} onChange={(event) => setForm({ ...form, images: [event.target.value, form.images[1], form.images[2]] })} placeholder="Main image URL" />
            </label>
            <label>
              Image URL 2
              <input value={form.images[1]} onChange={(event) => setForm({ ...form, images: [form.images[0], event.target.value, form.images[2]] })} placeholder="Second image URL" />
            </label>
            <label>
              Image URL 3
              <input value={form.images[2]} onChange={(event) => setForm({ ...form, images: [form.images[0], form.images[1], event.target.value] })} placeholder="Third image URL" />
            </label>
            {error && <p className="error-text">{error}</p>}
            <div className="form-row">
              <button className="primary-btn" type="submit">{editingProduct ? 'Save changes' : 'Add product'}</button>
              <button type="button" className="secondary-btn" onClick={handleNew}>New product</button>
            </div>
          </form>
        </section>

        <section className="dashboard-card">
          <h2>My Listings</h2>
          <p className="text-muted">{products.length} products</p>
          {products.map((product) => (
            <div key={product._id} className="summary-item">
              <div>
                <strong>{product.title}</strong>
                <p className="text-muted">₹{product.price} • Stock: {product.stock}</p>
              </div>
              <div className="summary-action-group">
                <button className="secondary-btn" type="button" onClick={() => handleEdit(product)}>Edit</button>
                <button className="ghost-btn" type="button" onClick={() => handleDelete(product._id)}>Delete</button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default ProductManagementPage;
