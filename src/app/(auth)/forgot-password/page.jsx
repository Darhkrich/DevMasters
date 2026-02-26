// app/(auth)/forgot-password/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './forgot-password.css';

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  // Form state
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call (will be replaced with Django API)
      const response = await simulateAPICall('/api/forgot-password', { email });
      
      if (response.success) {
        setSuccess(true);
        setError('');
        
        // Start countdown for resend email
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(response.message || 'Failed to send reset link. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle resend email
  const handleResend = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await simulateAPICall('/api/resend-reset-email', { email });
      
      if (response.success) {
        setSuccess(true);
        setCountdown(60);
        
        // Start countdown again
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(response.message || 'Failed to resend email.');
      }
    } catch (error) {
      setError('Failed to resend email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mock API call function
  const simulateAPICall = (url, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate success response
        resolve({
          success: true,
          message: 'Password reset link sent successfully'
        });
      }, 1500);
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="header-icon">
          
          </div>
          <h1>Reset Password</h1>
          <p>Enter your email to receive reset instructions</p>
        </div>

        {/* Instructions */}
        <div className="reset-instructions">
          <p>We'll send you a link to reset your password. This link will expire in 1 hour.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="auth-error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Success Message */}
        {success ? (
          <div className="success-container">
            <div className="auth-success-message">
              <span className="success-icon">✅</span>
              <div>
                <p><strong>Email Sent Successfully!</strong></p>
                <p>Check your inbox at <strong>{email}</strong> for password reset instructions.</p>
              </div>
            </div>
            
            <div className="success-actions">
              <p className="resend-text">
                Didn't receive the email?{' '}
                <button 
                  type="button" 
                  onClick={handleResend} 
                  className="resend-link"
                  disabled={countdown > 0 || loading}
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Email'}
                </button>
              </p>
              <p className="check-spam">
                <small>
                  💡 If you don't see the email, check your spam folder or try{' '}
                  <button 
                    type="button" 
                    onClick={() => setEmail('')}
                    className="text-link"
                  >
                    a different email address
                  </button>
                </small>
              </p>
            </div>
          </div>
        ) : (
          <form className="auth-form" id="forgotPasswordForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="resetEmail">Email Address</label>
              <input
                type="email"
                id="resetEmail"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                disabled={loading}
                className={error && !email ? 'input-error' : ''}
              />
              <div className="input-hint">
                <small>Enter the email address associated with your account</small>
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
                  Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        )}

        {/* Additional Help */}
        <div className="additional-help">
          <div className="help-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span>Having trouble? Contact <Link href="/support">Support</Link></span>
          </div>
          <div className="help-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>Make sure you have access to your email inbox</span>
          </div>
        </div>

        {/* Back to Login */}
        <div className="auth-footer">
          <p>
            <Link href="/login" className="back-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}