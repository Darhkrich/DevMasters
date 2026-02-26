'use client';
import './styles.css';
import { useState, useRef } from 'react';

const AddNewTemplate = () => {
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'business',
    price: '',
    features: [''],
    tags: [],
    demoUrl: '',
    documentation: '',
    supportPeriod: '6',
    templateFile: null,
    previewImages: [],
    thumbnail: null,
  });

  // Upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // UI states
  const [activeTab, setActiveTab] = useState('basic');
  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');

  // Refs
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Categories for dropdown
  const categories = [
    { value: 'business', label: 'Business', color: '#0a84ff' },
    { value: 'ecommerce', label: 'E-commerce', color: '#ff453a' },
    { value: 'portfolio', label: 'Portfolio', color: '#bf5af2' },
    { value: 'restaurant', label: 'Restaurant', color: '#ff9f0a' },
    { value: 'medical', label: 'Medical', color: '#d81b60' },
    { value: 'blog', label: 'Blog', color: '#30d158' },
    { value: 'education', label: 'Education', color: '#64d2ff' },
    { value: 'realestate', label: 'Real Estate', color: '#5ac8fa' },
    { value: 'travel', label: 'Travel', color: '#007aff' },
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle template file upload
  const handleTemplateUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/zip', 'application/x-zip-compressed'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a ZIP file');
        return;
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }

      setFormData(prev => ({ ...prev, templateFile: file }));
      
      // Simulate upload progress
      setIsUploading(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setTimeout(() => {
            setUploadProgress(0);
          }, 1000);
        }
      }, 100);
    }
  };

  // Handle image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    if (validImages.length !== files.length) {
      alert('Some files were skipped. Only images under 5MB are allowed.');
    }

    // Create preview URLs
    const newImages = validImages.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setFormData(prev => ({
      ...prev,
      previewImages: [...prev.previewImages, ...newImages]
    }));
  };

  // Handle thumbnail selection
  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        thumbnail: {
          file,
          preview: URL.createObjectURL(file)
        }
      }));
    }
  };

  // Add new tag
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Add new feature
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  // Remove feature
  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      alert('Please enter template name');
      return;
    }

    if (!formData.templateFile) {
      alert('Please upload template files');
      return;
    }

    if (formData.previewImages.length === 0) {
      alert('Please add at least one preview image');
      return;
    }

    // Simulate API call
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);
          
          // Show success message
          alert('Template created successfully!');
          
          // Reset form
          setFormData({
            name: '',
            description: '',
            category: 'business',
            price: '',
            features: [''],
            tags: [],
            demoUrl: '',
            documentation: '',
            supportPeriod: '6',
            templateFile: null,
            previewImages: [],
            thumbnail: null,
          });
          
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Calculate estimated earnings
  const calculateEarnings = () => {
    if (!formData.price) return '0';
    const price = parseFloat(formData.price);
    const monthly = (price * 10 * 0.7).toFixed(0); // Assuming 10 sales/month, 70% profit
    const yearly = (monthly * 12).toFixed(0);
    return { monthly, yearly };
  };

  const earnings = calculateEarnings();

  return (
    <div className="admin-container">
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Add New Template</h1>
            <p className="welcome-text">Create and publish a new website template</p>
          </div>
          <div className="header-right">
            <button 
              className="secondary-btn" 
              onClick={() => window.history.back()}
            >
              ← Back to Templates
            </button>
            <button 
              className="primary-btn"
              onClick={handleSubmit}
              disabled={isUploading}
            >
              {isUploading ? 'Publishing...' : 'Publish Template'}
            </button>
          </div>
        </header>

        {/* Progress Bar */}
        {isUploading && (
          <div className="upload-progress-container">
            <div className="upload-progress-bar">
              <div 
                className="upload-progress-fill"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="upload-progress-text">
              Uploading template... {uploadProgress}%
            </div>
          </div>
        )}

        {/* Main Form Container */}
        <div className="form-container">
          {/* Tabs Navigation */}
          <div className="form-tabs">
            <button 
              className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              📋 Basic Info
            </button>
            <button 
              className={`tab-btn ${activeTab === 'media' ? 'active' : ''}`}
              onClick={() => setActiveTab('media')}
            >
              🖼️ Media & Files
            </button>
            <button 
              className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              📄 Details & Features
            </button>
            <button 
              className={`tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
              onClick={() => setActiveTab('pricing')}
            >
              💰 Pricing & Settings
            </button>
          </div>

          {/* Form Content */}
          <form className="template-form">
            {/* Tab 1: Basic Information */}
            {activeTab === 'basic' && (
              <div className="tab-content">
                <h2 className="tab-title">Basic Information</h2>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Template Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Business Pro, Ecommerce Basic"
                      required
                    />
                    <small>Choose a descriptive name for your template</small>
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <small>Select the primary category for your template</small>
                  </div>

                  <div className="form-group full-width">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your template in detail. Include features, target audience, and use cases."
                      rows="5"
                      required
                    />
                    <small>Write a compelling description to attract customers</small>
                  </div>

                  <div className="form-group">
                    <label>Demo URL</label>
                    <input
                      type="url"
                      name="demoUrl"
                      value={formData.demoUrl}
                      onChange={handleInputChange}
                      placeholder="https://demo.yourtemplate.com"
                    />
                    <small>Live demo URL for preview</small>
                  </div>

                  <div className="form-group">
                    <label>Documentation URL</label>
                    <input
                      type="url"
                      name="documentation"
                      value={formData.documentation}
                      onChange={handleInputChange}
                      placeholder="https://docs.yourtemplate.com"
                    />
                    <small>Link to user documentation</small>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Media & Files */}
            {activeTab === 'media' && (
              <div className="tab-content">
                <h2 className="tab-title">Media & Files</h2>
                
                <div className="form-grid">
                  {/* Template Files Upload */}
                  <div className="upload-card">
                    <div className="upload-icon">📦</div>
                    <h3>Template Files</h3>
                    <p>Upload your template files (ZIP format, max 50MB)</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleTemplateUpload}
                      accept=".zip,application/zip,application/x-zip-compressed"
                      className="file-input"
                    />
                    <button
                      type="button"
                      className="upload-btn"
                      onClick={() => fileInputRef.current.click()}
                    >
                      {formData.templateFile ? 'Change Template File' : 'Upload Template Files'}
                    </button>
                    {formData.templateFile && (
                      <div className="file-info">
                        <span>📄 {formData.templateFile.name}</span>
                        <span>{(formData.templateFile.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Upload */}
                  <div className="upload-card">
                    <div className="upload-icon">🖼️</div>
                    <h3>Thumbnail Image</h3>
                    <p>Main thumbnail (300x200 recommended)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="file-input"
                    />
                    <button
                      type="button"
                      className="upload-btn"
                      onClick={() => document.querySelector('input[type="file"]').click()}
                    >
                      {formData.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
                    </button>
                    {formData.thumbnail && (
                      <div className="thumbnail-preview">
                        <img src={formData.thumbnail.preview} alt="Thumbnail preview" />
                      </div>
                    )}
                  </div>

                  {/* Preview Images */}
                  <div className="upload-card full-width">
                    <div className="upload-icon">📸</div>
                    <h3>Preview Images</h3>
                    <p>Add multiple screenshots (max 5MB each, recommended: 1200x800)</p>
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      multiple
                      className="file-input"
                    />
                    <button
                      type="button"
                      className="upload-btn"
                      onClick={() => imageInputRef.current.click()}
                    >
                      Add Preview Images
                    </button>
                    
                    {formData.previewImages.length > 0 && (
                      <div className="preview-gallery">
                        {formData.previewImages.map((image, index) => (
                          <div key={index} className="preview-item">
                            <img src={image.preview} alt={`Preview ${index + 1}`} />
                            <button
                              type="button"
                              className="remove-preview"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  previewImages: prev.previewImages.filter((_, i) => i !== index)
                                }));
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Details & Features */}
            {activeTab === 'details' && (
              <div className="tab-content">
                <h2 className="tab-title">Details & Features</h2>
                
                <div className="form-grid">
                  {/* Features */}
                  <div className="form-group full-width">
                    <label>Features</label>
                    <div className="features-list">
                      {formData.features.map((feature, index) => (
                        <div key={index} className="feature-item">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => {
                              const newFeatures = [...formData.features];
                              newFeatures[index] = e.target.value;
                              setFormData(prev => ({ ...prev, features: newFeatures }));
                            }}
                            placeholder="Add a feature"
                          />
                          <button
                            type="button"
                            className="remove-btn"
                            onClick={() => handleRemoveFeature(index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <div className="add-feature">
                        <input
                          type="text"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="Enter new feature"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                        />
                        <button type="button" onClick={handleAddFeature}>+ Add</button>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="form-group full-width">
                    <label>Tags</label>
                    <div className="tags-input">
                      <div className="tags-container">
                        {formData.tags.map((tag, index) => (
                          <span key={index} className="tag">
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="tag-input-group">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add tags (press Enter)"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        />
                        <button type="button" onClick={handleAddTag}>Add Tag</button>
                      </div>
                    </div>
                  </div>

                  {/* Support Period */}
                  <div className="form-group">
                    <label>Support Period (Months)</label>
                    <select
                      name="supportPeriod"
                      value={formData.supportPeriod}
                      onChange={handleInputChange}
                    >
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="12">12 Months</option>
                      <option value="24">24 Months</option>
                    </select>
                  </div>

                  {/* Browser Compatibility */}
                  <div className="form-group">
                    <label>Browser Compatibility</label>
                    <div className="checkbox-group">
                      <label>
                        <input type="checkbox" defaultChecked /> Chrome
                      </label>
                      <label>
                        <input type="checkbox" defaultChecked /> Firefox
                      </label>
                      <label>
                        <input type="checkbox" defaultChecked /> Safari
                      </label>
                      <label>
                        <input type="checkbox" defaultChecked /> Edge
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Pricing & Settings */}
            {activeTab === 'pricing' && (
              <div className="tab-content">
                <h2 className="tab-title">Pricing & Settings</h2>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Price (USD) *</label>
                    <div className="price-input">
                      <span className="currency">$</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="299"
                        min="0"
                        step="1"
                        required
                      />
                    </div>
                    <small>Set the price for your template</small>
                  </div>

                  <div className="form-group">
                    <label>Sale Price (Optional)</label>
                    <div className="price-input">
                      <span className="currency">$</span>
                      <input
                        type="number"
                        placeholder="199"
                        min="0"
                        step="1"
                      />
                    </div>
                    <small>Set a discounted price</small>
                  </div>

                  {/* Estimated Earnings */}
                  <div className="earnings-card">
                    <h3>💰 Estimated Earnings</h3>
                    <div className="earnings-grid">
                      <div className="earning-item">
                        <span className="earning-label">Monthly</span>
                        <span className="earning-value">${earnings.monthly}</span>
                      </div>
                      <div className="earning-item">
                        <span className="earning-label">Yearly</span>
                        <span className="earning-value">${earnings.yearly}</span>
                      </div>
                    </div>
                    <small>Based on 10 sales/month with 70% profit margin</small>
                  </div>

                  {/* Template Settings */}
                  <div className="settings-card full-width">
                    <h3>⚙️ Template Settings</h3>
                    <div className="settings-grid">
                      <label className="setting-item">
                        <input type="checkbox" defaultChecked />
                        <span>Featured on homepage</span>
                      </label>
                      <label className="setting-item">
                        <input type="checkbox" defaultChecked />
                        <span>Allow customer reviews</span>
                      </label>
                      <label className="setting-item">
                        <input type="checkbox" />
                        <span>Require approval for sales</span>
                      </label>
                      <label className="setting-item">
                        <input type="checkbox" defaultChecked />
                        <span>Send email notifications</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Navigation */}
            <div className="form-navigation">
              <button
                type="button"
                className="nav-btn"
                onClick={() => {
                  const tabs = ['basic', 'media', 'details', 'pricing'];
                  const currentIndex = tabs.indexOf(activeTab);
                  if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
                }}
              >
                ← Previous
              </button>
              
              <div className="step-indicator">
                <span className={`step ${activeTab === 'basic' ? 'active' : ''}`}>1</span>
                <span className={`step ${activeTab === 'media' ? 'active' : ''}`}>2</span>
                <span className={`step ${activeTab === 'details' ? 'active' : ''}`}>3</span>
                <span className={`step ${activeTab === 'pricing' ? 'active' : ''}`}>4</span>
              </div>
              
              <button
                type="button"
                className="nav-btn primary"
                onClick={() => {
                  const tabs = ['basic', 'media', 'details', 'pricing'];
                  const currentIndex = tabs.indexOf(activeTab);
                  if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
                }}
              >
                Next →
              </button>
            </div>
          </form>
        </div>

        {/* Preview Sidebar */}
        <div className="preview-sidebar">
          <h3>📱 Template Preview</h3>
          
          <div className="template-preview-card">
            <div className="preview-image">
              {formData.thumbnail ? (
                <img src={formData.thumbnail.preview} alt="Template preview" />
              ) : (
                <div className="placeholder-image">🖼️</div>
              )}
            </div>
            <div className="preview-info">
              <h4>{formData.name || 'Template Name'}</h4>
              <p>{formData.description || 'Template description will appear here'}</p>
              <div className="preview-meta">
                <span className="category-badge">
                  {categories.find(c => c.value === formData.category)?.label || 'Category'}
                </span>
                <span className="preview-price">
                  ${formData.price || '299'}
                </span>
              </div>
              <div className="preview-stats">
                <span>📊 0 orders</span>
                <span>⭐ 0.0</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <h4>📊 Quick Stats</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Images</span>
                <span className="stat-value">{formData.previewImages.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Features</span>
                <span className="stat-value">{formData.features.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Tags</span>
                <span className="stat-value">{formData.tags.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Size</span>
                <span className="stat-value">
                  {formData.templateFile ? 
                    `${(formData.templateFile.size / 1024 / 1024).toFixed(1)}MB` : 
                    '0MB'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="requirements-card">
            <h4>✅ Requirements</h4>
            <ul className="requirements-list">
              <li className={formData.name ? 'completed' : ''}>
                {formData.name ? '✓' : '○'} Template name
              </li>
              <li className={formData.description ? 'completed' : ''}>
                {formData.description ? '✓' : '○'} Description
              </li>
              <li className={formData.templateFile ? 'completed' : ''}>
                {formData.templateFile ? '✓' : '○'} Template files
              </li>
              <li className={formData.previewImages.length > 0 ? 'completed' : ''}>
                {formData.previewImages.length > 0 ? '✓' : '○'} Preview images
              </li>
              <li className={formData.price ? 'completed' : ''}>
                {formData.price ? '✓' : '○'} Price set
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddNewTemplate;