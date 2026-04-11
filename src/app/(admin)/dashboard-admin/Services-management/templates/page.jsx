'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { fetchTemplates } from '@/lib/boemApi';
import './styles.css';

export default function TemplateManagementPage() {
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadTemplates = async () => {
      try {
        const payload = await fetchTemplates();
        if (isMounted) {
          setTemplates(payload || []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'Unable to load templates.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTemplates();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTemplates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return templates.filter((template) => {
      const matchesType = typeFilter === 'all' || template.type === typeFilter;
      const matchesSearch =
        !query ||
        [template.name, template.shortName, template.description]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));
      return matchesType && matchesSearch;
    });
  }, [searchQuery, templates, typeFilter]);

  return (
    <div className="admin-container">
      <main className="admin-main-content">
        <header className="admin-dashboard-header">
          <div className="admin-header-left">
            <h1>Templates</h1>
            <p className="admin-welcome-text">Review the live website template catalogue.</p>
          </div>
          <div className="admin-header-right">
            <Link href="/dashboard-admin/Add-Templates" className="primary-btn">
              Add Template
            </Link>
          </div>
        </header>

        {error ? <div className="auth-error-message">{error}</div> : null}

        <div className="filters-bar">
          <div className="filter-group">
            <label htmlFor="templateSearch">Search</label>
            <input
              id="templateSearch"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search templates"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="templateType">Type</label>
            <select id="templateType" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="all">All</option>
              <option value="ready">Ready</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        <div className="admin-content-card">
          <div className="admin-card-header">
            <h2>Templates ({filteredTemplates.length})</h2>
          </div>
          <div className="admin-card-body">
            {loading ? <p>Loading templates...</p> : null}
            {!loading && filteredTemplates.length === 0 ? <p>No templates found.</p> : null}
            <div className="solutions-grid">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="solution-item">
                  <h4>{template.name}</h4>
                  <p>{template.description || 'No description yet.'}</p>
                  <p><strong>Type:</strong> {template.type}</p>
                  <p><strong>Price:</strong> {template.priceLabel}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
