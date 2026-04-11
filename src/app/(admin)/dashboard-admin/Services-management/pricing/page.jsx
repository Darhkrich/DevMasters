'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchPricingPackagesAdmin } from '@/lib/boemApi';
import './styles.css';

export default function PricingManagementPage() {
  const [packages, setPackages] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadPackages = async () => {
      try {
        const payload = await fetchPricingPackagesAdmin();
        if (isMounted) {
          setPackages(payload?.results || payload || []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'Unable to load pricing packages.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPackages();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(
    () => ['all', ...new Set(packages.map((item) => item.category).filter(Boolean))],
    [packages],
  );

  const filteredPackages = useMemo(
    () => packages.filter((item) => categoryFilter === 'all' || item.category === categoryFilter),
    [categoryFilter, packages],
  );

  return (
    <div className="admin-container">
      <main className="admin-main-content">
        <header className="admin-dashboard-header">
          <div className="admin-header-left">
            <h1>Pricing Packages</h1>
            <p className="admin-welcome-text">Review the live package and tier structure used by DevMasters.</p>
          </div>
        </header>

        {error ? <div className="auth-error-message">{error}</div> : null}

        <div className="filters-bar">
          <div className="filter-group">
            <label htmlFor="pricingCategory">Category</label>
            <select id="pricingCategory" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-content-card">
          <div className="admin-card-header">
            <h2>Packages ({filteredPackages.length})</h2>
          </div>
          <div className="admin-card-body">
            {loading ? <p>Loading packages...</p> : null}
            {!loading && filteredPackages.length === 0 ? <p>No packages found.</p> : null}
            <div className="solutions-grid">
              {filteredPackages.map((item) => (
                <div key={item.id} className="solution-item">
                  <h4>{item.title}</h4>
                  <p>{item.subtitle || 'No subtitle'}</p>
                  <p><strong>Category:</strong> {item.category}</p>
                  <p><strong>Tier:</strong> {item.tier}</p>
                  <p>
                    <strong>One-time:</strong> {item.billingOneTime || 'N/A'} |{' '}
                    <strong>Monthly:</strong> {item.billingMonthly || 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
