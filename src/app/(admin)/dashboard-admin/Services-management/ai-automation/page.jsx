'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchAIAutomations, fetchAIBundles } from '@/lib/boemApi';
import './styles.css';

export default function AIAutomationManagementPage() {
  const [automations, setAutomations] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadAiCatalog = async () => {
      try {
        const [automationsPayload, bundlesPayload] = await Promise.all([
          fetchAIAutomations(),
          fetchAIBundles(),
        ]);

        if (isMounted) {
          setAutomations(automationsPayload || []);
          setBundles(bundlesPayload || []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'Unable to load AI services.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAiCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAutomations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return automations.filter((automation) => {
      if (!query) {
        return true;
      }

      return [automation.title, automation.description, automation.sector]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [automations, searchQuery]);

  return (
    <div className="admin-container">
      <main className="admin-main-content">
        <header className="admin-dashboard-header">
          <div className="admin-header-left">
            <h1>AI Automation</h1>
            <p className="admin-welcome-text">View the live AI automation and bundle catalogue .</p>
          </div>
        </header>

        {error ? <div className="auth-error-message">{error}</div> : null}

        <div className="filters-bar">
          <div className="filter-group">
            <label htmlFor="automationSearch">Search</label>
            <input
              id="automationSearch"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search AI automations"
            />
          </div>
        </div>

        <div className="admin-content-card">
          <div className="admin-card-header">
            <h2>Automations ({filteredAutomations.length})</h2>
          </div>
          <div className="admin-card-body">
            {loading ? <p>Loading AI services...</p> : null}
            {!loading && filteredAutomations.length === 0 ? <p>No AI automations found.</p> : null}
            <div className="solutions-grid">
              {filteredAutomations.map((automation) => (
                <div key={automation.id} className="solution-item">
                  <h4>{automation.title}</h4>
                  <p>{automation.description || 'No description yet.'}</p>
                  <p><strong>Sector:</strong> {automation.sector || 'all'}</p>
                  <p><strong>Use cases:</strong> {(automation.useCases || []).length}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-content-card">
          <div className="admin-card-header">
            <h2>Bundles ({bundles.length})</h2>
          </div>
          <div className="admin-card-body">
            {!loading && bundles.length === 0 ? <p>No AI bundles found.</p> : null}
            <div className="solutions-grid">
              {bundles.map((bundle) => (
                <div key={bundle.id} className="solution-item">
                  <h4>{bundle.title}</h4>
                  <p>{bundle.description || 'No description yet.'}</p>
                  <p><strong>Items:</strong> {(bundle.items || []).length}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
