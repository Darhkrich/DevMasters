'use client';
import Link from 'next/link';
import { useState } from 'react';
import './styles.css';
export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    secretKey: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Add actual login logic here
    console.log('Login attempt:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Login functionality would be implemented here');
    }, 1000);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('admin-', '').replace('-', '')]: value
    }));
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-logo">🛡</div>
        <h1 className="admin-title">Admin Portal Access</h1>
        <p className="admin-subtitle">Restricted area - Authorized personnel only</p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin-email">Admin Email</label>
            <input
              type="email"
              id="admin-email"
              className="form-input"
              placeholder="admin@websiteseller.com"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Admin Password</label>
            <input
              type="password"
              id="admin-password"
              className="form-input"
              placeholder="Enter admin password"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-secret-key">Security Key</label>
            <input
              type="password"
              id="admin-secret-key"
              className="form-input"
              placeholder="Enter security key"
              required
              value={formData.secretKey}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : '🔐 Access Admin Dashboard'}
          </button>
        </form>

        <Link href="/" className="back-link">
          ← Back to Main Website
        </Link>

        <div className="security-notice">
          <strong>Security Notice:</strong> This area is monitored. All access attempts are logged.
        </div>
      </div>
    </div>
  );
}