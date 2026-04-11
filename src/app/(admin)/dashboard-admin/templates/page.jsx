'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchTemplatesAdmin, deleteTemplateAdmin } from '@/lib/boemApi';
import './templates.css';

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await fetchTemplatesAdmin();
      setTemplates(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this template? This action cannot be undone.')) return;
    try {
      await deleteTemplateAdmin(id);
      loadTemplates();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="at-container">Loading templates...</div>;
  if (error) return <div className="at-container at-error">Error: {error}</div>;

  return (
    <div className="at-container">
      <main className="at-main-content">
        <div className="at-header">
          <h1>Admin: Templates</h1>
          <Link href="/dashboard-admin/Add-Templates" className="at-btn-primary">
            + Add New Template
          </Link>
        </div>

        <div className="at-list">
          {templates.map(template => (
            <div key={template.id} className="at-card">
              <div className="at-card-header">
                <strong>{template.name}</strong>
                <div className="at-badge-group">
                  {template.is_draft && <span className="at-badge at-badge-draft">Draft</span>}
                  {!template.is_active && <span className="at-badge at-badge-inactive">Inactive</span>}
                </div>
              </div>
              <div className="at-card-meta">
                <div>Short name: {template.short_name}</div>
                <div>Type: {template.type === 'ready' ? 'Ready-Made' : 'Customizable'}</div>
                <div>Price: ${template.price || 'N/A'}</div>
                <div>Category: {template.category?.join(', ') || 'None'}</div>
              </div>
              <div className="at-card-actions">
                <Link href={`/dashboard-admin/templates/edit/${template.id}`} className="at-btn-outline">
                  Edit
                </Link>
                <button onClick={() => handleDelete(template.id)} className="at-btn-danger">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}