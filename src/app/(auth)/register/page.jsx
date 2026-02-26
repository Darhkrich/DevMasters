// app/(auth)/register/page.jsx - UPDATED LAYOUT
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './register.css';

export default function RegisterPage() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
    newsletter: false
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    length: false,
    upper: false,
    lower: false,
    number: false
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field-specific error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

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

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    
    // Email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password match
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Password strength
    if (formData.password && passwordStrength.score < 3) {
      newErrors.password = 'Please use a stronger password';
    }

    // Terms agreement
    if (!formData.terms) {
      newErrors.terms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      // Simulate API call (will be replaced with Django API)
      const response = await simulateAPICall('/api/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company || null,
        email: formData.email,
        password: formData.password,
        newsletter: formData.newsletter
      });

      if (response.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        
        // Store user data (optional, depends on your flow)
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setErrors({ general: response.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Mock API call function
  const simulateAPICall = (url, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate email already exists error
        if (data.email === 'demo@client.com') {
          resolve({
            success: false,
            message: 'Email already registered'
          });
        } else {
          resolve({
            success: true,
            user: {
              id: 'user-' + Date.now(),
              email: data.email,
              name: `${data.firstName} ${data.lastName}`,
              company: data.company,
              role: 'user'
            },
            token: 'register-token-' + Date.now()
          });
        }
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

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        {/* Header */}
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join our client portal to manage your projects</p>
        </div>

        {/* General error message */}
        {errors.general && (
          <div className="auth-error-message">
            <span className="error-icon">⚠️</span>
            {errors.general}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="auth-success-message">
            <span className="success-icon">✅</span>
            {success}
          </div>
        )}

        {/* Sign Up Form */}
        <form className="auth-form" id="signupForm" onSubmit={handleSubmit}>
          {/* Personal Info Section - Two Columns */}
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            <div className="form-row form-row-double">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="John"
                  disabled={loading}
                  className={errors.firstName ? 'input-error' : ''}
                />
                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
                  disabled={loading}
                  className={errors.lastName ? 'input-error' : ''}
                />
                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-row form-row-double">
              <div className="form-group">
                <label htmlFor="company">Company Name (Optional)</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your Company"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="signupEmail">Email Address *</label>
                <input
                  type="email"
                  id="signupEmail"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  disabled={loading}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
            </div>
          </div>

          {/* Password Section - Two Columns */}
          <div className="form-section">
            <h3 className="section-title">Account Security</h3>
            <div className="form-row form-row-double">
              <div className="form-group">
                <label htmlFor="signupPassword">Password *</label>
                <input
                  type="password"
                  id="signupPassword"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password"
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

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
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
                  <span className="error-message" id="passwordMatchError">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Terms Section - Full Width */}
          <div className="form-section">
            <h3 className="section-title">Agreements</h3>
            
            <div className="form-row form-row-full">
              <div className="checkbox-group">
                <label className={`checkbox-label ${errors.terms ? 'checkbox-error' : ''}`}>
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <span>
                    I agree to the <Link href="/terms">Terms of Service</Link> and{' '}
                    <Link href="/privacy">Privacy Policy</Link> *
                  </span>
                </label>
                {errors.terms && <span className="field-error">{errors.terms}</span>}
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span>Send me product updates and tips</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-section submit-section">
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        {/* Social Sign Up */}
        <div className="social-login">
          <div className="divider">
            <span>Or sign up with</span>
          </div>
          <div className="social-buttons">
            <button 
              type="button" 
              className="social-button google"
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Google
            </button>
          </div>
        </div>

        {/* Login Link */}
        <div className="auth-footer">
          <p>Already have an account? <Link href="/login">Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
}