'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { login, verifyTwoFactorLogin } from '@/lib/boemApi';
import './login.css';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingTwoFactorUserId, setPendingTwoFactorUserId] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  useEffect(() => {
    const registered = searchParams.get('registered');
    const verified = searchParams.get('verified');
    if (registered === 'true') {
      setSuccess('Account created successfully! You can now log in.');
    } else if (verified === 'true') {
      setSuccess('Email verified successfully! You can now log in.');
    } else if (verified === 'already') {
      setSuccess('Your email was already verified. Please log in.');
    }
  }, [searchParams]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!pendingTwoFactorUserId && (!formData.email || !formData.password)) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (pendingTwoFactorUserId && !twoFactorCode.trim()) {
      setError('Enter the 6-digit code from your authenticator app.');
      setLoading(false);
      return;
    }

    try {
      const response = pendingTwoFactorUserId
        ? await verifyTwoFactorLogin({
          user_id: pendingTwoFactorUserId,
          otp: twoFactorCode.trim(),
        })
        : await login({
          email: formData.email,
          password: formData.password,
        });

      if (response.user_id && !response.user) {
        setPendingTwoFactorUserId(response.user_id);
        setSuccess(response.message || 'Enter the code from your authenticator app to finish signing in.');
        setError('');
      } else if (response.user) {
        setPendingTwoFactorUserId(null);
        setTwoFactorCode('');
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          router.push(
            response.user.is_staff
              ? (
                response.user.can_manage_staff_workspace
                  ? '/dashboard-admin/team'
                  : '/dashboard-admin/workspace'
              )
              : '/dashboard',
          );
        }, 1500);
      } else {
        setError(response.message || response.error || 'Invalid credentials');
      }
    } catch (requestError) {
      setError(requestError.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@client.com',
      password: 'demo123',
      remember: false,
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your client portal</p>
        </div>

        {error && (
          <div className="auth-error-message">
            <span className="error-icon">!</span>
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success-message">
            <span className="success-icon">OK</span>
            {success}
          </div>
        )}

        <form className="auth-form" id="loginForm" onSubmit={handleSubmit}>
          {!pendingTwoFactorUserId ? (
            <>
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
            </>
          ) : (
            <div className="form-group">
              <label htmlFor="twoFactorCode">Authenticator Code</label>
              <input
                type="text"
                id="twoFactorCode"
                name="twoFactorCode"
                value={twoFactorCode}
                onChange={(event) => setTwoFactorCode(event.target.value)}
                required
                inputMode="numeric"
                placeholder="Enter 6-digit code"
                disabled={loading}
              />
              <div className="password-options">
                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => {
                    setPendingTwoFactorUserId(null);
                    setTwoFactorCode('');
                    setError('');
                    setSuccess('');
                  }}
                >
                  Back to password
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                {pendingTwoFactorUserId ? 'Verifying Code...' : 'Signing In...'}
              </>
            ) : (
              pendingTwoFactorUserId ? 'Verify Code' : 'Sign In'
            )}
          </button>
        </form>

        <div className="social-login">
          <div className="divider">
            <span>Or continue with</span>
          </div>
          <div className="social-buttons">
            <button type="button" className="social-button google" disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" />
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" />
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" />
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" />
              </svg>
              Google
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Don&apos;t have an account? <Link href="/register">Sign up here</Link>
          </p>
        </div>
      </div>

      <div className="demo-credentials">
        <h3>Demo Access</h3>
        <p>
          <strong>Email:</strong> demo@client.com
        </p>
        <p>
          <strong>Password:</strong> demo123
        </p>
        <button id="demoLogin" className="demo-button" onClick={handleDemoLogin} disabled={loading}>
          Try Demo
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-container">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
