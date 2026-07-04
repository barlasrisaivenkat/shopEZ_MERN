import { useState } from 'react';
import { authApi, setAuthToken } from '../services/api';

function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = mode === 'login'
        ? await authApi.login({ email: form.email, password: form.password })
        : await authApi.register({ name: form.name, email: form.email, password: form.password, role: form.role });

      const token = response.data?.token;
      const user = response.data?.user;
      setAuthToken(token);
      onAuth(user);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <div className="auth-toggle">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
        </div>

        <form className="card-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              Name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </label>
          )}

          <label>
            Email
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>

          <label>
            Password
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          </label>

          {mode === 'register' && (
            <label>
              Role
              <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                <option value="user">User</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          )}

          {error && <p className="error-text">{error}</p>}
          <button className="primary-btn" type="submit">{mode === 'login' ? 'Login' : 'Create account'}</button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
