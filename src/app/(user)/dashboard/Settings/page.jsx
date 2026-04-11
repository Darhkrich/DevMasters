'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  deleteUserAccount,
  fetchUserProfile,
  changePassword,
  changeEmail,
  logout,
  setupTwoFactor,
  verifyTwoFactorSetup,
  updateUserProfile,
} from '@/lib/boemApi';
import './setting.css';

function getInitials(firstName, lastName, fallback = 'U') {
  const value = [firstName, lastName]
    .map((part) => (part || '').trim())
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
  return value || fallback;
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savingSection, setSavingSection] = useState('');
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [twoFactorSetup, setTwoFactorSetup] = useState(null);
  const [twoFactorOtp, setTwoFactorOtp] = useState('');
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);

  // Combined user + profile data (as returned by UserProfileSerializer)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    timezone: '',
    language: '',
    date_format: 'MM/DD/YYYY',
    two_factor_auth_enabled: false,
    login_notifications_enabled: true,
    notification_preferences: { email: true },
  });

  // Separate states for password/email forms
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
          timezone: data.timezone || 'UTC',
          language: data.language || 'en',
          date_format: data.date_format || 'MM/DD/YYYY',
          two_factor_auth_enabled: data.two_factor_auth_enabled ?? false,
          login_notifications_enabled: data.login_notifications_enabled ?? true,
          notification_preferences: data.notification_preferences || { email: true },
        });
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Handlers
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleToggleChange = (toggleName) => {
    setFormData((prev) => {
      if (toggleName === 'loginNotifications') {
        return {
          ...prev,
          login_notifications_enabled: !prev.login_notifications_enabled,
        };
      }

      if (toggleName === 'emailNotifications') {
        return {
          ...prev,
          notification_preferences: {
            ...prev.notification_preferences,
            email: !(prev.notification_preferences?.email ?? true),
          },
        };
      }

      return prev;
    });
  };

  const syncProfileState = (data) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
      notification_preferences: data.notification_preferences || prev.notification_preferences,
      two_factor_auth_enabled: data.two_factor_auth_enabled ?? prev.two_factor_auth_enabled,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSavingSection('profile');
    try {
      const updatedProfile = await updateUserProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        bio: formData.bio,
      });
      syncProfileState(updatedProfile);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSavingSection('');
    }
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSavingSection('account');
    try {
      const updatedProfile = await updateUserProfile({
        language: formData.language,
        timezone: formData.timezone,
        date_format: formData.date_format,
      });
      syncProfileState(updatedProfile);
      setSuccess('Account preferences updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update account preferences');
    } finally {
      setSavingSection('');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setSuccess('');
    try {
      await changePassword({
        old_password: currentPassword,
        new_password: newPassword,
      });
      setSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to change password');
    }
  };

  const handleSecurityPreferencesSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSavingSection('security');
    try {
      const updatedProfile = await updateUserProfile({
        login_notifications_enabled: formData.login_notifications_enabled,
      });
      syncProfileState(updatedProfile);
      setSuccess('Security preferences updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update security preferences');
    } finally {
      setSavingSection('');
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!newEmail) return;
    setError('');
    setSuccess('');
    try {
      await changeEmail({ new_email: newEmail });
      setSuccess('Email change requested. Check your new email for verification.');
      setNewEmail('');
    } catch (err) {
      setError(err.message || 'Failed to change email');
    }
  };

  const handleNotificationPreferencesSubmit = async () => {
    setError('');
    setSuccess('');
    setSavingSection('notifications');
    try {
      const updatedProfile = await updateUserProfile({
        notification_preferences: formData.notification_preferences,
      });
      syncProfileState(updatedProfile);
      setSuccess('Notification preferences updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update notification preferences');
    } finally {
      setSavingSection('');
    }
  };

  const handleNavClick = (section, e) => {
    e.preventDefault();
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const handleMenuToggle = () => setSidebarOpen(!sidebarOpen);

  const handleStartTwoFactorSetup = async () => {
    setTwoFactorLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = await setupTwoFactor();
      setTwoFactorSetup(payload);
      setTwoFactorOtp('');
      setSuccess('Scan the QR code with your authenticator app, then enter the generated code.');
    } catch (err) {
      setError(err.message || 'Unable to start two-factor authentication setup');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleVerifyTwoFactorSetup = async () => {
    if (!twoFactorOtp.trim()) {
      setError('Enter the authenticator code to verify 2FA setup.');
      return;
    }

    setTwoFactorLoading(true);
    setError('');
    setSuccess('');
    try {
      await verifyTwoFactorSetup({ otp: twoFactorOtp.trim() });
      setFormData((prev) => ({ ...prev, two_factor_auth_enabled: true }));
      setTwoFactorSetup(null);
      setTwoFactorOtp('');
      setSuccess('Two-factor authentication is now enabled on your account.');
    } catch (err) {
      setError(err.message || 'Unable to verify the authenticator code');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    setError('');
    setSuccess('');
    try {
      await logout();
      router.replace('/login');
    } catch (err) {
      setError(err.message || 'Failed to log out');
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation.trim().toLowerCase() !== 'delete') {
      setError('Type DELETE to confirm account deletion.');
      return;
    }

    if (!confirm('Delete your account permanently? This cannot be undone.')) {
      return;
    }

    setDeleteLoading(true);
    setError('');
    setSuccess('');
    try {
      await deleteUserAccount();
      router.replace('/');
    } catch (err) {
      setError(err.message || 'Failed to delete your account');
    } finally {
      setDeleteLoading(false);
    }
  };

  const navItems = [
    { id: 'profile', icon: 'fas fa-user', label: 'Profile' },
    { id: 'account', icon: 'fas fa-cog', label: 'Account' },
    { id: 'security', icon: 'fas fa-shield-alt', label: 'Security' },
    { id: 'notifications', icon: 'fas fa-bell', label: 'Notifications' },
    { id: 'preferences', icon: 'fas fa-palette', label: 'Preferences' },
  ];

  if (loading) return <div className="st-loading">Loading settings...</div>;

  const profileInitials = getInitials(formData.first_name, formData.last_name);

  return (
    <div className="st-dashboard-container">
      <main className="st-main-content">
        <header className="st-top-header">
          <div className="st-header-left">
            <button className="st-menu-toggle" onClick={handleMenuToggle}>
              <i className="fas fa-bars"></i>
            </button>
            <h1>Settings</h1>
          </div>
          <div className="st-header-right">
            <div className="st-search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="st-header-actions">
              <button className="st-icon-btn">
                <i className="fas fa-bell"></i>
                <span className="st-notification-dot"></span>
              </button>
              <button className="st-icon-btn">
                <i className="fas fa-envelope"></i>
              </button>
            </div>
          </div>
        </header>

        <div className="st-content-area">
          {error && <div className="st-error-message">{error}</div>}
          {success && <div className="st-success-message">{success}</div>}

          <div className="st-settings-container">
            <div className={`st-settings-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
              <nav className="st-settings-nav">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    className={`st-settings-nav-item ${activeSection === item.id ? 'active' : ''}`}
                    onClick={(e) => handleNavClick(item.id, e)}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="st-settings-content">
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <section className="st-settings-section">
                  <h2>Profile Settings</h2>
                  <div className="st-form-group">
                    <div className="st-avatar-upload">
                      <div className="st-avatar-preview">
                        <div className="st-avatar-fallback" aria-hidden="true">
                          {profileInitials}
                        </div>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleProfileSubmit}>
                    <div className="st-form-row">
                      <div className="st-form-group">
                        <label htmlFor="first_name">First Name</label>
                        <input
                          type="text"
                          id="first_name"
                          className="st-form-control"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="st-form-group">
                        <label htmlFor="last_name">Last Name</label>
                        <input
                          type="text"
                          id="last_name"
                          className="st-form-control"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="st-form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        className="st-form-control"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="st-form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        className="st-form-control"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="st-form-group">
                      <label htmlFor="bio">Bio</label>
                      <textarea
                        id="bio"
                        className="st-form-control"
                        rows="4"
                        placeholder="Tell us about yourself..."
                        value={formData.bio}
                        onChange={handleInputChange}
                      />
                    </div>
                    <button type="submit" className="st-btn st-btn-primary">
                      <i className="fas fa-save"></i> {savingSection === 'profile' ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </section>
              )}

              {/* Account Section */}
              {activeSection === 'account' && (
                <section className="st-settings-section">
                  <h2>Account Settings</h2>
                  <form onSubmit={handleAccountSubmit}>
                    <div className="st-form-group">
                      <label htmlFor="language">Language</label>
                      <select
                        id="language"
                        className="st-form-control"
                        value={formData.language}
                        onChange={handleInputChange}
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    <div className="st-form-group">
                      <label htmlFor="timezone">Timezone</label>
                      <select
                        id="timezone"
                        className="st-form-control"
                        value={formData.timezone}
                        onChange={handleInputChange}
                      >
                        <option value="America/New_York">(GMT-05:00) Eastern Time</option>
                        <option value="America/Los_Angeles">(GMT-08:00) Pacific Time</option>
                        <option value="UTC">(GMT+00:00) Greenwich Mean Time</option>
                        <option value="Europe/Berlin">(GMT+01:00) Central European Time</option>
                      </select>
                    </div>
                    <div className="st-form-group">
                      <label htmlFor="date_format">Date Format</label>
                      <select
                        id="date_format"
                        className="st-form-control"
                        value={formData.date_format}
                        onChange={handleInputChange}
                      >
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div className="st-form-group">
                      <label htmlFor="newEmail">Change Email</label>
                      <div className="st-input-group">
                        <input
                          type="email"
                          id="newEmail"
                          className="st-form-control"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="New email address"
                        />
                        <button
                          type="button"
                          className="st-btn st-btn-outline"
                          onClick={handleEmailSubmit}
                        >
                          Request Change
                        </button>
                      </div>
                      <small>We&apos;ll send a verification link to the new address.</small>
                    </div>
                    <button type="submit" className="st-btn st-btn-primary" disabled={savingSection === 'account'}>
                      <i className="fas fa-save"></i> {savingSection === 'account' ? 'Updating...' : 'Update Account'}
                    </button>
                  </form>

                  <div className="st-account-actions">
                    <div className="st-account-action-card">
                      <div className="st-account-action-copy">
                        <h3>Sign out</h3>
                        <p>End your current session on this device and return to the login screen.</p>
                      </div>
                      <button
                        type="button"
                        className="st-btn st-btn-outline"
                        onClick={handleLogout}
                        disabled={logoutLoading}
                      >
                        <i className="fas fa-sign-out-alt"></i>
                        {logoutLoading ? 'Signing out...' : 'Logout'}
                      </button>
                    </div>

                    <div className="st-account-action-card st-account-action-card-danger">
                      <div className="st-account-action-copy">
                        <h3>Delete account</h3>
                        <p>
                          This permanently removes your account access. Type <strong>DELETE</strong> before continuing.
                        </p>
                      </div>

                      <div className="st-delete-confirm-row">
                        <input
                          type="text"
                          className="st-form-control"
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder="Type DELETE to confirm"
                        />
                        <button
                          type="button"
                          className="st-btn st-btn-danger"
                          onClick={handleDeleteAccount}
                          disabled={deleteLoading}
                        >
                          <i className="fas fa-trash-alt"></i>
                          {deleteLoading ? 'Deleting...' : 'Delete Account'}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <section className="st-settings-section">
                  <h2>Security Settings</h2>
                  <div className="st-security-card">
                    <div className="st-security-copy">
                      <h3>Two-Factor Authentication</h3>
                      <p>
                        Protect this account with a one-time code from an authenticator app during sign-in.
                      </p>
                    </div>
                    <span className={`st-security-badge ${formData.two_factor_auth_enabled ? 'enabled' : 'disabled'}`}>
                      {formData.two_factor_auth_enabled ? 'Enabled' : 'Not enabled'}
                    </span>
                  </div>

                  {!formData.two_factor_auth_enabled && !twoFactorSetup && (
                    <button
                      type="button"
                      className="st-btn st-btn-outline"
                      onClick={handleStartTwoFactorSetup}
                      disabled={twoFactorLoading}
                    >
                      <i className="fas fa-qrcode"></i>
                      {twoFactorLoading ? 'Preparing...' : 'Start 2FA Setup'}
                    </button>
                  )}

                  {twoFactorSetup && !formData.two_factor_auth_enabled && (
                    <div className="st-twofactor-panel">
                      <div className="st-twofactor-qr">
                        <Image
                          src={`data:image/png;base64,${twoFactorSetup.qr_code}`}
                          alt="Authenticator QR code"
                          width={160}
                          height={160}
                          unoptimized
                        />
                      </div>
                      <div className="st-twofactor-body">
                        <p>Scan this QR code in Google Authenticator, Authy, 1Password, or another TOTP app.</p>
                        <code className="st-twofactor-secret">{twoFactorSetup.secret}</code>
                        <div className="st-input-group">
                          <input
                            type="text"
                            className="st-form-control"
                            inputMode="numeric"
                            value={twoFactorOtp}
                            onChange={(e) => setTwoFactorOtp(e.target.value)}
                            placeholder="Enter 6-digit code"
                          />
                          <button
                            type="button"
                            className="st-btn st-btn-primary"
                            onClick={handleVerifyTwoFactorSetup}
                            disabled={twoFactorLoading}
                          >
                            {twoFactorLoading ? 'Verifying...' : 'Verify & Enable'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handlePasswordSubmit}>
                    <div className="st-form-group">
                      <label htmlFor="currentPassword">Current Password</label>
                      <input
                        type="password"
                        id="currentPassword"
                        className="st-form-control"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="st-form-row">
                      <div className="st-form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          className="st-form-control"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="st-form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          className="st-form-control"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <button type="submit" className="st-btn st-btn-primary">
                      <i className="fas fa-key"></i> Change Password
                    </button>
                  </form>

                  <form onSubmit={handleSecurityPreferencesSubmit}>
                    <div className="st-toggle-label">
                      <div className="st-toggle-text">
                        <h4>Login Notifications</h4>
                        <p>Get notified when someone logs into your account</p>
                      </div>
                      <label className="st-toggle-switch">
                        <input
                          type="checkbox"
                          checked={formData.login_notifications_enabled}
                          onChange={() => handleToggleChange('loginNotifications')}
                        />
                        <span className="st-toggle-slider"></span>
                      </label>
                    </div>
                    <button type="submit" className="st-btn st-btn-primary">
                      <i className="fas fa-save"></i> {savingSection === 'security' ? 'Saving...' : 'Update Security'}
                    </button>
                  </form>
                </section>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <section className="st-settings-section">
                  <h2>Notification Preferences</h2>
                  <div className="st-toggle-label">
                    <div className="st-toggle-text">
                      <h4>Email Notifications</h4>
                      <p>Receive email updates about your account</p>
                    </div>
                    <label className="st-toggle-switch">
                      <input
                        type="checkbox"
                        checked={formData.notification_preferences?.email ?? true}
                        onChange={() => handleToggleChange('emailNotifications')}
                      />
                      <span className="st-toggle-slider"></span>
                    </label>
                  </div>
                  <button
                    type="button"
                    className="st-btn st-btn-primary"
                    onClick={handleNotificationPreferencesSubmit}
                    disabled={savingSection === 'notifications'}
                  >
                    <i className="fas fa-save"></i> {savingSection === 'notifications' ? 'Saving...' : 'Save Notifications'}
                  </button>
                </section>
              )}

              {/* Preferences Section */}
              {activeSection === 'preferences' && (
                <section className="st-settings-section">
                  <h2>Preferences</h2>
                  <p>Theme, color scheme, and other preferences coming soon.</p>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
