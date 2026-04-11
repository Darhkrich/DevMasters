/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import './TemplateForm.css';

export default function TemplateForm({ initialData = null, onSubmit, isEditing = false }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    short_name: initialData?.short_name || '',
    category: initialData?.category || [],
    type: initialData?.type || 'ready',
    preview_url: initialData?.preview_url || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    price_note: initialData?.price_note || '',
    badge: initialData?.badge || '',
    badge_class: initialData?.badge_class || '',
    tags: initialData?.tags || [],
    icons: initialData?.icons || [],
    is_active: initialData?.is_active ?? true,
    is_draft: initialData?.is_draft ?? false,
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
    if (!isEditing && !formData.image) {
      alert('Thumbnail image is required for new templates');
      return;
    }
    if (!isEditing && !formData.template_file) {
      alert('Template file (ZIP) is required for new templates');
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
    if (formData.image) payload.append('image', formData.image);
    if (formData.template_file) payload.append('template_file', formData.template_file);

    await onSubmit(payload);
  };

  return (
    <div className="tf-container">
      <main className="tf-main-content">
        <header className="tf-header">
          <div className="tf-header-left">
            <h1>{isEditing ? 'Edit Template' : 'Add New Template'}</h1>
            <p>{isEditing ? 'Update template details' : 'Create and publish a new website template'}</p>
          </div>
          <div className="tf-header-right">
            <button className="tf-btn-secondary" onClick={() => window.history.back()}>← Back</button>
            <button className="tf-btn-primary" onClick={handleSubmit} disabled={isUploading}>
              {isUploading ? 'Saving...' : (isEditing ? 'Update Template' : 'Publish Template')}
            </button>
          </div>
        </header>

        {isUploading && (
          <div className="tf-upload-progress">
            <div className="tf-progress-bar">
              <div className="tf-progress-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
            <div>Uploading template... {uploadProgress}%</div>
          </div>
        )}

        <div className="tf-form-container">
          <div className="tf-tabs">
            <button className={`tf-tab ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>📋 Basic Info</button>
            <button className={`tf-tab ${activeTab === 'media' ? 'active' : ''}`} onClick={() => setActiveTab('media')}>🖼️ Media & Files</button>
            <button className={`tf-tab ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>📄 Details & Features</button>
            <button className={`tf-tab ${activeTab === 'pricing' ? 'active' : ''}`} onClick={() => setActiveTab('pricing')}>💰 Pricing & Settings</button>
          </div>

          <form className="tf-form">
            {/* Basic Info */}
            {activeTab === 'basic' && (
              <div className="tf-tab-content">
                <h2>Basic Information</h2>
                <div className="tf-form-grid">
                  <div className="tf-form-group">
                    <label>Template Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="tf-form-group">
                    <label>Short Name</label>
                    <input type="text" name="short_name" value={formData.short_name} onChange={handleInputChange} />
                  </div>
                  <div className="tf-form-group">
                    <label>Categories (choose multiple)</label>
                    <div className="tf-checkbox-group">
                      {categoryOptions.map(cat => (
                        <label key={cat}>
                          <input type="checkbox" checked={formData.category.includes(cat)} onChange={() => handleCategoryToggle(cat)} />
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="tf-form-group">
                    <label>Type</label>
                    <select name="type" value={formData.type} onChange={handleInputChange}>
                      <option value="ready">Ready-Made</option>
                      <option value="custom">Customizable</option>
                    </select>
                  </div>
                  <div className="tf-form-group full-width">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="5" required />
                  </div>
                  <div className="tf-form-group">
                    <label>Preview URL</label>
                    <input type="url" name="preview_url" value={formData.preview_url} onChange={handleInputChange} placeholder="https://demo.example.com" />
                  </div>
                </div>
              </div>
            )}

            {/* Media & Files */}
            {activeTab === 'media' && (
              <div className="tf-tab-content">
                <h2>Media & Files</h2>
                <div className="tf-form-grid">
                  <div className="tf-upload-card">
                    <h3>Thumbnail Image {!isEditing && '*'}</h3>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
                    {(formData.image || initialData?.image) && (
                      <div className="tf-thumbnail-preview">
                        <img src={formData.image ? URL.createObjectURL(formData.image) : initialData.image} alt="Thumbnail preview" />
                      </div>
                    )}
                  </div>
                  <div className="tf-upload-card">
                    <h3>Template File (ZIP) {!isEditing && '*'}</h3>
                    <input type="file" accept=".zip,application/zip" onChange={(e) => handleFileChange(e, 'template_file')} />
                    {formData.template_file && <div>File: {formData.template_file.name}</div>}
                    {!formData.template_file && initialData?.template_file && <div>Existing file: {initialData.template_file.split('/').pop()}</div>}
                  </div>
                </div>
              </div>
            )}

            {/* Tags & Icons */}
            {activeTab === 'details' && (
              <div className="tf-tab-content">
                <h2>Tags & Icons</h2>
                <div className="tf-form-grid">
                  <div className="tf-form-group full-width">
                    <label>Tags</label>
                    <div className="tf-tags-input">
                      <div className="tf-tags-container">
                        {formData.tags.map(tag => (
                          <span key={tag} className="tf-tag">
                            {tag}
                            <button type="button" onClick={() => handleRemoveTag(tag)}>✕</button>
                          </span>
                        ))}
                      </div>
                      <div className="tf-tag-input-group">
                        <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add tag" />
                        <button type="button" onClick={handleAddTag}>Add</button>
                      </div>
                    </div>
                  </div>
                  <div className="tf-form-group full-width">
                    <label>Icons (font awesome classes)</label>
                    <div className="tf-tags-input">
                      <div className="tf-tags-container">
                        {formData.icons.map(icon => (
                          <span key={icon} className="tf-tag">
                            {icon}
                            <button type="button" onClick={() => handleRemoveIcon(icon)}>✕</button>
                          </span>
                        ))}
                      </div>
                      <div className="tf-tag-input-group">
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
              <div className="tf-tab-content">
                <h2>Pricing & Settings</h2>
                <div className="tf-form-grid">
                  <div className="tf-form-group">
                    <label>Price (USD)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} step="0.01" />
                  </div>
                  <div className="tf-form-group">
                    <label>Price Note</label>
                    <input type="text" name="price_note" value={formData.price_note} onChange={handleInputChange} placeholder="e.g., One-time payment" />
                  </div>
                  <div className="tf-form-group">
                    <label>Badge (e.g., &quot;New&quot;, &quot;Best Seller&quot;)</label>
                    <input type="text" name="badge" value={formData.badge} onChange={handleInputChange} />
                  </div>
                  <div className="tf-form-group">
                    <label>Badge Class</label>
                    <input type="text" name="badge_class" value={formData.badge_class} onChange={handleInputChange} />
                  </div>
                  <div className="tf-checkbox-group">
                    <label><input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} /> Active (visible to public)</label>
                    <label><input type="checkbox" name="is_draft" checked={formData.is_draft} onChange={handleInputChange} /> Draft (hide from public)</label>
                  </div>
                </div>
              </div>
            )}

            <div className="tf-form-navigation">
              <button type="button" className="tf-nav-btn" onClick={() => {
                const tabs = ['basic', 'media', 'details', 'pricing'];
                const idx = tabs.indexOf(activeTab);
                if (idx > 0) setActiveTab(tabs[idx - 1]);
              }}>← Previous</button>
              <button type="button" className="tf-nav-btn tf-primary" onClick={() => {
                const tabs = ['basic', 'media', 'details', 'pricing'];
                const idx = tabs.indexOf(activeTab);
                if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1]);
              }}>Next →</button>
            </div>
          </form>
        </div>

        <div className="tf-preview-sidebar">
          <h3>📱 Template Preview</h3>
          <div className="tf-preview-card">
            <div className="tf-preview-image">
              {formData.image ? <img src={URL.createObjectURL(formData.image)} alt="Preview" /> : initialData?.image ? <img src={initialData.image} alt="Preview" /> : <div className="tf-placeholder-image">🖼️</div>}
            </div>
            <div className="tf-preview-info">
              <h4>{formData.name || initialData?.name || 'Template Name'}</h4>
              <p>{formData.description || initialData?.description || 'Description'}</p>
              <div className="tf-preview-meta">
                <span className="tf-category-badge">{formData.category.length ? formData.category.join(', ') : (initialData?.category?.join(', ') || 'Category')}</span>
                <span className="tf-preview-price">${formData.price || initialData?.price || '0'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
