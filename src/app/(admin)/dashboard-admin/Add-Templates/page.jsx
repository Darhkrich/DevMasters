/* eslint-disable @next/next/no-img-element */
'use client';
import './add-templates.css';
import { useState, useRef } from 'react';
import { createTemplate } from '@/lib/boemApi';

const AddNewTemplate = () => {
  const [formData, setFormData] = useState({
    name: '',
    short_name: '',
    category: [],
    type: 'ready',
    preview_url: '',
    description: '',
    price: '',
    price_note: '',
    badge: '',
    badge_class: '',
    tags: [],
    icons: [],
    is_active: true,
    is_draft: false,
    image: null,
    template_file: null,
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [newTag, setNewTag] = useState('');
  const [newIcon, setNewIcon] = useState('');

  const categoryOptions = [
    'business', 'ecommerce', 'portfolio', 'restaurant', 'medical',
    'blog', 'education', 'realestate', 'travel'
  ];

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryToggle = (cat) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter(c => c !== cat)
        : [...prev.category, cat]
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
      if (field === 'template_file') {
        // Simulate upload progress
        setIsUploading(true);
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setTimeout(() => setUploadProgress(0), 1000);
          }
        }, 100);
      }
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleAddIcon = () => {
    if (newIcon.trim() && !formData.icons.includes(newIcon.trim())) {
      setFormData(prev => ({
        ...prev,
        icons: [...prev.icons, newIcon.trim()]
      }));
      setNewIcon('');
    }
  };

  const handleRemoveIcon = (icon) => {
    setFormData(prev => ({
      ...prev,
      icons: prev.icons.filter(i => i !== icon)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Template name is required');
      return;
    }
    if (!formData.image) {
      alert('Thumbnail image is required');
      return;
    }
    if (!formData.template_file) {
      alert('Template file (ZIP) is required');
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('short_name', formData.short_name || formData.name.split(' ')[0]);
    payload.append('category', JSON.stringify(formData.category));
    payload.append('type', formData.type);
    payload.append('preview_url', formData.preview_url || '');
    payload.append('description', formData.description);
    payload.append('price', formData.price || '');
    payload.append('price_note', formData.price_note || '');
    payload.append('badge', formData.badge || '');
    payload.append('badge_class', formData.badge_class || '');
    payload.append('tags', JSON.stringify(formData.tags));
    payload.append('icons', JSON.stringify(formData.icons));
    payload.append('is_active', formData.is_active);
    payload.append('is_draft', formData.is_draft);
    payload.append('image', formData.image);
    payload.append('template_file', formData.template_file);

    try {
      setIsUploading(true);
      await createTemplate(payload);
      alert('Template created successfully!');
      window.location.href = '/dashboard-admin';
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error creating template');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="adt-container">
      <main className="adt-main-content">
        <header className="adt-header">
          <div className="adt-header-left">
            <h1>Add New Template</h1>
            <p>Create and publish a new website template</p>
          </div>
          <div className="adt-header-right">
            <button className="adt-btn-secondary" onClick={() => window.history.back()}>← Back</button>
            <button className="adt-btn-primary" onClick={handleSubmit} disabled={isUploading}>
              {isUploading ? 'Publishing...' : 'Publish Template'}
            </button>
          </div>
        </header>

        {isUploading && (
          <div className="adt-upload-progress">
            <div className="adt-progress-bar">
              <div className="adt-progress-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
            <div>Uploading template... {uploadProgress}%</div>
          </div>
        )}

        <div className="adt-form-container">
          <div className="adt-tabs">
            <button className={`adt-tab ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>📋 Basic Info</button>
            <button className={`adt-tab ${activeTab === 'media' ? 'active' : ''}`} onClick={() => setActiveTab('media')}>🖼️ Media & Files</button>
            <button className={`adt-tab ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>📄 Details & Features</button>
            <button className={`adt-tab ${activeTab === 'pricing' ? 'active' : ''}`} onClick={() => setActiveTab('pricing')}>💰 Pricing & Settings</button>
          </div>

          <form className="adt-form">
            {/* Basic Info */}
            {activeTab === 'basic' && (
              <div className="adt-tab-content">
                <h2>Basic Information</h2>
                <div className="adt-form-grid">
                  <div className="adt-form-group">
                    <label>Template Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="adt-form-group">
                    <label>Short Name</label>
                    <input type="text" name="short_name" value={formData.short_name} onChange={handleInputChange} />
                  </div>
                  <div className="adt-form-group full-width">
                    <label>Categories (choose multiple)</label>
                    <div className="adt-checkbox-group">
                      {categoryOptions.map(cat => (
                        <label key={cat}>
                          <input type="checkbox" checked={formData.category.includes(cat)} onChange={() => handleCategoryToggle(cat)} />
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="adt-form-group">
                    <label>Type</label>
                    <select name="type" value={formData.type} onChange={handleInputChange}>
                      <option value="ready">Ready-Made</option>
                      <option value="custom">Customizable</option>
                    </select>
                  </div>
                  <div className="adt-form-group full-width">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="5" required />
                  </div>
                  <div className="adt-form-group">
                    <label>Preview URL</label>
                    <input type="url" name="preview_url" value={formData.preview_url} onChange={handleInputChange} placeholder="https://demo.example.com" />
                  </div>
                </div>
              </div>
            )}

            {/* Media & Files */}
            {activeTab === 'media' && (
              <div className="adt-tab-content">
                <h2>Media & Files</h2>
                <div className="adt-form-grid">
                  <div className="adt-upload-card">
                    <h3>Thumbnail Image *</h3>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
                    {formData.image && (
                      <div className="adt-thumbnail-preview">
                        <img src={URL.createObjectURL(formData.image)} alt="Thumbnail preview" />
                      </div>
                    )}
                  </div>
                  <div className="adt-upload-card">
                    <h3>Template File (ZIP) *</h3>
                    <input type="file" accept=".zip,application/zip" onChange={(e) => handleFileChange(e, 'template_file')} />
                    {formData.template_file && <div>File: {formData.template_file.name}</div>}
                  </div>
                </div>
              </div>
            )}

            {/* Tags & Icons */}
            {activeTab === 'details' && (
              <div className="adt-tab-content">
                <h2>Tags & Icons</h2>
                <div className="adt-form-grid">
                  <div className="adt-form-group full-width">
                    <label>Tags</label>
                    <div className="adt-tags-input">
                      <div className="adt-tags-container">
                        {formData.tags.map(tag => (
                          <span key={tag} className="adt-tag">
                            {tag}
                            <button type="button" onClick={() => handleRemoveTag(tag)}>✕</button>
                          </span>
                        ))}
                      </div>
                      <div className="adt-tag-input-group">
                        <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add tag" />
                        <button type="button" onClick={handleAddTag}>Add</button>
                      </div>
                    </div>
                  </div>
                  <div className="adt-form-group full-width">
                    <label>Icons (font awesome classes)</label>
                    <div className="adt-tags-input">
                      <div className="adt-tags-container">
                        {formData.icons.map(icon => (
                          <span key={icon} className="adt-tag">
                            {icon}
                            <button type="button" onClick={() => handleRemoveIcon(icon)}>✕</button>
                          </span>
                        ))}
                      </div>
                      <div className="adt-tag-input-group">
                        <input type="text" value={newIcon} onChange={(e) => setNewIcon(e.target.value)} placeholder="e.g., fas fa-rocket" />
                        <button type="button" onClick={handleAddIcon}>Add</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing & Settings */}
            {activeTab === 'pricing' && (
              <div className="adt-tab-content">
                <h2>Pricing & Settings</h2>
                <div className="adt-form-grid">
                  <div className="adt-form-group">
                    <label>Price (USD)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} step="0.01" />
                  </div>
                  <div className="adt-form-group">
                    <label>Price Note</label>
                    <input type="text" name="price_note" value={formData.price_note} onChange={handleInputChange} placeholder="e.g., One-time payment" />
                  </div>
                  <div className="adt-form-group">
                    <label>Badge (e.g., &quot;New&quot;, &quot;Best Seller&quot;)</label>
                    <input type="text" name="badge" value={formData.badge} onChange={handleInputChange} />
                  </div>
                  <div className="adt-form-group">
                    <label>Badge Class</label>
                    <input type="text" name="badge_class" value={formData.badge_class} onChange={handleInputChange} />
                  </div>
                  <div className="adt-checkbox-group">
                    <label><input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} /> Active (visible to public)</label>
                    <label><input type="checkbox" name="is_draft" checked={formData.is_draft} onChange={handleInputChange} /> Draft (hide from public)</label>
                  </div>
                </div>
              </div>
            )}

            <div className="adt-form-navigation">
              <button type="button" className="adt-nav-btn" onClick={() => {
                const tabs = ['basic', 'media', 'details', 'pricing'];
                const idx = tabs.indexOf(activeTab);
                if (idx > 0) setActiveTab(tabs[idx - 1]);
              }}>← Previous</button>
              <button type="button" className="adt-nav-btn adt-primary" onClick={() => {
                const tabs = ['basic', 'media', 'details', 'pricing'];
                const idx = tabs.indexOf(activeTab);
                if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1]);
              }}>Next →</button>
            </div>
          </form>
        </div>

        {/* Sidebar Preview */}
        <div className="adt-preview-sidebar">
          <h3>📱 Template Preview</h3>
          <div className="adt-preview-card">
            <div className="adt-preview-image">
              {formData.image ? <img src={URL.createObjectURL(formData.image)} alt="Preview" /> : <div className="adt-placeholder-image">🖼️</div>}
            </div>
            <div className="adt-preview-info">
              <h4>{formData.name || 'Template Name'}</h4>
              <p>{formData.description || 'Description'}</p>
              <div className="adt-preview-meta">
                <span className="adt-category-badge">{formData.category.length ? formData.category.join(', ') : 'Category'}</span>
                <span className="adt-preview-price">${formData.price || '0'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddNewTemplate;
