'use client';

import { useState, useEffect } from 'react';
import './setting.css';

const SettingsDashboard = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    general: {
      companyName: 'Website Builder Pro',
      contactEmail: 'admin@websitebuilder.pro',
      phoneNumber: '+1 (555) 123-4567',
      websiteUrl: 'https://websitebuilder.pro',
      timezone: 'UTC-5 (Eastern Time)',
      dateFormat: 'MM/DD/YYYY (US)',
      currency: 'USD ($)',
      language: 'English',
      essentialPackage: 199,
      businessPackage: 299,
      ecommercePackage: 499
    },
    // Payments Settings
    payments: {
      stripeEnabled: true,
      stripePublishableKey: 'pk_live_xxxxxxxxxxxxxxxx',
      stripeSecretKey: 'sk_live_xxxxxxxxxxxxxxxx',
      bankTransferEnabled: true,
      bankDetails: `Account Name: Website Builder Pro\nBank: National Bank\nAccount Number: 123456789\nRouting: 021000021`,
      mobileMoneyEnabled: true,
      mobileNumber: '+1234567890',
      mobileProvider: 'MTN Mobile Money',
      taxRate: 0,
      taxNumber: ''
    },
    // Email Settings
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      emailAddress: 'noreply@websitebuilder.pro',
      smtpPassword: '',
      newOrderAlerts: true,
      paymentNotifications: true,
      clientMessages: true,
      teamAssignments: true
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Tab configuration
  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'payments', label: 'Payments' },
    { id: 'email', label: 'Email & Notifications' },
    { id: 'security', label: 'Security' },
    { id: 'templates', label: 'Templates' },
    { id: 'advanced', label: 'Advanced' }
  ];

  // Handle input changes
  const handleInputChange = (tab, field, value) => {
    setSettings(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value
      }
    }));
  };

  // Handle toggle switch changes
  const handleToggleChange = (tab, field) => {
    setSettings(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: !prev[tab][field]
      }
    }));
  };

  // Save all changes
  const handleSaveChanges = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Saving settings:', settings);
    
    setIsLoading(false);
    alert('Settings saved successfully!');
  };

  // Reset to defaults
  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        general: {
          companyName: 'Website Builder Pro',
          contactEmail: 'admin@websitebuilder.pro',
          phoneNumber: '+1 (555) 123-4567',
          websiteUrl: 'https://websitebuilder.pro',
          timezone: 'UTC-5 (Eastern Time)',
          dateFormat: 'MM/DD/YYYY (US)',
          currency: 'USD ($)',
          language: 'English',
          essentialPackage: 199,
          businessPackage: 299,
          ecommercePackage: 499
        },
        payments: {
          stripeEnabled: true,
          stripePublishableKey: 'pk_live_xxxxxxxxxxxxxxxx',
          stripeSecretKey: 'sk_live_xxxxxxxxxxxxxxxx',
          bankTransferEnabled: true,
          bankDetails: `Account Name: Website Builder Pro\nBank: National Bank\nAccount Number: 123456789\nRouting: 021000021`,
          mobileMoneyEnabled: true,
          mobileNumber: '+1234567890',
          mobileProvider: 'MTN Mobile Money',
          taxRate: 0,
          taxNumber: ''
        },
        email: {
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          emailAddress: 'noreply@websitebuilder.pro',
          smtpPassword: '',
          newOrderAlerts: true,
          paymentNotifications: true,
          clientMessages: true,
          teamAssignments: true
        }
      });
      alert('Settings have been reset to defaults.');
    }
  };

  // Test connection functions
  const testStripeConnection = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    alert('Stripe connection test completed successfully!');
  };

  const testEmailConnection = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    alert('Email connection test completed successfully!');
  };

  // Handle edit template
  const handleEditTemplate = (templateName) => {
    alert(`Opening editor for ${templateName} template`);
  };

  return (
    <main className="main-content">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>System Settings</h1>
          <p className="welcome-text">Manage your platform configuration and preferences</p>
        </div>
        <div className="header-right">
          <div className="security-badge">
            <span>🔒</span>
            Admin Access Only
          </div>
        </div>
      </header>

      {/* Settings Navigation */}
      <div className="settings-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            data-tab={tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="settings-content">
        {/* General Settings Tab */}
        <div className={`settings-tab-content ${activeTab === 'general' ? 'active' : ''}`} id="general-tab">
          <div className="content-card">
            <div className="card-header">
              <h2>General Settings</h2>
            </div>
            
            <div className="settings-form">
              <div className="form-section">
                <h3>Business Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Company Name</label>
                    <input 
                      type="text" 
                      value={settings.general.companyName}
                      onChange={(e) => handleInputChange('general', 'companyName', e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Email</label>
                    <input 
                      type="email" 
                      value={settings.general.contactEmail}
                      onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
                      placeholder="Contact email"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      value={settings.general.phoneNumber}
                      onChange={(e) => handleInputChange('general', 'phoneNumber', e.target.value)}
                      placeholder="Business phone"
                    />
                  </div>
                  <div className="form-group">
                    <label>Website URL</label>
                    <input 
                      type="url" 
                      value={settings.general.websiteUrl}
                      onChange={(e) => handleInputChange('general', 'websiteUrl', e.target.value)}
                      placeholder="Your website"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Platform Settings</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Default Timezone</label>
                    <select 
                      value={settings.general.timezone}
                      onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                    >
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+1 (Central European)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date Format</label>
                    <select 
                      value={settings.general.dateFormat}
                      onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)}
                    >
                      <option>MM/DD/YYYY (US)</option>
                      <option>DD/MM/YYYY (EU)</option>
                      <option>YYYY-MM-DD (ISO)</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Currency</label>
                    <select 
                      value={settings.general.currency}
                      onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
                    >
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>CAD (C$)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Language</label>
                    <select 
                      value={settings.general.language}
                      onChange={(e) => handleInputChange('general', 'language', e.target.value)}
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Package Pricing</h3>
                <div className="pricing-grid">
                  <div className="pricing-tier">
                    <h4>Essential Package</h4>
                    <input 
                      type="number" 
                      value={settings.general.essentialPackage}
                      onChange={(e) => handleInputChange('general', 'essentialPackage', e.target.value)}
                      placeholder="Price"
                    />
                    <small>Basic website with standard features</small>
                  </div>
                  <div className="pricing-tier">
                    <h4>Business Package</h4>
                    <input 
                      type="number" 
                      value={settings.general.businessPackage}
                      onChange={(e) => handleInputChange('general', 'businessPackage', e.target.value)}
                      placeholder="Price"
                    />
                    <small>Advanced features and customization</small>
                  </div>
                  <div className="pricing-tier">
                    <h4>E-commerce Package</h4>
                    <input 
                      type="number" 
                      value={settings.general.ecommercePackage}
                      onChange={(e) => handleInputChange('general', 'ecommercePackage', e.target.value)}
                      placeholder="Price"
                    />
                    <small>Full online store functionality</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Settings Tab */}
        <div className={`settings-tab-content ${activeTab === 'payments' ? 'active' : ''}`} id="payments-tab">
          <div className="content-card">
            <div className="card-header">
              <h2>Payment Settings</h2>
            </div>
            
            <div className="settings-form">
              <div className="form-section">
                <h3>Payment Methods</h3>
                
                {/* Stripe Configuration */}
                <div className="payment-method">
                  <div className="method-header">
                    <div className="method-info">
                      <span className="method-icon">💳</span>
                      <div>
                        <h4>Stripe Payments</h4>
                        <p>Credit card processing</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.payments.stripeEnabled}
                        onChange={() => handleToggleChange('payments', 'stripeEnabled')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  {settings.payments.stripeEnabled && (
                    <div className="method-config">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Publishable Key</label>
                          <input 
                            type="password" 
                            value={settings.payments.stripePublishableKey}
                            onChange={(e) => handleInputChange('payments', 'stripePublishableKey', e.target.value)}
                            placeholder="Stripe publishable key"
                          />
                        </div>
                        <div className="form-group">
                          <label>Secret Key</label>
                          <input 
                            type="password" 
                            value={settings.payments.stripeSecretKey}
                            onChange={(e) => handleInputChange('payments', 'stripeSecretKey', e.target.value)}
                            placeholder="Stripe secret key"
                          />
                        </div>
                      </div>
                      <button 
                        className="test-btn"
                        onClick={testStripeConnection}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Testing...' : 'Test Connection'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Bank Transfer */}
                <div className="payment-method">
                  <div className="method-header">
                    <div className="method-info">
                      <span className="method-icon">🏦</span>
                      <div>
                        <h4>Bank Transfer</h4>
                        <p>Manual payment processing</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.payments.bankTransferEnabled}
                        onChange={() => handleToggleChange('payments', 'bankTransferEnabled')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  {settings.payments.bankTransferEnabled && (
                    <div className="method-config">
                      <div className="form-group">
                        <label>Bank Account Details</label>
                        <textarea 
                          value={settings.payments.bankDetails}
                          onChange={(e) => handleInputChange('payments', 'bankDetails', e.target.value)}
                          placeholder="Enter bank account information for clients"
                          rows={4}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Money */}
                <div className="payment-method">
                  <div className="method-header">
                    <div className="method-info">
                      <span className="method-icon">📱</span>
                      <div>
                        <h4>Mobile Money (MoMo)</h4>
                        <p>Local mobile payments</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.payments.mobileMoneyEnabled}
                        onChange={() => handleToggleChange('payments', 'mobileMoneyEnabled')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  {settings.payments.mobileMoneyEnabled && (
                    <div className="method-config">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Mobile Number</label>
                          <input 
                            type="tel" 
                            value={settings.payments.mobileNumber}
                            onChange={(e) => handleInputChange('payments', 'mobileNumber', e.target.value)}
                            placeholder="MoMo number"
                          />
                        </div>
                        <div className="form-group">
                          <label>Provider</label>
                          <select 
                            value={settings.payments.mobileProvider}
                            onChange={(e) => handleInputChange('payments', 'mobileProvider', e.target.value)}
                          >
                            <option>MTN Mobile Money</option>
                            <option>Vodafone Cash</option>
                            <option>Airtel Money</option>
                            <option>Tigo Cash</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-section">
                <h3>Tax Settings</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tax Rate (%)</label>
                    <input 
                      type="number" 
                      value={settings.payments.taxRate}
                      onChange={(e) => handleInputChange('payments', 'taxRate', e.target.value)}
                      placeholder="Tax percentage"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tax Number</label>
                    <input 
                      type="text" 
                      value={settings.payments.taxNumber}
                      onChange={(e) => handleInputChange('payments', 'taxNumber', e.target.value)}
                      placeholder="Business tax ID"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Settings Tab */}
        <div className={`settings-tab-content ${activeTab === 'email' ? 'active' : ''}`} id="email-tab">
          <div className="content-card">
            <div className="card-header">
              <h2>Email & Notifications</h2>
            </div>
            
            <div className="settings-form">
              <div className="form-section">
                <h3>Email Service Configuration</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>SMTP Host</label>
                    <input 
                      type="text" 
                      value={settings.email.smtpHost}
                      onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
                      placeholder="SMTP server"
                    />
                  </div>
                  <div className="form-group">
                    <label>SMTP Port</label>
                    <input 
                      type="number" 
                      value={settings.email.smtpPort}
                      onChange={(e) => handleInputChange('email', 'smtpPort', e.target.value)}
                      placeholder="Port"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={settings.email.emailAddress}
                      onChange={(e) => handleInputChange('email', 'emailAddress', e.target.value)}
                      placeholder="From email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Password/App Key</label>
                    <input 
                      type="password" 
                      value={settings.email.smtpPassword}
                      onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
                      placeholder="SMTP password"
                    />
                  </div>
                </div>
                <button 
                  className="test-btn"
                  onClick={testEmailConnection}
                  disabled={isLoading}
                >
                  {isLoading ? 'Testing...' : 'Test Email Connection'}
                </button>
              </div>

              <div className="form-section">
                <h3>Notification Preferences</h3>
                <div className="notification-settings">
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>New Order Alerts</h4>
                      <p>Get notified when new orders are placed</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.email.newOrderAlerts}
                        onChange={() => handleToggleChange('email', 'newOrderAlerts')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Payment Notifications</h4>
                      <p>Alerts for successful payments</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.email.paymentNotifications}
                        onChange={() => handleToggleChange('email', 'paymentNotifications')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Client Messages</h4>
                      <p>Notify when clients send messages</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.email.clientMessages}
                        onChange={() => handleToggleChange('email', 'clientMessages')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Team Assignments</h4>
                      <p>Notifications for new team assignments</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.email.teamAssignments}
                        onChange={() => handleToggleChange('email', 'teamAssignments')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Email Templates</h3>
                <div className="email-templates">
                  <div className="template-item">
                    <h4>Welcome Email</h4>
                    <p>Sent to new clients after registration</p>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditTemplate('Welcome Email')}
                    >
                      Edit Template
                    </button>
                  </div>
                  <div className="template-item">
                    <h4>Order Confirmation</h4>
                    <p>Sent after successful order placement</p>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditTemplate('Order Confirmation')}
                    >
                      Edit Template
                    </button>
                  </div>
                  <div className="template-item">
                    <h4>Project Updates</h4>
                    <p>Regular progress updates to clients</p>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditTemplate('Project Updates')}
                    >
                      Edit Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder tabs */}
        {['security', 'templates', 'advanced'].includes(activeTab) && (
          <div className={`settings-tab-content active`} id={`${activeTab}-tab`}>
            <div className="content-card">
              <div className="card-header">
                <h2>
                  {activeTab === 'security' && 'Security Settings'}
                  {activeTab === 'templates' && 'Template Settings'}
                  {activeTab === 'advanced' && 'Advanced Settings'}
                </h2>
              </div>
              <div className="coming-soon">
                <p>This section is under development and will be available soon.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Actions */}
      <div className="settings-actions">
        <button 
          className="secondary-btn"
          onClick={handleResetDefaults}
          disabled={isLoading}
        >
          Reset to Defaults
        </button>
        <button 
          className="primary-btn"
          onClick={handleSaveChanges}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </main>
  );
};

export default SettingsDashboard;