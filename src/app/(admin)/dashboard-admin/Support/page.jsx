'use client';

import { useState } from 'react';
import './styles.css';

const SupportDashboard = () => {
  const [urgentTickets, setUrgentTickets] = useState([
    {
      id: 1,
      ticketId: 'TKT-1024',
      title: 'Website Down',
      priority: 'critical',
      client: 'Sarah Smith',
      issue: 'Entire website showing error 500',
      opened: '25 minutes ago',
      status: 'open'
    },
    {
      id: 2,
      ticketId: 'TKT-1021',
      title: 'Payment Issue',
      priority: 'high',
      client: 'Mike Johnson',
      issue: 'Customers can\'t complete purchases',
      opened: '1 hour ago',
      status: 'open'
    }
  ]);

  const [assignedTickets, setAssignedTickets] = useState([
    {
      id: 1,
      ticketId: 'TKT-1015',
      title: 'Mobile Display',
      status: 'in-progress',
      client: 'Emily Davis',
      issue: 'Menu not displaying properly on mobile',
      lastUpdated: '2 hours ago',
      clientWaiting: '4 hours',
      actionNeeded: 'update'
    },
    {
      id: 2,
      ticketId: 'TKT-1018',
      title: 'SEO Questions',
      status: 'pending',
      client: 'Robert Brown',
      issue: 'Questions about SEO settings and meta tags',
      lastUpdated: 'Waiting for client: 1 day',
      followupNeeded: true,
      actionNeeded: 'remind'
    }
  ]);

  const [clientMessages, setClientMessages] = useState([
    {
      id: 1,
      sender: 'Sarah Smith',
      time: '15 min ago',
      preview: 'The website is still down, this is affecting our business...',
      ticket: 'TKT-1024',
      unread: true
    },
    {
      id: 2,
      sender: 'Mike Johnson',
      time: '1 hour ago',
      preview: 'Thanks for looking into the payment issue. Any updates?',
      ticket: 'TKT-1021',
      unread: false
    },
    {
      id: 3,
      sender: 'New Client',
      time: '2 hours ago',
      preview: 'I have questions about your website builder packages',
      type: 'New Inquiry',
      unread: false
    }
  ]);

  const [supportStats, setSupportStats] = useState({
    openTickets: 15,
    urgentTickets: 3,
    resolvedToday: 8,
    avgResponseTime: '12m',
    satisfactionScore: '4.8/5',
    satisfactionPercent: '94%'
  });

  const handleTakeTicket = (ticketId) => {
    const ticket = urgentTickets.find(t => t.ticketId === ticketId);
    if (ticket) {
      // Move ticket from urgent to assigned
      setUrgentTickets(urgentTickets.filter(t => t.ticketId !== ticketId));
      setAssignedTickets([
        ...assignedTickets,
        {
          ...ticket,
          status: 'in-progress',
          lastUpdated: 'Just now',
          clientWaiting: 'Just assigned'
        }
      ]);
      alert(`You have taken ticket ${ticketId}`);
    }
  };

  const handleEscalateTicket = (ticketId) => {
    alert(`Ticket ${ticketId} escalated to supervisor`);
    // In real app, you would update backend
  };

  const handleResolveTicket = (ticketId) => {
    setAssignedTickets(assignedTickets.filter(t => t.ticketId !== ticketId));
    setSupportStats(prev => ({
      ...prev,
      resolvedToday: prev.resolvedToday + 1,
      openTickets: prev.openTickets - 1
    }));
    alert(`Ticket ${ticketId} marked as resolved`);
  };

  const handleSendReminder = (ticketId) => {
    alert(`Reminder sent for ticket ${ticketId}`);
    // In real app, you would send email/notification
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'new-ticket':
        alert('Creating new ticket...');
        break;
      case 'call-client':
        alert('Starting call...');
        break;
      case 'quick-response':
        alert('Opening quick response template...');
        break;
      case 'knowledge-base':
        alert('Opening knowledge base...');
        break;
      case 'search-solutions':
        alert('Opening solution search...');
        break;
      case 'reports':
        alert('Opening reports dashboard...');
        break;
      default:
        break;
    }
  };

  const handleViewGuide = (guide) => {
    alert(`Opening guide: ${guide}`);
  };

  const handleViewAll = (section) => {
    alert(`Viewing all ${section}...`);
  };

  const markMessageAsRead = (messageId) => {
    setClientMessages(clientMessages.map(msg => 
      msg.id === messageId ? { ...msg, unread: false } : msg
    ));
  };

  return (
    <div className="admin-container">
      <main className="main-content">
        {/* Support Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Support Dashboard</h1>
            <p className="welcome-text">Welcome back, Alex Support! Ready to help clients?</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <img 
                src="https://ui-avatars.com/api/?name=Alex+Support&background=9b59b6&color=fff" 
                alt="Alex Support" 
              />
              <div>
                <span>Alex Support</span>
                <small>Support Specialist</small>
              </div>
            </div>
          </div>
        </header>

        {/* Support Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <span>🎫</span>
            </div>
            <div className="stat-info">
              <h3>{supportStats.openTickets}</h3>
              <p>Open Tickets</p>
              <span className="stat-trend">
                {supportStats.urgentTickets} urgent
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <span>✅</span>
            </div>
            <div className="stat-info">
              <h3>{supportStats.resolvedToday}</h3>
              <p>Resolved Today</p>
              <span className="stat-trend positive">Good pace</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <span>⏱</span>
            </div>
            <div className="stat-info">
              <h3>{supportStats.avgResponseTime}</h3>
              <p>Avg. Response Time</p>
              <span className="stat-trend positive">Excellent</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <span>⭐</span>
            </div>
            <div className="stat-info">
              <h3>{supportStats.satisfactionScore}</h3>
              <p>Client Satisfaction</p>
              <span className="stat-trend positive">
                {supportStats.satisfactionPercent} positive
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Urgent Tickets */}
          <div className="content-card">
            <div className="card-header">
              <h2>Urgent Tickets</h2>
              <button 
                className="view-all-btn" 
                onClick={() => handleViewAll('urgent tickets')}
              >
                View All →
              </button>
            </div>
            <div className="tickets-list">
              {urgentTickets.map(ticket => (
                <div key={ticket.id} className={`ticket-item ${ticket.priority}`}>
                  <div className="ticket-header">
                    <h3>#{ticket.ticketId} - {ticket.title}</h3>
                    <span className={`ticket-priority ${ticket.priority}`}>
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </span>
                  </div>
                  <div className="ticket-details">
                    <p><strong>Client:</strong> {ticket.client}</p>
                    <p><strong>Issue:</strong> {ticket.issue}</p>
                    <p><strong>Opened:</strong> {ticket.opened}</p>
                  </div>
                  <div className="ticket-actions">
                    <button 
                      className="action-btn take-btn"
                      onClick={() => handleTakeTicket(ticket.ticketId)}
                    >
                      Take Ticket
                    </button>
                    <button 
                      className="action-btn escalate-btn"
                      onClick={() => handleEscalateTicket(ticket.ticketId)}
                    >
                      Escalate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Assigned Tickets */}
          <div className="content-card">
            <div className="card-header">
              <h2>My Assigned Tickets</h2>
              <button 
                className="view-all-btn" 
                onClick={() => handleViewAll('assigned tickets')}
              >
                View All →
              </button>
            </div>
            <div className="assigned-tickets">
              {assignedTickets.map(ticket => (
                <div key={ticket.id} className="ticket-item assigned">
                  <div className="ticket-header">
                    <h3>#{ticket.ticketId} - {ticket.title}</h3>
                    <span className={`ticket-status ${ticket.status}`}>
                      {ticket.status === 'in-progress' ? 'In Progress' : 
                       ticket.status === 'pending' ? 'Pending Client' : ticket.status}
                    </span>
                  </div>
                  <div className="ticket-details">
                    <p><strong>Client:</strong> {ticket.client}</p>
                    <p>{ticket.issue}</p>
                    <div className="ticket-meta">
                      <span className="ticket-time">Last updated: {ticket.lastUpdated}</span>
                      {ticket.clientWaiting && (
                        <span className="ticket-client-waiting">
                          Client waiting: {ticket.clientWaiting}
                        </span>
                      )}
                      {ticket.followupNeeded && (
                        <span className="ticket-followup">Follow up needed</span>
                      )}
                    </div>
                  </div>
                  <div className="ticket-actions">
                    {ticket.actionNeeded === 'update' && (
                      <>
                        <button className="action-btn update-btn">Update</button>
                        <button 
                          className="action-btn resolve-btn"
                          onClick={() => handleResolveTicket(ticket.ticketId)}
                        >
                          Resolve
                        </button>
                      </>
                    )}
                    {ticket.actionNeeded === 'remind' && (
                      <>
                        <button 
                          className="action-btn remind-btn"
                          onClick={() => handleSendReminder(ticket.ticketId)}
                        >
                          Send Reminder
                        </button>
                        <button className="action-btn close-btn">Close</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="content-card">
            <div className="card-header">
              <h2>Support Tools</h2>
            </div>
            <div className="quick-actions-grid">
              <button 
                className="quick-action-btn"
                onClick={() => handleQuickAction('new-ticket')}
              >
                <span>🎫</span>
                New Ticket
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => handleQuickAction('call-client')}
              >
                <span>📞</span>
                Call Client
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => handleQuickAction('quick-response')}
              >
                <span>💬</span>
                Quick Response
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => handleQuickAction('knowledge-base')}
              >
                <span>📚</span>
                Knowledge Base
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => handleQuickAction('search-solutions')}
              >
                <span>🔍</span>
                Search Solutions
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => handleQuickAction('reports')}
              >
                <span>📊</span>
                Reports
              </button>
            </div>
          </div>

          {/* Client Messages */}
          <div className="content-card">
            <div className="card-header">
              <h2>Recent Client Messages</h2>
              <button 
                className="view-all-btn" 
                onClick={() => handleViewAll('client messages')}
              >
                View All →
              </button>
            </div>
            <div className="client-messages">
              {clientMessages.map(message => (
                <div 
                  key={message.id} 
                  className={`message-item ${message.unread ? 'unread' : ''}`}
                  onClick={() => markMessageAsRead(message.id)}
                >
                  <div className="message-sender">
                    <strong>{message.sender}</strong>
                    <span className="message-time">{message.time}</span>
                  </div>
                  <p className="message-preview">{message.preview}</p>
                  {message.ticket ? (
                    <span className="message-ticket">#{message.ticket}</span>
                  ) : (
                    <span className="message-type">{message.type}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Knowledge Base Quick Access */}
        <div className="content-card">
          <div className="card-header">
            <h2>Quick Solutions</h2>
          </div>
          <div className="solutions-grid">
            <div className="solution-item">
              <h4>🚀 Website Performance</h4>
              <p>Common performance issues and solutions</p>
              <button 
                className="solution-btn"
                onClick={() => handleViewGuide('Website Performance')}
              >
                View Guide
              </button>
            </div>
            <div className="solution-item">
              <h4>💳 Payment Gateway</h4>
              <p>Troubleshooting payment processing</p>
              <button 
                className="solution-btn"
                onClick={() => handleViewGuide('Payment Gateway')}
              >
                View Guide
              </button>
            </div>
            <div className="solution-item">
              <h4>📱 Mobile Issues</h4>
              <p>Fixing mobile display problems</p>
              <button 
                className="solution-btn"
                onClick={() => handleViewGuide('Mobile Issues')}
              >
                View Guide
              </button>
            </div>
            <div className="solution-item">
              <h4>🔧 Technical Support</h4>
              <p>Advanced technical troubleshooting</p>
              <button 
                className="solution-btn"
                onClick={() => handleViewGuide('Technical Support')}
              >
                View Guide
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupportDashboard;