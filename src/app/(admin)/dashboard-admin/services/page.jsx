// app/admin/services/page.js
'use client';

import { useEffect, useState } from 'react';
import {
  fetchAppServicesAdmin,
  createAppServiceAdmin,
  updateAppServiceAdmin,
  deleteAppServiceAdmin,
} from '@/lib/boemApi';
import './services.css';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    type: [],
    icon: '',
    meta: [],
    features: [],
    category: 'service',
    tag: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAppServicesAdmin();
      setServices(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateAppServiceAdmin(editing.id, formData);
      } else {
        await createAppServiceAdmin(formData);
      }
      resetForm();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    try {
      await deleteAppServiceAdmin(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const editItem = (item) => {
    setEditing(item);
    setFormData({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type,
      icon: item.icon,
      meta: item.meta,
      features: item.features,
      category: item.category,
      tag: item.tag || '',
    });
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      id: '',
      title: '',
      description: '',
      type: [],
      icon: '',
      meta: [],
      features: [],
      category: 'service',
      tag: '',
    });
  };

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked ? [...prev[name], value] : prev[name].filter(v => v !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleJsonField = (e) => {
    const { name, value } = e.target;
    try {
      const parsed = JSON.parse(value);
      setFormData((prev) => ({ ...prev, [name]: parsed }));
    } catch (err) {
      // ignore invalid JSON while typing
    }
  };

  if (loading) return <div className="as-container">Loading...</div>;
  if (error) return <div className="as-container as-error">Error: {error}</div>;

  return (
    <div className="as-container">
      <main className="as-main-content">
        <div className="as-header">
          <h1>Admin: App Services</h1>
        </div>

        <div className="as-card">
          <h3>{editing ? 'Edit Service' : 'Add New Service'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="as-form-grid">
              <input
                type="text"
                name="id"
                placeholder="ID (slug)"
                value={formData.id}
                onChange={handleFieldChange}
                required
              />
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleFieldChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                rows="2"
                value={formData.description}
                onChange={handleFieldChange}
                required
              />
              <div className="as-checkbox-group">
                <label>Type (web, mobile, fullstack, saas):</label>
                <div className="as-checkbox-options">
                  {['web', 'mobile', 'fullstack', 'saas'].map((type) => (
                    <label key={type}>
                      <input
                        type="checkbox"
                        name="type"
                        value={type}
                        checked={formData.type.includes(type)}
                        onChange={handleFieldChange}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
              <input
                type="text"
                name="icon"
                placeholder="Icon class (e.g., fas fa-globe)"
                value={formData.icon}
                onChange={handleFieldChange}
                required
              />
              <textarea
                name="meta"
                placeholder="Meta (JSON array of objects)"
                rows="3"
                value={JSON.stringify(formData.meta, null, 2)}
                onChange={handleJsonField}
              />
              <textarea
                name="features"
                placeholder="Features (JSON array of strings)"
                rows="3"
                value={JSON.stringify(formData.features, null, 2)}
                onChange={handleJsonField}
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleFieldChange}
                required
              >
                <option value="service">Service</option>
                <option value="blueprint">Blueprint</option>
              </select>
              <input
                type="text"
                name="tag"
                placeholder="Tag (e.g., Popular)"
                value={formData.tag}
                onChange={handleFieldChange}
              />
            </div>
            <div className="as-form-actions">
              <button type="submit" className="as-btn-primary">{editing ? 'Update' : 'Create'}</button>
              {editing && <button type="button" className="as-btn-secondary" onClick={resetForm}>Cancel</button>}
            </div>
          </form>
        </div>

        <div className="as-list">
          {services.map((service) => (
            <div key={service.id} className="as-card-item">
              <div><strong>{service.title}</strong> ({service.id})</div>
              <div>Category: {service.category}</div>
              <div>Type: {service.type.join(', ')}</div>
              <div className="as-card-actions">
                <button className="as-btn-outline" onClick={() => editItem(service)}>Edit</button>
                <button className="as-btn-danger" onClick={() => handleDelete(service.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}