'use client';
import './clients.css';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { fetchClients } from '@/lib/boemApi';

export default function ClientsManagementPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const timer = window.setTimeout(async () => {
      try {
        const payload = await fetchClients({
          search: searchQuery || undefined,
          plan: planFilter || undefined,
          is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
        });

        if (!isMounted) return;
        setClients(payload.results || []);
        setError('');
      } catch (requestError) {
        if (!isMounted) return;
        setError(requestError.message || 'Unable to load clients.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }, 250);

    return () => {
      isMounted = false;
      window.clearTimeout(timer);
    };
  }, [planFilter, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const activeProjects = clients.reduce((sum, client) => sum + (client.active_projects || 0), 0);
    return {
      totalClients: clients.length,
      activeClients: clients.filter((client) => client.is_active).length,
      activeProjects,
      starterPlans: clients.filter((client) => client.plan === 'starter').length,
    };
  }, [clients]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map((client) => client.id));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (clientId) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter((id) => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  return (
    <div className="ac-container">
      <main className="ac-main-content">
        <header className="ac-header">
          <div className="ac-header-left">
            <h1>Clients Management</h1>
            <p className="ac-welcome-text">Manage all client profiles from the backend</p>
          </div>
          <div className="ac-header-right">
            <div className="ac-search-bar">
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <button>Search</button>
            </div>
            <Link className="ac-primary-btn" href="/dashboard-admin/Messages">
              Open Messages
            </Link>
          </div>
        </header>

        {error && (
          <div className="ac-error-card">
            <p>{error}</p>
            <Link href="/admin-login" className="ac-clear-filters-btn">
              Go to admin login
            </Link>
          </div>
        )}

        <div className="ac-stats-grid">
          <div className="ac-stat-card">
            <div className="ac-stat-icon clients">
              <span>Clients</span>
            </div>
            <div className="ac-stat-info">
              <h3>{stats.totalClients}</h3>
              <p>Total Clients</p>
              <span className="ac-stat-trend positive">Live records</span>
            </div>
          </div>

          <div className="ac-stat-card">
            <div className="ac-stat-icon active">
              <span>Active</span>
            </div>
            <div className="ac-stat-info">
              <h3>{stats.activeClients}</h3>
              <p>Active Clients</p>
              <span className="ac-stat-trend positive">Enabled profiles</span>
            </div>
          </div>

          <div className="ac-stat-card">
            <div className="ac-stat-icon projects">
              <span>Projects</span>
            </div>
            <div className="ac-stat-info">
              <h3>{stats.activeProjects}</h3>
              <p>Active Projects</p>
              <span className="ac-stat-trend">Across all clients</span>
            </div>
          </div>

          <div className="ac-stat-card">
            <div className="ac-stat-icon starter">
              <span>Starter</span>
            </div>
            <div className="ac-stat-info">
              <h3>{stats.starterPlans}</h3>
              <p>Starter Plans</p>
              <span className="ac-stat-trend">Plan mix</span>
            </div>
          </div>
        </div>

        <div className="ac-filters-bar">
          <div className="ac-filter-group">
            <label>Status:</label>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All Clients</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="ac-filter-group">
            <label>Plan:</label>
            <select value={planFilter} onChange={(event) => setPlanFilter(event.target.value)}>
              <option value="">All Plans</option>
              <option value="starter">Starter</option>
              <option value="pro">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          <button className="ac-export-btn" type="button">
            Export Clients
          </button>
        </div>

        <div className="ac-card">
          <div className="ac-card-header">
            <h2>All Clients ({clients.length})</h2>
            <div className="ac-header-actions">
              <button className="ac-bulk-action-btn" disabled={selectedClients.length === 0}>
                Bulk Actions
              </button>
            </div>
          </div>

          <div className="ac-table-container">
            <table className="ac-data-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" className="ac-select-all" checked={selectAll} onChange={handleSelectAll} />
                  </th>
                  <th>Client</th>
                  <th>Company</th>
                  <th>Plan</th>
                  <th>Projects</th>
                  <th>Inquiries</th>
                  <th>Orders</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedClients.includes(client.id)}
                        onChange={() => handleCheckboxChange(client.id)}
                      />
                    </td>
                    <td>
                      <div className="ac-client-avatar">
                        <div className="ac-avatar-img" style={{ background: '#3498db' }}>
                          {client.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="ac-client-details">
                          <strong>{client.name}</strong>
                          <small>{client.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{client.company || '-'}</td>
                    <td>{client.plan}</td>
                    <td>{client.active_projects}</td>
                    <td>{client.inquiry_count}</td>
                    <td>{client.order_count}</td>
                    <td>{client.is_active ? 'Active' : 'Inactive'}</td>
                  </tr>
                ))}

                {!loading && clients.length === 0 && (
                  <tr>
                    <td colSpan="8" className="ac-no-clients">
                      <div className="ac-no-clients-content">
                        <div className="ac-no-clients-icon">No Data</div>
                        <h3>No clients found</h3>
                        <p>Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {loading && <div className="ac-pagination">Loading live clients...</div>}
        </div>
      </main>
    </div>
  );
}