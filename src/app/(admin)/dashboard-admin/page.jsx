
'use client';
import './dashboard.css';


import { useState, useEffect } from 'react';

const DashboardPage = () => {
  // State for dashboard data
  const [stats, setStats] = useState({
    totalOrders: 24,
    monthlyRevenue: 4850,
    pendingActions: 8,
    activeProjects: 12,
  });

  // Recent orders data
  const [recentOrders, setRecentOrders] = useState([
    {
      id: 101,
      orderId: '#101',
      client: 'John Doe',
      clientEmail: 'john@example.com',
      template: 'Business Pro',
      package: 'Business',
      status: 'in-progress',
      date: '2024-01-15',
      amount: '$499',
    },
    {
      id: 102,
      orderId: '#102',
      client: 'Sarah Smith',
      clientEmail: 'sarah@example.com',
      template: 'Ecommerce Basic',
      package: 'E-commerce',
      status: 'pending',
      date: '2024-01-14',
      amount: '$799',
    },
    {
      id: 103,
      orderId: '#103',
      client: 'Mike Johnson',
      clientEmail: 'mike@example.com',
      template: 'Portfolio Modern',
      package: 'Essential',
      status: 'completed',
      date: '2024-01-13',
      amount: '$299',
    },
    {
      id: 104,
      orderId: '#104',
      client: 'Emily Davis',
      clientEmail: 'emily@example.com',
      template: 'Restaurant Elite',
      package: 'Business',
      status: 'in-progress',
      date: '2024-01-12',
      amount: '$599',
    },
    {
      id: 105,
      orderId: '#105',
      client: 'Robert Brown',
      clientEmail: 'robert@example.com',
      template: 'Medical Pro',
      package: 'E-commerce',
      status: 'pending',
      date: '2024-01-11',
      amount: '$899',
    },
  ]);

  // Pending actions data
  const [pendingActions, setPendingActions] = useState([
    {
      id: 1,
      title: 'Client Feedback Needed',
      description: 'Order #102 - Sarah Smith has been waiting for 2 days',
      icon: '💬',
      time: '2 days ago',
      priority: 'urgent',
      orderId: 102,
    },
    {
      id: 2,
      title: 'Payment Verification',
      description: 'Order #105 - Bank transfer needs confirmation',
      icon: '💰',
      time: '1 day ago',
      priority: 'urgent',
      orderId: 105,
    },
    {
      id: 3,
      title: 'Requirements Review',
      description: 'Order #107 - New order needs requirement analysis',
      icon: '📋',
      time: '5 hours ago',
      priority: 'normal',
      orderId: 107,
    },
    {
      id: 4,
      title: 'Design Approval',
      description: 'Order #99 - Waiting for client design approval',
      icon: '🎨',
      time: '3 hours ago',
      priority: 'normal',
      orderId: 99,
    },
  ]);

  // Quick actions
  const [quickActions] = useState([
    { id: 1, label: 'Add New Template', icon: '➕' },
    { id: 2, label: 'Manage Team', icon: '👥' },
    { id: 3, label: 'Generate Report', icon: '📊' },
    { id: 4, label: 'System Settings', icon: '⚙' },
  ]);

  // Current time for welcome message
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState('');

  // Initialize time and greeting
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const hours = now.getHours();
      
      let timeGreeting = 'Welcome back';
      if (hours < 12) timeGreeting = 'Good morning';
      else if (hours < 18) timeGreeting = 'Good afternoon';
      else timeGreeting = 'Good evening';
      
      setCurrentTime(timeString);
      setGreeting(timeGreeting);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Handle action button click
  const handleActionClick = (actionId, orderId) => {
    console.log(`Handling action ${actionId} for order ${orderId}`);
    
    // Remove the action from pending list
    setPendingActions(prev => prev.filter(action => action.id !== actionId));
    
    // Update pending actions count
    setStats(prev => ({
      ...prev,
      pendingActions: prev.pendingActions - 1
    }));
    
    // Show success message
    alert(`Action completed for Order #${orderId}`);
  };

  // Handle view all orders
  const handleViewAllOrders = () => {
    console.log('Navigating to all orders');
    // In a real app, this would navigate to orders page
    alert('Navigating to Orders page');
  };

  // Handle view all actions
  const handleViewAllActions = () => {
    console.log('Navigating to all actions');
    // In a real app, this would navigate to actions page
    alert('Navigating to Pending Actions page');
  };

  // Handle quick action click
  const handleQuickAction = (actionId) => {
    const action = quickActions.find(a => a.id === actionId);
    console.log(`Quick action: ${action?.label}`);
    
    switch(actionId) {
      case 1:
        alert('Opening Template Creator');
        break;
      case 2:
        alert('Opening Team Management');
        break;
      case 3:
        alert('Generating Report...');
        // Simulate report generation
        setTimeout(() => {
          alert('Report generated successfully!');
        }, 1000);
        break;
      case 4:
        alert('Opening System Settings');
        break;
      default:
        break;
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

  // Get status badge class and text
  const getStatusInfo = (status) => {
    switch(status) {
      case 'completed':
        return { className: 'status-badge status-completed', text: 'Completed' };
      case 'in-progress':
        return { className: 'status-badge status-in-progress', text: 'In Progress' };
      case 'pending':
        return { className: 'status-badge status-pending', text: 'Awaiting Feedback' };
      default:
        return { className: 'status-badge', text: status };
    }
  };

  // Sort orders by date (newest first)
  const sortedOrders = [...recentOrders].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="dashboard-container">
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Dashboard Overview</h1>
            <p className="welcome-text">
              {greeting}, Admin! {currentTime && `It's ${currentTime}`} Here`s what`s happening today.
            </p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <img 
                src="https://ui-avatars.com/api/?name=Admin+User&background=007bff&color=fff" 
                alt="Admin User"
                className="user-avatar"
              />
              <div className="user-details">
                <span className="user-name">Admin User</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e3f2fd' }}>
              <span>📦</span>
            </div>
            <div className="stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
              <span className="stat-trend positive">+12% this week</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e8f5e9' }}>
              <span>💰</span>
            </div>
            <div className="stat-info">
              <h3>{formatCurrency(stats.monthlyRevenue)}</h3>
              <p>Monthly Revenue</p>
              <span className="stat-trend positive">+8% this month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fff3e0' }}>
              <span>⏰</span>
            </div>
            <div className="stat-info">
              <h3>{stats.pendingActions}</h3>
              <p>Pending Actions</p>
              <span className={`stat-trend ${stats.pendingActions > 5 ? 'negative' : ''}`}>
                {stats.pendingActions > 5 ? 'Attention needed' : 'Under control'}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#f3e5f5' }}>
              <span>🚀</span>
            </div>
            <div className="stat-info">
              <h3>{stats.activeProjects}</h3>
              <p>Active Projects</p>
              <span className="stat-trend">In progress</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Recent Orders Section */}
          <div className="content-card">
            <div className="card-header">
              <h2>Recent Orders</h2>
              <button 
                className="view-all-btn" 
                onClick={handleViewAllOrders}
              >
                View All →
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Client</th>
                    <th>Template</th>
                    <th>Package</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    return (
                      <tr key={order.id}>
                        <td>
                          <a 
                            href="#" 
                            className="order-link"
                            onClick={(e) => {
                              e.preventDefault();
                              alert(`Viewing details for ${order.orderId}`);
                            }}
                          >
                            {order.orderId}
                          </a>
                        </td>
                        <td>
                          <div className="client-cell">
                            <span className="client-name">{order.client}</span>
                            <span className="client-email">{order.clientEmail}</span>
                          </div>
                        </td>
                        <td>{order.template}</td>
                        <td>
                          <span className={`package-badge package-${order.package.toLowerCase()}`}>
                            {order.package}
                          </span>
                        </td>
                        <td>
                          <span className={statusInfo.className}>
                            {statusInfo.text}
                          </span>
                        </td>
                        <td>{order.date}</td>
                        <td>
                          <button 
                            className="table-action-btn"
                            onClick={() => alert(`Quick actions for ${order.orderId}`)}
                          >
                            ⋮
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Actions Section */}
          <div className="content-card">
            <div className="card-header">
              <h2>Pending Actions ({pendingActions.length})</h2>
              <button 
                className="view-all-btn" 
                onClick={handleViewAllActions}
              >
                View All →
              </button>
            </div>
            <div className="actions-list">
              {pendingActions.map((action) => (
                <div 
                  key={action.id} 
                  className={`action-item ${action.priority}`}
                >
                  <div className="action-icon">{action.icon}</div>
                  <div className="action-details">
                    <h4>{action.title}</h4>
                    <p>{action.description}</p>
                    <span className="action-time">{action.time}</span>
                  </div>
                  <button 
                    className="action-btn"
                    onClick={() => handleActionClick(action.id, action.orderId)}
                  >
                    {action.icon === '💬' ? 'Review' : 
                     action.icon === '💰' ? 'Verify' : 
                     action.icon === '📋' ? 'Review' : 'Check'}
                  </button>
                </div>
              ))}
              
              {pendingActions.length === 0 && (
                <div className="no-actions">
                  <div className="no-actions-icon">🎉</div>
                  <p>All caught up! No pending actions.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            {quickActions.map((action) => (
              <button 
                key={action.id}
                className="quick-btn"
                onClick={() => handleQuickAction(action.id)}
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;