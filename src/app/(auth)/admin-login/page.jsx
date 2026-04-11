'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession, login, verifyTwoFactorLogin } from '@/lib/boemApi';
import './styles.css';
export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
   
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingTwoFactorUserId, setPendingTwoFactorUserId] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

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
        setSuccess(response.message || 'Enter the authenticator code to finish admin sign-in.');
        setError('');
      } else if (!response.user?.is_staff) {
        clearSession();
        setError('This account does not have admin access.');
      } else {
        setPendingTwoFactorUserId(null);
        setTwoFactorCode('');
        setSuccess('Admin access granted. Redirecting...');
        setTimeout(() => {
          router.push(
            response.user?.can_manage_staff_workspace
              ? '/dashboard-admin/team'
              : '/dashboard-admin/workspace',
          );
        }, 1000);
      }
    } catch (requestError) {
      setError(requestError.message || 'Unable to sign in to the admin dashboard.');
    } finally {
      setIsSubmitting(false);
    }
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
        {error && <div className="security-notice">{error}</div>}
        {success && <div className="security-notice">{success}</div>}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          {!pendingTwoFactorUserId ? (
            <>
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
            </>
          ) : (
            <div className="form-group">
              <label htmlFor="admin-twofactor">Authenticator Code</label>
              <input
                type="text"
                id="admin-twofactor"
                className="form-input"
                placeholder="Enter 6-digit code"
                required
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="back-link"
                onClick={() => {
                  setPendingTwoFactorUserId(null);
                  setTwoFactorCode('');
                  setError('');
                  setSuccess('');
                }}
              >
                ← Back to password
              </button>
            </div>
          )}

         

          <button 
            type="submit" 
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : pendingTwoFactorUserId ? 'Verify Admin Code' : '🔐 Access Admin Dashboard'}
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
