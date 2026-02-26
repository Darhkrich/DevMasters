'use client';
import { useState, useEffect } from 'react';
import './setting.css';








export default function SettingsPage() {
  // State for sidebar navigation
  const [activeSection, setActiveSection] = useState('profile');
  // State for form fields
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Web designer and developer with 5+ years of experience creating beautiful, functional websites.',
    username: 'johndoe',
    language: 'English',
    timezone: '(GMT-05:00) Eastern Time',
    dateFormat: 'MM/DD/YYYY',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  // State for toggle switches
  const [toggles, setToggles] = useState({
    publicProfile: true,
    emailNotifications: true,
    twoFactorAuth: false,
    loginNotifications: true,
  });
  // State for search input
  const [searchQuery, setSearchQuery] = useState('');
  // State for sidebar menu toggle (mobile)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle sidebar navigation click
  const handleNavClick = (section, e) => {
    e.preventDefault();
    setActiveSection(section);
    // For mobile, close sidebar after selection
    setSidebarOpen(false);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle toggle switches
  const handleToggleChange = (toggleName) => {
    setToggles(prev => ({
      ...prev,
      [toggleName]: !prev[toggleName]
    }));
  };

  // Handle form submissions
  const handleSubmit = (e, section) => {
    e.preventDefault();
    // In a real app, you would send data to your API here
    console.log(`Saving ${section} settings:`, formData);
    alert(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved!`);
  };

  // Handle avatar upload
  const handleAvatarUpload = () => {
    // In a real app, you would implement file upload logic here
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
          alert('File size must be less than 2MB');
          return;
        }
        // In a real app, you would upload the file and update the avatar URL
        console.log('Avatar file selected:', file.name);
        alert('Avatar uploaded successfully! (This is a demo)');
      }
    };
    input.click();
  };

  // Handle plan upgrade
  const handlePlanUpgrade = (planName) => {
    alert(`Upgrading to ${planName} plan!`);
    // In a real app, you would redirect to checkout or show a modal
  };

  // Handle menu toggle for mobile
  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation items configuration
  const navItems = [
    { id: 'profile', icon: 'fas fa-user', label: 'Profile' },
    { id: 'account', icon: 'fas fa-cog', label: 'Account' },
    { id: 'security', icon: 'fas fa-shield-alt', label: 'Security' },
    { id: 'notifications', icon: 'fas fa-bell', label: 'Notifications' },
    { id: 'billing', icon: 'fas fa-credit-card', label: 'Billing' },
    { id: 'preferences', icon: 'fas fa-palette', label: 'Preferences' },
  ];

  return (
    <div className="dashboard-container">
      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <button className="menu-toggle" id="menuToggle" onClick={handleMenuToggle}>
              <i className="fas fa-bars"></i>
            </button>
            <h1>Settings</h1>
          </div>
          <div className="header-right">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="header-actions">
              <button className="icon-btn">
                <i className="fas fa-bell"></i>
                <span className="notification-dot"></span>
              </button>
              <button className="icon-btn">
                <i className="fas fa-envelope"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Settings Content */}
        <div className="content-area">
          <div className="settings-container">
            {/* Settings Sidebar */}
            <div className={`settings-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
              <nav className="settings-nav">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    className={`settings-nav-item ${activeSection === item.id ? 'active' : ''}`}
                    onClick={(e) => handleNavClick(item.id, e)}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Settings Content */}
            <div className="settings-content">
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <section className="settings-section" id="profile">
                  <h2>Profile Settings</h2>
                  
                  <div className="form-group">
                    <div className="avatar-upload">
                      <div className="avatar-preview">
                        <img src={`https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=6366f1&color=fff`} alt="Profile Avatar" />
                      </div>
                      <div>
                        <button className="btn btn-outline" onClick={handleAvatarUpload}>
                          <i className="fas fa-upload"></i>
                          Change Avatar
                        </button>
                        <p style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
                          JPG, GIF or PNG. Max size of 2MB.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={(e) => handleSubmit(e, 'profile')}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input 
                          type="text" 
                          id="firstName" 
                          className="form-control" 
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input 
                          type="text" 
                          id="lastName" 
                          className="form-control" 
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="form-control" 
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        className="form-control" 
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="bio">Bio</label>
                      <textarea 
                        id="bio" 
                        className="form-control" 
                        rows="4" 
                        placeholder="Tell us about yourself..."
                        value={formData.bio}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-save"></i>
                      Save Changes
                    </button>
                  </form>
                </section>
              )}
              
              {/* Account Section */}
              {activeSection === 'account' && (
                <section className="settings-section" id="account">
                  <h2>Account Settings</h2>
                  
                  <form onSubmit={(e) => handleSubmit(e, 'account')}>
                    <div className="form-group">
                      <label htmlFor="username">Username</label>
                      <input 
                        type="text" 
                        id="username" 
                        className="form-control" 
                        value={formData.username}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="language">Language</label>
                      <select 
                        id="language" 
                        className="form-control"
                        value={formData.language}
                        onChange={handleInputChange}
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="timezone">Timezone</label>
                      <select 
                        id="timezone" 
                        className="form-control"
                        value={formData.timezone}
                        onChange={handleInputChange}
                      >
                        <option>(GMT-05:00) Eastern Time</option>
                        <option>(GMT-08:00) Pacific Time</option>
                        <option>(GMT+00:00) Greenwich Mean Time</option>
                        <option>(GMT+01:00) Central European Time</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="dateFormat">Date Format</label>
                      <select 
                        id="dateFormat" 
                        className="form-control"
                        value={formData.dateFormat}
                        onChange={handleInputChange}
                      >
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                    
                    <div className="toggle-label">
                      <div className="toggle-text">
                        <h4>Public Profile</h4>
                        <p>Anyone can view your profile</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={toggles.publicProfile}
                          onChange={() => handleToggleChange('publicProfile')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    
                    <div className="toggle-label">
                      <div className="toggle-text">
                        <h4>Email Notifications</h4>
                        <p>Receive email updates about your account</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={toggles.emailNotifications}
                          onChange={() => handleToggleChange('emailNotifications')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-save"></i>
                      Update Account
                    </button>
                  </form>
                </section>
              )}
              
              {/* Security Section */}
              {activeSection === 'security' && (
                <section className="settings-section" id="security">
                  <h2>Security Settings</h2>
                  
                  <form onSubmit={(e) => handleSubmit(e, 'security')}>
                    <div className="form-group">
                      <label htmlFor="currentPassword">Current Password</label>
                      <input 
                        type="password" 
                        id="currentPassword" 
                        className="form-control" 
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input 
                          type="password" 
                          id="newPassword" 
                          className="form-control" 
                          value={formData.newPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input 
                          type="password" 
                          id="confirmPassword" 
                          className="form-control" 
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="toggle-label">
                      <div className="toggle-text">
                        <h4>Two-Factor Authentication</h4>
                        <p>Add an extra layer of security to your account</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={toggles.twoFactorAuth}
                          onChange={() => handleToggleChange('twoFactorAuth')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    
                    <div className="toggle-label">
                      <div className="toggle-text">
                        <h4>Login Notifications</h4>
                        <p>Get notified when someone logs into your account</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={toggles.loginNotifications}
                          onChange={() => handleToggleChange('loginNotifications')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-save"></i>
                      Update Security Settings
                    </button>
                  </form>
                </section>
              )}
              
              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <section className="settings-section" id="notifications">
                  <h2>Notifications Settings</h2>
                  <p>Notification preferences would go here.</p>
                  {/* Add notification-specific settings as needed */}
                </section>
              )}
              
              {/* Billing Section */}
              {activeSection === 'billing' && (
                <section className="settings-section" id="billing">
                  <h2>Billing & Plans</h2>
                  
                  <div className="plan-card active">
                    <div className="plan-header">
                      <div className="plan-name">E-commerce Package</div>
                      <div className="plan-price">$499</div>
                    </div>
                    <p>Perfect for online stores and businesses</p>
                    <ul className="plan-features">
                      <li><i className="fas fa-check"></i> <span>Unlimited products</span></li>
                      <li><i className="fas fa-check"></i> <span>Payment gateway integration</span></li>
                      <li><i className="fas fa-check"></i> <span>Inventory management</span></li>
                      <li><i className="fas fa-check"></i> <span>Priority support</span></li>
                    </ul>
                    <button className="btn btn-primary">Current Plan</button>
                  </div>
                  
                  <div className="plan-card">
                    <div className="plan-header">
                      <div className="plan-name">Business Package</div>
                      <div className="plan-price">$299</div>
                    </div>
                    <p>Ideal for small to medium businesses</p>
                    <ul className="plan-features">
                      <li><i className="fas fa-check"></i> <span>Up to 50 pages</span></li>
                      <li><i className="fas fa-check"></i> <span>Contact forms</span></li>
                      <li><i className="fas fa-check"></i> <span>Basic SEO optimization</span></li>
                      <li><i className="fas fa-check"></i> <span>Standard support</span></li>
                    </ul>
                    <button 
                      className="btn btn-outline"
                      onClick={() => handlePlanUpgrade('Business Package')}
                    >
                      Upgrade
                    </button>
                  </div>
                  
                  <div className="plan-card">
                    <div className="plan-header">
                      <div className="plan-name">Starter Package</div>
                      <div className="plan-price">$149</div>
                    </div>
                    <p>Great for personal websites and portfolios</p>
                    <ul className="plan-features">
                      <li><i className="fas fa-check"></i> <span>Up to 10 pages</span></li>
                      <li><i className="fas fa-check"></i> <span>Basic contact form</span></li>
                      <li><i className="fas fa-check"></i> <span>Mobile responsive</span></li>
                      <li><i className="fas fa-check"></i> <span>Email support</span></li>
                    </ul>
                    <button 
                      className="btn btn-outline"
                      onClick={() => handlePlanUpgrade('Starter Package')}
                    >
                      Upgrade
                    </button>
                  </div>
                </section>
              )}
              
              {/* Preferences Section */}
              {activeSection === 'preferences' && (
                <section className="settings-section" id="preferences">
                  <h2>Preferences Settings</h2>
                  <p>Theme, color scheme, and other preference settings would go here.</p>
                  {/* Add preference-specific settings as needed */}
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}