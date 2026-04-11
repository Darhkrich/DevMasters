'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchAppServices } from '@/lib/boemApi';
import './styles.css';

export default function ApplicationsManagementPage() {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      try {
        const payload = await fetchAppServices();
        if (isMounted) {
          setServices(payload || []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'Unable to load application services.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return services.filter((service) => {
      if (!query) {
        return true;
      }

      return [service.title, service.description, service.category]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [searchQuery, services]);

  return (
    <div className="admin-container">
      <main className="admin-main-content">
        <header className="admin-dashboard-header">
          <div className="admin-header-left">
            <h1>Application Services</h1>
            <p className="admin-welcome-text">Track the live application and web services catalogue.</p>
          </div>
        </header>

        {error ? <div className="auth-error-message">{error}</div> : null}

        <div className="filters-bar">
          <div className="filter-group">
            <label htmlFor="serviceSearch">Search</label>
            <input
              id="serviceSearch"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search services"
            />
          </div>
        </div>

        <div className="admin-content-card">
          <div className="admin-card-header">
            <h2>Services ({filteredServices.length})</h2>
          </div>
          <div className="admin-card-body">
            {loading ? <p>Loading services...</p> : null}
            {!loading && filteredServices.length === 0 ? <p>No services found.</p> : null}
            <div className="solutions-grid">
              {filteredServices.map((service) => (
                <div key={service.id} className="solution-item">
                  <h4>{service.title}</h4>
                  <p>{service.description || 'No description yet.'}</p>
                  <p><strong>Category:</strong> {service.category || 'service'}</p>
                  <p><strong>Features:</strong> {(service.features || []).length}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
