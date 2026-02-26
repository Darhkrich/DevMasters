'use client';

import { useState } from 'react';
import './styles.css';

const ClientDashboard = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Sarah Smith',
      email: 'sarah@ecommerce.com',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=3498db&color=fff',
      status: 'active',
      tags: ['VIP', 'E-commerce'],
      tickets: 8,
      rating: 4.9,
      lastContact: '2d',
      package: 'E-commerce'
    },
    {
      id: 2,
      name: 'Mike Johnson',
      email: 'mike@portfolio.com',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=27ae60&color=fff',
      status: 'active',
      tags: ['Business'],
      tickets: 12,
      rating: 4.7,
      lastContact: '5h',
      package: 'Business'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily@restaurant.com',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=f39c12&color=fff',
      status: 'away',
      tags: ['New', 'Essential'],
      tickets: 3,
      rating: 5.0,
      lastContact: '1d',
      package: 'Essential'
    },
    {
      id: 4,
      name: 'Robert Brown',
      email: 'robert@techstartup.com',
      avatar: 'https://ui-avatars.com/api/?name=Robert+Brown&background=9b59b6&color=fff',
      status: 'active',
      tags: ['VIP', 'E-commerce'],
      tickets: 15,
      rating: 4.8,
      lastContact: '3h',
      package: 'E-commerce'
    },
    {
      id: 5,
      name: 'Jennifer Wilson',
      email: 'jennifer@consulting.com',
      avatar: 'https://ui-avatars.com/api/?name=Jennifer+Wilson&background=e74c3c&color=fff',
      status: 'inactive',
      tags: ['Business'],
      tickets: 5,
      rating: 4.6,
      lastContact: '1w',
      package: 'Business'
    },
    {
      id: 6,
      name: 'David Miller',
      email: 'david@fashion.com',
      avatar: 'https://ui-avatars.com/api/?name=David+Miller&background=1abc9c&color=fff',
      status: 'active',
      tags: ['New', 'Essential'],
      tickets: 2,
      rating: 5.0,
      lastContact: '2h',
      package: 'Essential'
    }
  ]);

  const [supportStats, setSupportStats] = useState({
    activeClients: 24,
    monthlyGrowth: '+3 this month',
    totalConversations: 156,
    engagementGrowth: '+12% engagement',
    avgResponseTime: '12m',
    responseRating: 'Excellent',
    avgSatisfaction: '4.8/5',
    satisfactionPercent: '94% positive'
  });

  const [filters, setFilters] = useState({
    status: 'All Clients',
    package: 'All Packages',
    view: 'All Clients'
  });

  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleViewChange = (view) => {
    setFilters(prev => ({
      ...prev,
      view
    }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleMessageClient = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    alert(`Starting chat with ${client.name}...`);
    // In real app, navigate to chat or open chat modal
  };

  const handleViewHistory = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    alert(`Viewing history for ${client.name}...`);
    // In real app, navigate to client history page
  };

  const handleExportClients = () => {
    alert('Exporting client data...');
    // In real app, trigger CSV/Excel export
  };

  const filteredClients = clients.filter(client => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = filters.status === 'All Clients' || 
      (filters.status === 'Active' && client.status === 'active') ||
      (filters.status === 'Inactive' && client.status === 'inactive') ||
      (filters.status === 'VIP' && client.tags.includes('VIP')) ||
      (filters.status === 'New' && client.tags.includes('New'));
    
    // Package filter
    const matchesPackage = filters.package === 'All Packages' || 
      client.package === filters.package;

    // View filter
    let matchesView = true;
    if (filters.view === 'Recent Activity') {
      matchesView = client.lastContact.includes('h') || client.lastContact.includes('d');
    } else if (filters.view === 'Need Follow-up') {
      matchesView = client.lastContact.includes('d') || client.lastContact.includes('w');
    }

    return matchesSearch && matchesStatus && matchesPackage && matchesView;
  });

  return (
    <div className="admin-container">
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>My Clients</h1>
            <p className="welcome-text">Manage client relationships and support history</p>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search clients..." 
                value={searchQuery}
                onChange={handleSearch}
              />
              <button>🔍</button>
            </div>
          </div>
        </header>

        {/* Client Statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <span>👥</span>
            </div>
            <div className="stat-info">
              <h3>{supportStats.activeClients}</h3>
              <p>Active Clients</p>
              <span className="stat-trend">{supportStats.monthlyGrowth}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <span>💬</span>
            </div>
            <div className="stat-info">
              <h3>{supportStats.totalConversations}</h3>
              <p>Total Conversations</p>
              <span className="stat-trend positive">
                {supportStats.engagementGrowth}
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <span>⏱</span>
            </div>
            <div className="stat-info">
              <h3>{supportStats.avgResponseTime}</h3>
              <p>Avg. Response Time</p>
              <span className="stat-trend positive">{supportStats.responseRating}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <span>⭐</span>
            </div>
            <div className="stat-info">
              <h3>{supportStats.avgSatisfaction}</h3>
              <p>Avg. Satisfaction</p>
              <span className="stat-trend positive">
                {supportStats.satisfactionPercent} positive
              </span>
            </div>
          </div>
        </div>

        {/* Client Filters */}
        <div className="filters-bar">
          <div className="filter-group">
            <label>Status:</label>
            <select 
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option>All Clients</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>VIP</option>
              <option>New</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Package:</label>
            <select 
              value={filters.package}
              onChange={(e) => handleFilterChange('package', e.target.value)}
            >
              <option>All Packages</option>
              <option>Essential</option>
              <option>Business</option>
              <option>E-commerce</option>
            </select>
          </div>
          <button 
            className={`filter-btn ${filters.view === 'All Clients' ? 'active' : ''}`}
            onClick={() => handleViewChange('All Clients')}
          >
            All Clients
          </button>
          <button 
            className={`filter-btn ${filters.view === 'Recent Activity' ? 'active' : ''}`}
            onClick={() => handleViewChange('Recent Activity')}
          >
            Recent Activity
          </button>
          <button 
            className={`filter-btn ${filters.view === 'Need Follow-up' ? 'active' : ''}`}
            onClick={() => handleViewChange('Need Follow-up')}
          >
            Need Follow-up
          </button>
        </div>

        {/* Clients List */}
        <div className="content-card">
          <div className="card-header">
            <h2>Client List ({filteredClients.length})</h2>
            <div className="header-actions">
              <button className="export-btn" onClick={handleExportClients}>
                Export
              </button>
            </div>
          </div>

          <div className="clients-list">
            {filteredClients.map(client => (
              <div key={client.id} className="client-card">
                <div className="client-avatar">
                  <img src={client.avatar} alt={client.name} />
                  <div className={`client-status ${client.status}`}></div>
                </div>
                <div className="client-info">
                  <div className="client-main">
                    <h3>{client.name}</h3>
                    <p className="client-email">{client.email}</p>
                    <div className="client-tags">
                      {client.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className={`client-tag ${
                            tag === 'VIP' ? 'vip' : 
                            tag === 'New' ? 'new' : 'package'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="client-stats">
                    <div className="client-stat">
                      <strong>{client.tickets}</strong>
                      <span>Tickets</span>
                    </div>
                    <div className="client-stat">
                      <strong>{client.rating}</strong>
                      <span>Rating</span>
                    </div>
                    <div className="client-stat">
                      <strong>{client.lastContact}</strong>
                      <span>Last Contact</span>
                    </div>
                  </div>
                </div>
                <div className="client-actions">
                  <button 
                    className="action-btn primary"
                    onClick={() => handleMessageClient(client.id)}
                  >
                    Message
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={() => handleViewHistory(client.id)}
                  >
                    History
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;