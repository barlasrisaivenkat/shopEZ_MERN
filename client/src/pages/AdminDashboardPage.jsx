import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi, categoryApi, orderApi, paymentApi, productApi } from '../services/api';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState('');

  const resolveId = (ref) => {
    if (!ref) return '';
    if (typeof ref === 'string') return ref;
    if (ref._id) return ref._id;
    if (typeof ref.toString === 'function') return ref.toString();
    return '';
  };

  const loadData = async () => {
    try {
      const [usersRes, ordersRes, paymentsRes, productsRes, categoriesRes] = await Promise.all([
        authApi.getUsers(),
        orderApi.getAll(),
        paymentApi.getAll(),
        productApi.list({ limit: 8 }),
        categoryApi.list(),
      ]);

      setUsers(usersRes.data?.data || []);
      setOrders(ordersRes.data?.data || []);
      setPayments(paymentsRes.data?.data || []);
      setProducts(productsRes.data?.data || []);
      setCategories(categoriesRes.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const visiblePayments = payments.filter((payment) => resolveId(payment.order));
  const visibleOrders = orders.filter((order) => order && order._id);

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Remove this user?')) return;
    try {
      await authApi.deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to delete user');
    }
  };

  const handleCategorySubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (editingCategory) {
        await categoryApi.update(editingCategory._id, categoryForm);
      } else {
        await categoryApi.create(categoryForm);
      }
      setCategoryForm({ name: '', description: '' });
      setEditingCategory(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save category');
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name || '', description: category.description || '' });
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await categoryApi.remove(categoryId);
      setCategories((prev) => prev.filter((item) => item._id !== categoryId));
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to delete category');
    }
  };

  const handleOrderStatusChange = async (orderId, status) => {
    try {
      await orderApi.updateStatus(orderId, status);
      setOrders((prev) => prev.map((order) => (order._id === orderId ? { ...order, orderStatus: status } : order)));
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to update order status');
    }
  };

  const handleCollectCOD = async (orderId) => {
    if (!orderId) {
      alert('Invalid payment order id');
      return;
    }
    if (!window.confirm('Mark COD as collected?')) return;
    try {
      await paymentApi.collectCOD(orderId);
      await loadData();
      alert('COD marked as collected');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to update payment');
    }
  };

  return (
    <div className="page dashboard-page">
      <div className="section-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="text-muted">Manage users, categories, orders, payments, and products.</p>
        </div>
        <Link to="/manage-products" className="secondary-btn">Manage products</Link>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <h2>Overview</h2>
          <p className="text-muted">Quick summary of your store activity.</p>
          <div className="summary-item"><span>Users</span><strong>{users.length}</strong></div>
          <div className="summary-item"><span>Orders</span><strong>{orders.length}</strong></div>
          <div className="summary-item"><span>Payments</span><strong>{payments.length}</strong></div>
          <div className="summary-item"><span>Categories</span><strong>{categories.length}</strong></div>
        </section>

        <section className="dashboard-card">
          <h2>User management</h2>
          <div className="summary-item"><span>Admins</span><strong>{users.filter((item) => item.role === 'admin').length}</strong></div>
          <div className="summary-item"><span>Sellers</span><strong>{users.filter((item) => item.role === 'seller').length}</strong></div>
          <div className="summary-item"><span>Customers</span><strong>{users.filter((item) => item.role === 'user').length}</strong></div>
          <div className="user-list">
            {users.slice(0, 4).map((userItem) => (
              <div key={userItem._id} className="summary-item">
                <span>{userItem.name} ({userItem.role})</span>
                <button className="ghost-btn" type="button" onClick={() => handleDeleteUser(userItem._id)}>Delete</button>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-card dashboard-card-wide">
          <div className="section-header">
            <div>
              <h2>Order management</h2>
              <p className="text-muted">Review recent orders and update status while monitoring payment progress.</p>
            </div>
          </div>
          {visibleOrders.length === 0 ? (
            <p>No orders available.</p>
          ) : (
            <div className="list-table">
              <div className="list-table-header">
                <span>Order</span>
                <span>Date</span>
                <span>User</span>
                <span>Status</span>
                <span>Total</span>
                <span>Payment</span>
                <span>Actions</span>
              </div>
              {visibleOrders.map((order) => (
                <div key={order._id} className="list-table-row">
                  <span>#{order._id.slice(-6)}</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span>{order.user?.name || order.user?.email || 'Unknown'}</span>
                  <span>{order.orderStatus}</span>
                  <span>₹{order.totalPrice}</span>
                  <span>{order.paymentStatus || 'N/A'}</span>
                  <span className="summary-action-group">
                    <select value={order.orderStatus} onChange={(event) => handleOrderStatusChange(order._id, event.target.value)}>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    {payments.some((payment) => resolveId(payment.order) === order._id && payment.paymentStatus === 'pending') && (
                      <button className="secondary-btn" type="button" onClick={() => handleCollectCOD(order._id)}>Collect COD</button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card dashboard-card-medium">
          <div className="section-header">
            <div>
              <h2>Payment management</h2>
              <p className="text-muted">Track pending COD receipts and payment details for recent orders.</p>
            </div>
          </div>
          {visiblePayments.length === 0 ? (
            <p>No COD payment records found.</p>
          ) : (
            <div className="list-table">
              <div className="list-table-header">
                <span>Order</span>
                <span>Customer</span>
                <span>Amount</span>
                <span>Method</span>
                <span>Status</span>
                <span>Action</span>
              </div>
              {visiblePayments.map((payment) => {
                const paymentOrderId = resolveId(payment.order);
                return (
                  <div key={payment._id} className="list-table-row">
                    <span>#{paymentOrderId?.slice(-6)}</span>
                    <span>{payment.user?.name || payment.user?.email || 'Unknown'}</span>
                    <span>₹{payment.amount}</span>
                    <span>{payment.paymentMethod || payment.method}</span>
                    <span>{payment.paymentStatus}</span>
                    <span className="summary-action-group">
                      {['cash_on_delivery', 'COD', 'cash on delivery'].includes((payment.paymentMethod || payment.method || '').toLowerCase()) && payment.paymentStatus === 'pending' ? (
                        <button className="secondary-btn" type="button" onClick={() => handleCollectCOD(paymentOrderId)}>Collect</button>
                      ) : (
                        <span className="text-muted">No action</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="dashboard-card">
          <h2>Category management</h2>
          <form className="card-form" onSubmit={handleCategorySubmit}>
            <label>
              Category name
              <input value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} required />
            </label>
            <label>
              Description
              <input value={categoryForm.description} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} />
            </label>
            {error && <p className="error-text">{error}</p>}
            <div className="form-row">
              <button className="primary-btn" type="submit">{editingCategory ? 'Update category' : 'Create category'}</button>
              {editingCategory && <button type="button" className="secondary-btn" onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', description: '' }); }}>Cancel</button>}
            </div>
          </form>
          <div className="category-list">
            {categories.map((category) => (
              <div key={category._id} className="summary-item">
                <div>
                  <strong>{category.name}</strong>
                  <p className="text-muted">{category.description || 'No description'}</p>
                </div>
                <div className="summary-action-group">
                  <button className="secondary-btn" type="button" onClick={() => handleEditCategory(category)}>Edit</button>
                  <button className="ghost-btn" type="button" onClick={() => handleDeleteCategory(category._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
