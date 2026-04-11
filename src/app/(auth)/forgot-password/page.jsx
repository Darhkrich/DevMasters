'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { requestPasswordReset } from '@/lib/boemApi';
import './forgot-password.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!countdown) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCountdown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown]);

  const submitResetRequest = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await requestPasswordReset(normalizedEmail);
      setSuccessMessage(
        response.message || 'If the email exists, a reset link has been sent.',
      );
      setCountdown(60);
    } catch (requestError) {
      setError(requestError.message || 'Unable to send the reset link right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await submitResetRequest();
  };

  const handleResend = async () => {
    if (loading || countdown > 0) {
      return;
    }

    await submitResetRequest();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>Enter your account email and we will send a reset link.</p>
        </div>

        <div className="reset-instructions">
          <p>The reset link from DevMasters expires after 1 hour for security reasons.</p>
        </div>

        {error ? (
          <div className="auth-error-message">{error}</div>
        ) : null}

        {successMessage ? (
          <div className="success-container">
            <div className="auth-success-message">
              <div>
                <p><strong>Reset email requested</strong></p>
                <p>{successMessage}</p>
                <p>
                  Please check <strong>{email}</strong> and follow the link in that email.
                </p>
              </div>
            </div>

            <div className="success-actions">
              <p className="resend-text">
                Need another email?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  className="resend-link"
                  disabled={loading || countdown > 0}
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Email'}
                </button>
              </p>
            </div>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="resetEmail">Email Address</label>
              <input
                type="email"
                id="resetEmail"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@example.com"
                disabled={loading}
              />
              <div className="input-hint">
                <small>Use the same email you signed up with.</small>
              </div>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="additional-help">
          <div className="help-item">
            <span>Still stuck? You can also contact support after logging in.</span>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            <Link href="/login" className="back-link">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
