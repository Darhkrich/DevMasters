'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/lib/boemApi';
import './reset-password.css';

function getStrengthInfo(password) {
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  return {
    score,
    checks,
    label:
      score <= 1 ? 'Weak' : score === 2 ? 'Fair' : score === 3 ? 'Good' : 'Strong',
    width: `${Math.max(score, 1) * 25}%`,
  };
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [resetParams, setResetParams] = useState({ uid: '', token: '' });
  const [linkChecked, setLinkChecked] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordStrength = useMemo(() => getStrengthInfo(password), [password]);
  const hasResetToken = Boolean(resetParams.uid && resetParams.token);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    setResetParams({
      uid: params.get('uid') || '',
      token: params.get('token') || '',
    });
    setLinkChecked(true);
  }, []);

  useEffect(() => {
    if (!success) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      router.push('/login');
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [router, success]);

  const validateForm = () => {
    const nextErrors = {};

    if (!password) {
      nextErrors.password = 'Please enter a new password.';
    } else if (passwordStrength.score < 3) {
      nextErrors.password = 'Use at least 8 characters with upper, lower, and number.';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        uid: resetParams.uid,
        token: resetParams.token,
        new_password: password,
      });
      setSuccess(true);
      setErrors({});
    } catch (requestError) {
      setErrors({
        general: requestError.message || 'Unable to reset your password.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!linkChecked) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="token-checking">
            <h2>Checking reset link...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!hasResetToken) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="invalid-token">
            <h2>Invalid or incomplete reset link</h2>
            <p className="error-description">
              This page needs both a <code>uid</code> and <code>token</code> from the reset
              email.
            </p>
            <div className="recovery-options">
              <Link href="/forgot-password" className="auth-button">
                Request New Reset Link
              </Link>
              <Link href="/login" className="back-to-login">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Set a New Password</h1>
          <p>Create a stronger password for your account.</p>
        </div>

        {errors.general ? (
          <div className="auth-error-message">{errors.general}</div>
        ) : null}

        {success ? (
          <div className="success-container">
            <div className="auth-success-message">
              <div className="success-content">
                <h3>Password Updated</h3>
                <p>Your password has been reset successfully.</p>
                <p className="redirect-notice">Redirecting to login in 3 seconds...</p>
              </div>
            </div>

            <div className="immediate-action">
              <Link href="/login" className="auth-button">
                Go to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="password-guidelines">
              <h4>Password Requirements</h4>
              <ul>
                <li>Minimum 8 characters</li>
                <li>At least one uppercase letter</li>
                <li>At least one lowercase letter</li>
                <li>At least one number</li>
              </ul>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter new password"
                  className={errors.password ? 'input-error' : ''}
                />

                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                  <span className="strength-text">{passwordStrength.label}</span>
                </div>

                {errors.password ? <span className="field-error">{errors.password}</span> : null}
              </div>

              <div className="form-group">
                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  disabled={loading}
                  placeholder="Confirm new password"
                  className={errors.confirmPassword ? 'input-error' : ''}
                />

                <div className="requirements-container">
                  <ul className="password-requirements">
                    <li className={passwordStrength.checks.length ? 'requirement-met' : ''}>
                      At least 8 characters
                    </li>
                    <li className={passwordStrength.checks.upper ? 'requirement-met' : ''}>
                      One uppercase letter
                    </li>
                    <li className={passwordStrength.checks.lower ? 'requirement-met' : ''}>
                      One lowercase letter
                    </li>
                    <li className={passwordStrength.checks.number ? 'requirement-met' : ''}>
                      One number
                    </li>
                  </ul>
                </div>

                {errors.confirmPassword ? (
                  <span className="field-error">{errors.confirmPassword}</span>
                ) : null}
              </div>

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Updating Password...' : 'Reset Password'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                <Link href="/login" className="back-link">
                  Back to login
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
