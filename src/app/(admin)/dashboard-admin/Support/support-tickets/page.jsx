'use client';

import { useState } from 'react';
import './styles.css';

const SupportTicketsDashboard = () => {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      ticketId: 'TKT-1024',
      subject: 'Website Down - Error 500',
      client: 'Sarah Smith',
      priority: 'critical',
      status: 'open',
      assignedTo: 'Unassigned',
      lastUpdate: '25 min ago',
      type: 'Technical',
      urgent: true
    },
    {
      id: 2,
      ticketId: 'TKT-1021',
      subject: 'Payment Gateway Issues',
      client: 'Mike Johnson',
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'Alex Support',
      lastUpdate: '1 hour ago',
      type: 'Technical'
    },
    {
      id: 3,
      ticketId: 'TKT-1015',
      subject: 'Mobile Display Problems',
      client: 'Emily Davis',
      priority: 'medium',
      status: 'waiting',
      assignedTo: 'Alex Support',
      lastUpdate: '2 hours ago',
      type: 'Technical'
    },
    {
      id: 4,
      ticketId: 'TKT-1012',
      subject: 'Billing Query - Invoice #102',
      client: 'Robert Brown',
      priority: 'medium',
      status: 'open',
      assignedTo: 'Unassigned',
      lastUpdate: '3 hours ago',
      type: 'Billing'
    },
    {
      id: 5,
      ticketId: 'TKT-1008',
      subject: 'Feature Request: Dark Mode',
      client: 'Jennifer Wilson',
      priority: 'low',
      status: 'in-progress',
      assignedTo: 'Development Team',
      lastUpdate: '1 day ago',
      type: 'Feature Request'
    },
    {
      id: 6,
      ticketId: 'TKT-1005',
      subject: 'General Support Inquiry',
      client: 'David Miller',
      priority: 'low',
      status: 'resolved',
      assignedTo: 'Alex Support',
      lastUpdate: '2 days ago',
      type: 'General'
    }
  ]);

  const [filters, setFilters] = useState({
    status: 'All Status',
    priority: 'All Priorities',
    type: 'All Types',
    view: 'All Tickets'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTickets, setSelectedTickets] = useState([]);

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

  const handleNewTicket = () => {
    alert('Creating new ticket...');
    // In real app, open ticket creation modal
  };

  const handleExport = () => {
    alert('Exporting tickets...');
    // In real app, trigger CSV/Excel export
  };

  const handleBulkActions = () => {
    if (selectedTickets.length === 0) {
      alert('Please select tickets first');
      return;
    }
    alert(`Performing bulk action on ${selectedTickets.length} tickets...`);
    // In real app, open bulk actions menu
  };

  const handleTakeTicket = (ticketId) => {
    const updatedTickets = tickets.map(ticket => 
      ticket.ticketId === ticketId 
        ? { ...ticket, assignedTo: 'Alex Support', status: 'in-progress' }
        : ticket
    );
    setTickets(updatedTickets);
    alert(`You have taken ticket ${ticketId}`);
  };

  const handleMessageTicket = (ticketId) => {
    const ticket = tickets.find(t => t.ticketId === ticketId);
    alert(`Starting chat for ticket ${ticketId} with ${ticket.client}`);
    // In real app, open chat interface
  };

  const handleRemindTicket = (ticketId) => {
    alert(`Reminder sent for ticket ${ticketId}`);
    // In real app, send reminder notification
  };

  const handleViewTicket = (ticketId) => {
    alert(`Viewing details for ticket ${ticketId}`);
    // In real app, navigate to ticket detail page
  };

  const handleTicketSelect = (ticketId) => {
    setSelectedTickets(prev => {
      if (prev.includes(ticketId)) {
        return prev.filter(id => id !== ticketId);
      } else {
        return [...prev, ticketId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(t => t.ticketId));
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = filters.status === 'All Status' || 
      ticket.status === filters.status.toLowerCase().replace(' ', '-');
    
    // Priority filter
    const matchesPriority = filters.priority === 'All Priorities' || 
      ticket.priority === filters.priority.toLowerCase();
    
    // Type filter
    const matchesType = filters.type === 'All Types' || 
      ticket.type === filters.type;
    
    // View filter
    let matchesView = true;
    if (filters.view === 'My Tickets') {
      matchesView = ticket.assignedTo === 'Alex Support';
    } else if (filters.view === 'Unassigned') {
      matchesView = ticket.assignedTo === 'Unassigned';
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesView;
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return '#ef4444';
      case 'in-progress': return '#3b82f6';
      case 'waiting': return '#f59e0b';
      case 'resolved': return '#10b981';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <div className="admin-container">
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Support Tickets</h1>
            <p className="welcome-text">Manage and resolve client support tickets</p>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search tickets..." 
                value={searchQuery}
                onChange={handleSearch}
              />
              <button>🔍</button>
            </div>
            <button className="primary-btn" onClick={handleNewTicket}>
              + New Ticket
            </button>
          </div>
        </header>

        {/* Ticket Filters */}
        <div className="filters-bar">
          <div className="filter-group">
            <label>Status:</label>
            <select 
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option>All Status</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Waiting Client</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Priority:</label>
            <select 
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option>All Priorities</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Type:</label>
            <select 
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option>All Types</option>
              <option>Technical</option>
              <option>Billing</option>
              <option>General</option>
              <option>Feature Request</option>
            </select>
          </div>
          <button 
            className={`filter-btn ${filters.view === 'All Tickets' ? 'active' : ''}`}
            onClick={() => handleViewChange('All Tickets')}
          >
            All Tickets
          </button>
          <button 
            className={`filter-btn ${filters.view === 'My Tickets' ? 'active' : ''}`}
            onClick={() => handleViewChange('My Tickets')}
          >
            My Tickets
          </button>
          <button 
            className={`filter-btn ${filters.view === 'Unassigned' ? 'active' : ''}`}
            onClick={() => handleViewChange('Unassigned')}
          >
            Unassigned
          </button>
        </div>

        {/* Tickets Table */}
        <div className="content-card">
          <div className="card-header">
            <h2>
              Support Tickets 
              <span className="ticket-count"> ({filteredTickets.length})</span>
            </h2>
            <div className="header-actions">
              <button className="export-btn" onClick={handleExport}>
                Export
              </button>
              <button className="bulk-action-btn" onClick={handleBulkActions}>
                Bulk Actions
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
                      checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Client</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Last Update</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map(ticket => (
                  <tr key={ticket.id} className={ticket.urgent ? 'urgent-ticket' : ''}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedTickets.includes(ticket.ticketId)}
                        onChange={() => handleTicketSelect(ticket.ticketId)}
                      />
                    </td>
                    <td>{ticket.ticketId}</td>
                    <td>
                      <div className="ticket-subject">
                        {ticket.subject}
                        {ticket.urgent && <span className="urgent-badge">URGENT</span>}
                      </div>
                    </td>
                    <td>{ticket.client}</td>
                    <td>
                      <span className="type-badge" style={{ backgroundColor: getPriorityColor(ticket.type) + '20' }}>
                        {ticket.type}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="priority-badge" 
                        style={{ 
                          backgroundColor: getPriorityColor(ticket.priority) + '20',
                          color: getPriorityColor(ticket.priority),
                          borderColor: getPriorityColor(ticket.priority) + '40'
                        }}
                      >
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: getStatusColor(ticket.status) + '20',
                          color: getStatusColor(ticket.status),
                          borderColor: getStatusColor(ticket.status) + '40'
                        }}
                      >
                        {ticket.status === 'in-progress' ? 'In Progress' : 
                         ticket.status === 'waiting' ? 'Waiting Client' :
                         ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`assigned-to ${ticket.assignedTo === 'Unassigned' ? 'unassigned' : ''}`}>
                        {ticket.assignedTo}
                      </span>
                    </td>
                    <td>{ticket.lastUpdate}</td>
                    <td>
                      <div className="action-buttons">
                        {ticket.assignedTo === 'Unassigned' && (
                          <button 
                            className="icon-btn take-btn"
                            title="Take Ticket"
                            onClick={() => handleTakeTicket(ticket.ticketId)}
                          >
                            ✓
                          </button>
                        )}
                        {ticket.status === 'waiting' && (
                          <button 
                            className="icon-btn remind-btn"
                            title="Send Reminder"
                            onClick={() => handleRemindTicket(ticket.ticketId)}
                          >
                            ↻
                          </button>
                        )}
                        <button 
                          className="icon-btn message-btn"
                          title="Message Client"
                          onClick={() => handleMessageTicket(ticket.ticketId)}
                        >
                          💬
                        </button>
                        <button 
                          className="icon-btn view-btn"
                          title="View Ticket"
                          onClick={() => handleViewTicket(ticket.ticketId)}
                        >
                          👁
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupportTicketsDashboard;