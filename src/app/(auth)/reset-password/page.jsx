// app/(auth)/reset-password/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './reset-password.css';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null); // null = checking, true = valid, false = invalid
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    length: false,
    upper: false,
    lower: false,
    number: false
  });

  // Check token validity on component mount
  useEffect(() => {
    // Get token from URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get('token');
      setToken(tokenFromUrl);
      
      const checkToken = async () => {
        if (!tokenFromUrl) {
          setTokenValid(false);
          return;
        }

        try {
          // Simulate token validation (will be replaced with Django API)
          const isValid = await validateResetToken(tokenFromUrl);
          setTokenValid(isValid);
        } catch (error) {
          setTokenValid(false);
        }
      };

      checkToken();
    }
  }, []);

  // Calculate password strength
  useEffect(() => {
    const password = formData.password;
    
    const checks = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password)
    };

    // Calculate score (0-4)
    const score = Object.values(checks).filter(Boolean).length;
    
    setPasswordStrength({
      score,
      ...checks
    });

    // Check password match in real-time
    if (formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  }, [formData.password, formData.confirmPassword]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field-specific error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Please use a stronger password';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      // Simulate API call (will be replaced with Django API)
      const response = await simulateResetPassword(token, formData.password);
      
      if (response.success) {
        setSuccess(true);
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setErrors({ general: response.message || 'Failed to reset password. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Mock token validation function
  const validateResetToken = async (token) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate token validation
        // In real app, this would check if token exists and isn't expired
        resolve(token && token.length > 10); // Simple validation for demo
      }, 1000);
    });
  };

  // Mock password reset function
  const simulateResetPassword = async (token, newPassword) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate success response
        resolve({
          success: true,
          message: 'Password reset successfully'
        });
      }, 1500);
    });
  };

  // Get strength text and color
  const getStrengthInfo = () => {
    const { score } = passwordStrength;
    if (score === 0) return { text: 'Very Weak', color: '#ff4444', width: '20%' };
    if (score === 1) return { text: 'Weak', color: '#ff8800', width: '40%' };
    if (score === 2) return { text: 'Fair', color: '#ffbb33', width: '60%' };
    if (score === 3) return { text: 'Good', color: '#00C851', width: '80%' };
    return { text: 'Strong', color: '#007E33', width: '100%' };
  };

  const strengthInfo = getStrengthInfo();

  // Show loading while checking token
  if (tokenValid === null) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="token-checking">
            <div className="spinner large"></div>
            <h2>Verifying Reset Link</h2>
            <p>Please wait while we validate your password reset request...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show invalid token message
  if (tokenValid === false) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="invalid-token">
            <div className="error-icon-large">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2>Invalid or Expired Link</h2>
            <p className="error-description">
              This password reset link is invalid or has expired. 
              Password reset links are only valid for 1 hour.
            </p>
            
            <div className="recovery-options">
              <Link href="/forgot-password" className="auth-button">
                Request New Reset Link
              </Link>
              <Link href="/login" className="back-to-login">
                Back to Login
              </Link>
            </div>
            
            <div className="security-notice">
              <h4>📝 Security Tips:</h4>
              <ul>
                <li>Links expire after 1 hour for security</li>
                <li>Make sure you're using the most recent reset email</li>
                <li>If problems persist, contact support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="header-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1>Set New Password</h1>
          <p>Create a strong new password for your account</p>
        </div>

        {/* General error message */}
        {errors.general && (
          <div className="auth-error-message">
            <span className="error-icon">⚠️</span>
            {errors.general}
          </div>
        )}

        {/* Success message */}
        {success ? (
          <div className="success-container">
            <div className="auth-success-message">
              <div className="success-icon-large">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="success-content">
                <h3>Password Reset Successful!</h3>
                <p>Your password has been updated successfully.</p>
                <p className="redirect-notice">
                  Redirecting to login page in 3 seconds...
                </p>
              </div>
            </div>
            
            <div className="immediate-action">
              <Link href="/login" className="auth-button">
                Go to Login Now
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Password Requirements */}
            <div className="password-guidelines">
              <h4>Password Requirements:</h4>
              <ul>
                <li>Minimum 8 characters</li>
                <li>At least one uppercase letter</li>
                <li>At least one lowercase letter</li>
                <li>At least one number</li>
                <li>Don't reuse old passwords</li>
              </ul>
            </div>

            {/* Reset Password Form */}
            <form className="auth-form" id="resetPasswordForm" onSubmit={handleSubmit}>
              {/* Password */}
              <div className="form-group">
                <label htmlFor="newPassword">New Password *</label>
                <input
                  type="password"
                  id="newPassword"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter new password"
                  disabled={loading}
                  className={errors.password ? 'input-error' : ''}
                />
                
                {/* Password strength indicator */}
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill" 
                      id="passwordStrength"
                      style={{
                        width: strengthInfo.width,
                        backgroundColor: strengthInfo.color
                      }}
                    ></div>
                  </div>
                  <span className="strength-text" id="passwordText">
                    {strengthInfo.text}
                  </span>
                </div>
                
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmNewPassword">Confirm New Password *</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm new password"
                  disabled={loading}
                  className={errors.confirmPassword ? 'input-error' : ''}
                />
                
                {/* Password requirements checklist */}
                <div className="requirements-container">
                  <ul className="password-requirements">
                    <li 
                      id="reqLength"
                      className={passwordStrength.length ? 'requirement-met' : ''}
                    >
                      ✓ At least 8 characters
                    </li>
                    <li 
                      id="reqUpper"
                      className={passwordStrength.upper ? 'requirement-met' : ''}
                    >
                      ✓ One uppercase letter
                    </li>
                    <li 
                      id="reqLower"
                      className={passwordStrength.lower ? 'requirement-met' : ''}
                    >
                      ✓ One lowercase letter
                    </li>
                    <li 
                      id="reqNumber"
                      className={passwordStrength.number ? 'requirement-met' : ''}
                    >
                      ✓ One number
                    </li>
                  </ul>
                </div>
                
                {errors.confirmPassword && (
                  <span className="field-error">{errors.confirmPassword}</span>
                )}
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Updating Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="security-notice reset-notice">
              <h4>🔒 Security Reminder:</h4>
              <ul>
                <li>This link can only be used once</li>
                <li>After resetting, you'll be logged out of all other devices</li>
                <li>Consider enabling two-factor authentication for added security</li>
              </ul>
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
          </>
        )}
      </div>
    </div>
  );
}