// app/(auth)/login/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './login.css';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call (mocking your current JavaScript)
      const response = await simulateAPICall('/api/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        setSuccess('Login successful! Redirecting...');
        
        // Store auth data (for demo purposes)
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        
        // Redirect after 1.5 seconds (matching your current timing)
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setError(response.message || 'Invalid credentials');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle demo login
  const handleDemoLogin = () => {
    // Auto-fill form with demo credentials
    setFormData({
      email: 'demo@client.com',
      password: 'demo123',
      remember: false
    });
    
    // Submit the form automatically
    const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
    const form = document.getElementById('loginForm');
    if (form) {
      form.dispatchEvent(submitEvent);
    }
  };

  // Mock API call function (matches your JavaScript)
  const simulateAPICall = (url, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo credentials check
        if (data.email === 'demo@client.com' && data.password === 'demo123') {
          resolve({
            success: true,
            user: {
              id: 'demo-001',
              email: data.email,
              name: 'Demo User',
              role: 'user'
            },
            token: 'demo-token-12345'
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid email or password'
          });
        }
      }, 1000);
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your client portal</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="auth-error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        {success && (
          <div className="auth-success-message">
            <span className="success-icon">✅</span>
            {success}
          </div>
        )}

        {/* Login Form */}
        <form className="auth-form" id="loginForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              disabled={loading}
            />
            <div className="password-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  disabled={loading}
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Social Login */}
        <div className="social-login">
          <div className="divider">
            <span>Or continue with</span>
          </div>
          <div className="social-buttons">
            <button 
              type="button" 
              className="social-button google"
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Google
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="auth-footer">
          <p>Don&apos;t have an account? <Link href="/register">Sign up here</Link></p>
        </div>
      </div>

      {/* Demo Credentials */}
      <div className="demo-credentials">
        <h3>Demo Access</h3>
        <p><strong>Email:</strong> demo@client.com</p>
        <p><strong>Password:</strong> demo123</p>
        <button 
          id="demoLogin" 
          className="demo-button"
          onClick={handleDemoLogin}
          disabled={loading}
        >
          Try Demo
        </button>
      </div>
    </div>
  );
}