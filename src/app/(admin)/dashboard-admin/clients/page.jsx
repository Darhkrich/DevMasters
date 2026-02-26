'use client';
import './styles.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ClientsManagementPage = () => {
  const router = useRouter();
  
  // Clients data
  const [clients, setClients] = useState([
    {
      id: 1001,
      name: 'John Doe',
      company: 'Doe Enterprises',
      email: 'john@doe.com',
      phone: '+1234567890',
      orders: 3,
      totalSpent: 947,
      package: 'business',
      status: ['vip', 'active'],
      lastActivity: '2 days ago',
      avatarColor: '#3498db',
      initials: 'JD',
      clientType: 'vip',
    },
    {
      id: 1002,
      name: 'Sarah Smith',
      company: 'Smith Boutique',
      email: 'sarah@boutique.com',
      phone: '+1234567891',
      orders: 1,
      totalSpent: 499,
      package: 'ecommerce',
      status: ['new', 'active'],
      lastActivity: 'Today',
      avatarColor: '#e74c3c',
      initials: 'SS',
      clientType: 'new',
    },
    {
      id: 1003,
      name: 'Mike Johnson',
      company: 'MJ Designs',
      email: 'mike@designs.com',
      phone: '+1234567892',
      orders: 2,
      totalSpent: 398,
      package: 'essential',
      status: ['active'],
      lastActivity: '1 week ago',
      avatarColor: '#27ae60',
      initials: 'MJ',
      clientType: 'regular',
    },
    {
      id: 1004,
      name: 'Emily Davis',
      company: 'Davis Restaurant',
      email: 'emily@restaurant.com',
      phone: '+1234567893',
      orders: 1,
      totalSpent: 349,
      package: 'business',
      status: ['followup'],
      lastActivity: '2 weeks ago',
      avatarColor: '#f39c12',
      initials: 'ED',
      clientType: 'followup',
    },
    {
      id: 1005,
      name: 'Robert Brown',
      company: 'Brown Medical',
      email: 'robert@medical.com',
      phone: '+1234567894',
      orders: 1,
      totalSpent: 399,
      package: 'ecommerce',
      status: ['inactive'],
      lastActivity: '1 month ago',
      avatarColor: '#95a5a6',
      initials: 'RB',
      clientType: 'inactive',
    },
  ]);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('All Clients');
  const [packageFilter, setPackageFilter] = useState('All Packages');
  const [industryFilter, setIndustryFilter] = useState('All Industries');
  const [activeFilter, setActiveFilter] = useState('All Clients');
  const [searchQuery, setSearchQuery] = useState('');

  // Stats
  const [stats, setStats] = useState({
    totalClients: 156,
    newClients: 24,
    activeProjects: 42,
    satisfaction: 4.8,
  });

  // Checkbox states
  const [selectAll, setSelectAll] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);

  // Filtered clients
  const [filteredClients, setFilteredClients] = useState(clients);

  // Communications data
  const [communications, setCommunications] = useState([
    {
      id: 1,
      clientId: 1001,
      name: 'John Doe',
      message: 'Requested design revision for homepage banner',
      time: '2 hours ago',
      type: 'email',
      initials: 'JD',
    },
    {
      id: 2,
      clientId: 1002,
      name: 'Sarah Smith',
      message: 'Approved final design and requested launch',
      time: '5 hours ago',
      type: 'message',
      initials: 'SS',
    },
    {
      id: 3,
      clientId: 1003,
      name: 'Mike Johnson',
      message: 'Inquired about additional SEO services',
      time: '1 day ago',
      type: 'call',
      initials: 'MJ',
    },
    {
      id: 4,
      clientId: 1004,
      name: 'Emily Davis',
      message: 'Follow-up needed: menu updates pending approval',
      time: '2 days ago',
      type: 'followup',
      initials: 'ED',
    },
  ]);

  // Handle filter changes
  useEffect(() => {
    let result = [...clients];

    // Search filter
    if (searchQuery) {
      result = result.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All Clients') {
      result = result.filter(client => {
        switch (statusFilter) {
          case 'Active':
            return client.status.includes('active');
          case 'VIP':
            return client.status.includes('vip');
          case 'New':
            return client.status.includes('new');
          case 'Inactive':
            return client.status.includes('inactive');
          case 'Prospect':
            return client.status.includes('prospect');
          default:
            return true;
        }
      });
    }

    // Package filter
    if (packageFilter !== 'All Packages') {
      result = result.filter(client => client.package === packageFilter.toLowerCase());
    }

    // Quick filters
    switch (activeFilter) {
      case 'VIP Clients':
        result = result.filter(client => client.status.includes('vip'));
        break;
      case 'Need Follow-up':
        result = result.filter(client => client.status.includes('followup'));
        break;
      default:
        break;
    }

    setFilteredClients(result);
  }, [clients, statusFilter, packageFilter, industryFilter, activeFilter, searchQuery]);

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(client => client.id));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual checkbox
  const handleCheckboxChange = (clientId) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  // Handle view client profile
  const handleViewProfile = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    console.log(`Viewing profile: ${client.name}`);
    alert(`Opening profile for ${client.name}`);
  };

  // Handle send message
  const handleSendMessage = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    console.log(`Sending message to: ${client.name}`);
    alert(`Opening chat with ${client.name}`);
  };

  // Handle more actions
  const handleMoreActions = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    console.log(`More actions for: ${client.name}`);
    alert(`Showing more options for ${client.name}`);
  };

  // Handle add new client
  const handleAddNewClient = () => {
    console.log('Opening new client form');
    router.push('/clients/add-new');
  };

  // Handle export clients
  const handleExportClients = () => {
    console.log('Exporting clients data');
    // Simulate export
    setTimeout(() => {
      alert('Client data exported successfully!');
    }, 1000);
  };

  // Handle bulk actions
  const handleBulkActions = () => {
    console.log('Opening bulk actions menu');
    alert(`Bulk actions for ${selectedClients.length} selected clients`);
  };

  // Handle import CSV
  const handleImportCSV = () => {
    console.log('Opening CSV import');
    alert('Opening CSV import dialog');
  };

  // Handle quick actions
  const handleQuickAction = (action) => {
    console.log(`Quick action: ${action}`);
    switch (action) {
      case 'Send Bulk Email':
        alert('Opening bulk email composer');
        break;
      case 'Create Segment':
        alert('Opening client segment creator');
        break;
      case 'Client Analytics':
        alert('Opening client analytics dashboard');
        break;
      case 'Sync Email':
        alert('Syncing email communications');
        break;
      case 'Export Data':
        alert('Exporting client data');
        break;
      case 'Client Settings':
        alert('Opening client management settings');
        break;
      default:
        break;
    }
  };

  // Handle view all communications
  const handleViewAllCommunications = () => {
    console.log('Viewing all communications');
    router.push('/clients/communications');
  };

  // Handle pagination
  const handlePageChange = (page) => {
    console.log(`Navigating to page ${page}`);
    // In a real app, this would fetch data for the selected page
  };

  // Get status badges
  const getStatusBadges = (statuses) => {
    return statuses.map((status, index) => {
      let className = '';
      let text = '';
      
      switch (status) {
        case 'vip':
          className = 'status-badge status-vip';
          text = 'VIP';
          break;
        case 'active':
          className = 'status-badge status-active';
          text = 'Active';
          break;
        case 'new':
          className = 'status-badge status-new';
          text = 'New';
          break;
        case 'followup':
          className = 'status-badge status-followup';
          text = 'Follow-up';
          break;
        case 'inactive':
          className = 'status-badge status-inactive';
          text = 'Inactive';
          break;
        default:
          className = 'status-badge';
          text = status;
      }
      
      return (
        <span key={index} className={className}>
          {text}
        </span>
      );
    });
  };

  // Get package badge
  const getPackageBadge = (pkg) => {
    switch (pkg) {
      case 'essential':
        return { className: 'package-badge essential', text: 'Essential' };
      case 'business':
        return { className: 'package-badge business', text: 'Business' };
      case 'ecommerce':
        return { className: 'package-badge ecommerce', text: 'E-commerce' };
      default:
        return { className: 'package-badge', text: pkg };
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get communication type class
  const getCommTypeClass = (type) => {
    switch (type) {
      case 'email':
        return 'comm-type email';
      case 'message':
        return 'comm-type message';
      case 'call':
        return 'comm-type call';
      case 'followup':
        return 'comm-type followup';
      default:
        return 'comm-type';
    }
  };

  // Get communication type text
  const getCommTypeText = (type) => {
    switch (type) {
      case 'email':
        return 'Email';
      case 'message':
        return 'Message';
      case 'call':
        return 'Phone Call';
      case 'followup':
        return 'Follow-up';
      default:
        return type;
    }
  };

  return (
    <div className="admin-container">
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Clients Management</h1>
            <p className="welcome-text">Manage all your clients and their projects</p>
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
            <button 
              className="primary-btn"
              onClick={handleAddNewClient}
            >
              + Add New Client
            </button>
          </div>
        </header>

        {/* Client Statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e3f2fd' }}>
              <span>👥</span>
            </div>
            <div className="stat-info">
              <h3>{stats.totalClients}</h3>
              <p>Total Clients</p>
              <span className="stat-trend positive">+8 this month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e8f5e9' }}>
              <span>🆕</span>
            </div>
            <div className="stat-info">
              <h3>{stats.newClients}</h3>
              <p>New Clients</p>
              <span className="stat-trend positive">+12% growth</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fff3e0' }}>
              <span>🚀</span>
            </div>
            <div className="stat-info">
              <h3>{stats.activeProjects}</h3>
              <p>Active Projects</p>
              <span className="stat-trend">In development</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#f3e5f5' }}>
              <span>⭐</span>
            </div>
            <div className="stat-info">
              <h3>{stats.satisfaction}/5</h3>
              <p>Avg. Satisfaction</p>
              <span className="stat-trend positive">Excellent</span>
            </div>
          </div>
        </div>

        {/* Client Filters & Segments */}
        <div className="filters-bar">
          <div className="filter-group">
            <label>Status:</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Clients</option>
              <option>Active</option>
              <option>VIP</option>
              <option>New</option>
              <option>Inactive</option>
              <option>Prospect</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Package:</label>
            <select 
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
            >
              <option>All Packages</option>
              <option>Essential</option>
              <option>Business</option>
              <option>E-commerce</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Industry:</label>
            <select 
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option>All Industries</option>
              <option>Business</option>
              <option>E-commerce</option>
              <option>Portfolio</option>
              <option>Restaurant</option>
              <option>Medical</option>
            </select>
          </div>
          <button 
            className={`filter-btn ${activeFilter === 'All Clients' ? 'active' : ''}`}
            onClick={() => setActiveFilter('All Clients')}
          >
            All Clients
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'VIP Clients' ? 'active' : ''}`}
            onClick={() => setActiveFilter('VIP Clients')}
          >
            VIP Clients
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'Need Follow-up' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Need Follow-up')}
          >
            Need Follow-up
          </button>
          <button 
            className="export-btn"
            onClick={handleExportClients}
          >
            Export Clients
          </button>
        </div>

        {/* Clients Table */}
        <div className="content-card">
          <div className="card-header">
            <h2>All Clients ({filteredClients.length})</h2>
            <div className="header-actions">
              <button 
                className="bulk-action-btn"
                onClick={handleBulkActions}
                disabled={selectedClients.length === 0}
              >
                Bulk Actions ▼
              </button>
              <button 
                className="import-btn"
                onClick={handleImportCSV}
              >
                Import CSV
              </button>
            </div>
          </div>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    <input 
                      type="checkbox" 
                      className="select-all"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Client</th>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Package</th>
                  <th>Status</th>
                  <th>Last Activity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => {
                  const packageInfo = getPackageBadge(client.package);
                  
                  return (
                    <tr 
                      key={client.id} 
                      className={`${client.clientType}-client`}
                    >
                      <td>
                        <input 
                          type="checkbox" 
                          checked={selectedClients.includes(client.id)}
                          onChange={() => handleCheckboxChange(client.id)}
                        />
                      </td>
                      <td>
                        <div className="client-avatar">
                          <div 
                            className="avatar-img" 
                            style={{ background: client.avatarColor }}
                          >
                            {client.initials}
                          </div>
                          <div className="client-details">
                            <strong>{client.name}</strong>
                            <small>Client ID: CL-{client.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>{client.company}</td>
                      <td>
                        <div className="contact-info">
                          <small>📧 {client.email}</small>
                          <small>📞 {client.phone}</small>
                        </div>
                      </td>
                      <td>{client.orders}</td>
                      <td>{formatCurrency(client.totalSpent)}</td>
                      <td>
                        <span className={packageInfo.className}>
                          {packageInfo.text}
                        </span>
                      </td>
                      <td>
                        {getStatusBadges(client.status)}
                      </td>
                      <td>{client.lastActivity}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="icon-btn" 
                            title="View Profile"
                            onClick={() => handleViewProfile(client.id)}
                          >
                            👁
                          </button>
                          <button 
                            className="icon-btn" 
                            title="Send Message"
                            onClick={() => handleSendMessage(client.id)}
                          >
                            💬
                          </button>
                          <button 
                            className="icon-btn" 
                            title="More"
                            onClick={() => handleMoreActions(client.id)}
                          >
                            ⋯
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan="10" className="no-clients">
                      <div className="no-clients-content">
                        <div className="no-clients-icon">👥</div>
                        <h3>No clients found</h3>
                        <p>Try adjusting your search or filters</p>
                        <button 
                          className="clear-filters-btn"
                          onClick={() => {
                            setStatusFilter('All Clients');
                            setPackageFilter('All Packages');
                            setIndustryFilter('All Industries');
                            setActiveFilter('All Clients');
                            setSearchQuery('');
                          }}
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button 
              className="page-btn"
              onClick={() => handlePageChange('previous')}
            >
              ← Previous
            </button>
            <button 
              className="page-btn active"
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            <button 
              className="page-btn"
              onClick={() => handlePageChange(2)}
            >
              2
            </button>
            <button 
              className="page-btn"
              onClick={() => handlePageChange(3)}
            >
              3
            </button>
            <span>...</span>
            <button 
              className="page-btn"
              onClick={() => handlePageChange(16)}
            >
              16
            </button>
            <button 
              className="page-btn"
              onClick={() => handlePageChange('next')}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Quick Actions & Communication */}
        <div className="content-grid">
          {/* Quick Actions */}
          <div className="content-card">
            <div className="card-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions-grid">
              <button 
                className="quick-action-btn"
                onClick={() => handleQuickAction('Send Bulk Email')}
              >
                <span>📧</span>
                Send Bulk Email
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => handleQuickAction('Create Segment')}
              >
                <span>📋</span>
                Create Segment
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => handleQuickAction('Client Analytics')}
              >
                <span>📊</span>
                Client Analytics
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => handleQuickAction('Sync Email')}
              >
                <span>🔄</span>
                Sync Email
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => handleQuickAction('Export Data')}
              >
                <span>📁</span>
                Export Data
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => handleQuickAction('Client Settings')}
              >
                <span>⚙</span>
                Client Settings
              </button>
            </div>
          </div>

          {/* Recent Communications */}
          <div className="content-card">
            <div className="card-header">
              <h2>Recent Communications</h2>
              <button 
                className="view-all-btn"
                onClick={handleViewAllCommunications}
              >
                View All →
              </button>
            </div>
            <div className="communications-list">
              {communications.map((comm) => (
                <div className="comm-item" key={comm.id}>
                  <div className="comm-avatar" style={{ background: clients.find(c => c.id === comm.clientId)?.avatarColor || '#3498db' }}>
                    {comm.initials}
                  </div>
                  <div className="comm-details">
                    <h4>{comm.name}</h4>
                    <p>{comm.message}</p>
                    <div className="comm-meta">
                      <span className="comm-time">{comm.time}</span>
                      <span className={getCommTypeClass(comm.type)}>
                        {getCommTypeText(comm.type)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientsManagementPage;