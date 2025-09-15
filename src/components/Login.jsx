import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const API_BASE = 'http://localhost:4000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(formData.name && formData.email)) return;
    setLoading(true);
    setError('');
    try {
      // Try login; if not registered, auto-register then login
      const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: 'password123' })
      });
      let authData;
      if (loginRes.ok) {
        authData = await loginRes.json();
      } else {
        const regRes = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, email: formData.email, password: 'password123' })
        });
        if (!regRes.ok) throw new Error('Registration failed');
        const loginRes2 = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: 'password123' })
        });
        if (!loginRes2.ok) throw new Error('Login failed');
        authData = await loginRes2.json();
      }
      // Persist token + hardcoded user identity
      login({ id: 'mudity', name: 'mudity', email: 'muditykumar414@gmail.com', token: authData.token });
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome to Tech Concepts Demo</h2>
        <p>Please login to continue</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            Login
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;


