import React, { useState } from 'react';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await onLogin(formData.email, formData.password);
    if (!result.success) setError(result.error);
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h2 className="page-title" style={{ textAlign: 'center' }}>RapidAid Admin Login</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <div style={{ marginTop: 16, color: '#6b7280', fontSize: 13, textAlign: 'center' }}>
          Tip: Use your SuperAdmin/Manager account to access full features.
        </div>
      </div>
    </div>
  );
}

export default Login;
