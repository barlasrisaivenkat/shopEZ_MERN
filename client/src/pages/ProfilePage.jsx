import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await authApi.getProfile();
        const profile = response.data?.data || response.data?.user;
        setUser(profile);
        setForm({ name: profile.name || '', email: profile.email || '' });
      } catch (err) {
        console.error(err);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const response = await authApi.updateProfile(form);
      setUser(response.data?.data || response.data?.user);
      alert('Profile updated');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to update profile');
    }
  };

  return (
    <div className="page profile-page">
      <div className="section-header">
        <div>
          <h1>My Profile</h1>
          <p className="text-muted">Manage your account details and role access.</p>
        </div>
        {user?.role === 'admin' && <button className="secondary-btn" onClick={() => navigate('/admin')}>Go to Admin Dashboard</button>}
        {user?.role === 'seller' && <button className="secondary-btn" onClick={() => navigate('/seller')}>Go to Seller Dashboard</button>}
      </div>

      <div className="profile-grid">
        <section className="profile-card">
          <h2>Profile Details</h2>
          <form className="card-form" onSubmit={handleSave}>
            <label>
              Name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label>
              Email
              <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </label>
            <button className="primary-btn" type="submit">Save profile</button>
          </form>
        </section>

        {user && (
          <section className="profile-card profile-summary-card">
            <h2>Account Summary</h2>
            <div className="summary-item">
              <span>Name</span>
              <strong>{user.name}</strong>
            </div>
            <div className="summary-item">
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
            <div className="summary-item">
              <span>Role</span>
              <strong>{user.role}</strong>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
