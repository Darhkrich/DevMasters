'use client';
import './order.css';


import { useState, useEffect } from 'react';

const OrdersManagementPage = () => {
  // State for orders data
  const [orders, setOrders] = useState([
    {
      id: 102,
      orderId: '#102',
      client: 'Sarah Smith',
      clientEmail: 'sarah@email.com',
      template: 'Ecommerce Basic',
      package: 'E-commerce',
      amount: '$499',
      status: 'pending',
      assignedTo: 'John Designer',
      deadline: '2024-01-20',
      urgent: true,
    },
    {
      id: 101,
      orderId: '#101',
      client: 'John Doe',
      clientEmail: 'john@email.com',
      template: 'Business Pro',
      package: 'Business',
      amount: '$299',
      status: 'in-progress',
      assignedTo: 'Mike Developer',
      deadline: '2024-01-25',
      urgent: false,
    },
    {
      id: 105,
      orderId: '#105',
      client: 'Robert Brown',
      clientEmail: 'robert@email.com',
      template: 'Medical Pro',
      package: 'E-commerce',
      amount: '$499',
      status: 'pending',
      assignedTo: '-',
      deadline: '2024-02-01',
      urgent: false,
    },
    {
      id: 103,
      orderId: '#103',
      client: 'Mike Johnson',
      clientEmail: 'mike@email.com',
      template: 'Portfolio Modern',
      package: 'Essential',
      amount: '$199',
      status: 'completed',
      assignedTo: 'Sarah Designer',
      deadline: '2024-01-18',
      urgent: false,
    },
  ]);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [packageFilter, setPackageFilter] = useState('All Packages');
  const [dateFilter, setDateFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Orders');
  const [searchQuery, setSearchQuery] = useState('');

  // Checkbox states
  const [selectAll, setSelectAll] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Filtered orders
  const [filteredOrders, setFilteredOrders] = useState(orders);

  // Handle filter changes
  useEffect(() => {
    let result = [...orders];

    // Search filter
    if (searchQuery) {
      result = result.filter(order =>
        order.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.clientEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All Status') {
      result = result.filter(order => {
        switch (statusFilter) {
          case 'Pending Payment':
            return order.status === 'pending';
          case 'Payment Verified':
            return order.status === 'verified';
          case 'In Progress':
            return order.status === 'in-progress';
          case 'Awaiting Feedback':
            return order.status === 'awaiting-feedback';
          case 'Completed':
            return order.status === 'completed';
          default:
            return true;
        }
      });
    }

    // Package filter
    if (packageFilter !== 'All Packages') {
      result = result.filter(order => order.package === packageFilter);
    }

    // Date filter
    if (dateFilter) {
      result = result.filter(order => order.deadline === dateFilter);
    }

    // Quick filters
    switch (activeFilter) {
      case 'Urgent':
        result = result.filter(order => order.urgent);
        break;
      case 'This Week':
        // Filter for this week's orders (simplified)
        result = result.filter(order => {
          const deadline = new Date(order.deadline);
          const now = new Date();
          const oneWeek = 7 * 24 * 60 * 60 * 1000;
          return deadline - now <= oneWeek && deadline > now;
        });
        break;
      default:
        break;
    }

    setFilteredOrders(result);
  }, [orders, statusFilter, packageFilter, dateFilter, activeFilter, searchQuery]);

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual checkbox
  const handleCheckboxChange = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle view action
  const handleViewOrder = (orderId) => {
    console.log(`Viewing order ${orderId}`);
    alert(`Opening details for order ${orderId}`);
  };

  // Handle edit action
  const handleEditOrder = (orderId) => {
    console.log(`Editing order ${orderId}`);
    alert(`Opening edit form for order ${orderId}`);
  };

  // Handle message action
  const handleMessageOrder = (orderId) => {
    console.log(`Messaging about order ${orderId}`);
    alert(`Opening chat for order ${orderId}`);
  };

  // Handle export CSV
  const handleExportCSV = () => {
    console.log('Exporting CSV...');
    // In a real app, this would generate and download a CSV file
    setTimeout(() => {
      alert('CSV file exported successfully!');
    }, 1000);
  };

  // Handle new order
  const handleNewOrder = () => {
    console.log('Creating new order');
    alert('Opening new order form');
  };

  // Handle pagination
  const handlePageChange = (page) => {
    console.log(`Navigating to page ${page}`);
    // In a real app, this would fetch data for the selected page
  };

  // Get status badge info
  const getStatusInfo = (status) => {
    switch (status) {
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

  // Get package badge info
  const getPackageInfo = (pkg) => {
    switch (pkg) {
      case 'Essential':
        return { className: 'package-badge essential', text: 'Essential' };
      case 'Business':
        return { className: 'package-badge business', text: 'Business' };
      case 'E-commerce':
        return { className: 'package-badge ecommerce', text: 'E-commerce' };
      default:
        return { className: 'package-badge', text: pkg };
    }
  };

  return (
    <div className="admin-container">
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Orders Management</h1>
            <p className="welcome-text">Manage all client orders and track their progress</p>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={searchQuery}
                onChange={handleSearch}
              />
              <button>🔍</button>
            </div>
            <div className="user-info">
              <img 
                src="https://ui-avatars.com/api/?name=Admin+User&background=007bff&color=fff" 
                alt="Admin User" 
              />
              <span>Admin User</span>
            </div>
          </div>
        </header>

        {/* Orders Filters */}
        <div className="filters-bar">
          <div className="filter-group">
            <label>Status:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Pending Payment</option>
              <option>Payment Verified</option>
              <option>In Progress</option>
              <option>Awaiting Feedback</option>
              <option>Completed</option>
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
            <label>Date:</label>
            <input 
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          
          <button 
            className={`filter-btn ${activeFilter === 'All Orders' ? 'active' : ''}`}
            onClick={() => setActiveFilter('All Orders')}
          >
            All Orders
          </button>
          
          <button 
            className={`filter-btn ${activeFilter === 'Urgent' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Urgent')}
          >
            Urgent
          </button>
          
          <button 
            className={`filter-btn ${activeFilter === 'This Week' ? 'active' : ''}`}
            onClick={() => setActiveFilter('This Week')}
          >
            This Week
          </button>
        </div>

        {/* Orders Table */}
        <div className="content-card">
          <div className="card-header">
            <h2>All Orders ({filteredOrders.length})</h2>
            <div className="header-actions">
              <button className="export-btn" onClick={handleExportCSV}>
                Export CSV
              </button>
              <button className="primary-btn" onClick={handleNewOrder}>
                + New Order
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
                  <th>Order ID</th>
                  <th>Client</th>
                  <th>Template</th>
                  <th>Package</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const packageInfo = getPackageInfo(order.package);
                  
                  return (
                    <tr 
                      key={order.id} 
                      className={order.urgent ? 'urgent-order' : ''}
                    >
                      <td>
                        <input 
                          type="checkbox" 
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleCheckboxChange(order.id)}
                        />
                      </td>
                      <td>
                        <a 
                          href="#" 
                          className="order-link"
                          onClick={(e) => {
                            e.preventDefault();
                            handleViewOrder(order.orderId);
                          }}
                        >
                          {order.orderId}
                        </a>
                      </td>
                      <td>
                        <div className="client-info">
                          <strong>{order.client}</strong>
                          <small>{order.clientEmail}</small>
                        </div>
                      </td>
                      <td>{order.template}</td>
                      <td>
                        <span className={packageInfo.className}>
                          {packageInfo.text}
                        </span>
                      </td>
                      <td>{order.amount}</td>
                      <td>
                        <span className={statusInfo.className}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td>{order.assignedTo}</td>
                      <td>{order.deadline}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="icon-btn" 
                            title="View"
                            onClick={() => handleViewOrder(order.orderId)}
                          >
                            👁
                          </button>
                          <button 
                            className="icon-btn" 
                            title="Edit"
                            onClick={() => handleEditOrder(order.orderId)}
                          >
                            ✏
                          </button>
                          <button 
                            className="icon-btn" 
                            title="Message"
                            onClick={() => handleMessageOrder(order.orderId)}
                          >
                            💬
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>
                      <div className="no-orders">
                        <div className="no-orders-icon">📦</div>
                        <p>No orders found matching your filters</p>
                        <button 
                          className="clear-filters-btn"
                          onClick={() => {
                            setStatusFilter('All Status');
                            setPackageFilter('All Packages');
                            setDateFilter('');
                            setActiveFilter('All Orders');
                            setSearchQuery('');
                          }}
                        >
                          Clear Filters
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
            <button className="page-btn" onClick={() => handlePageChange('previous')}>
              ← Previous
            </button>
            <button className="page-btn active" onClick={() => handlePageChange(1)}>
              1
            </button>
            <button className="page-btn" onClick={() => handlePageChange(2)}>
              2
            </button>
            <button className="page-btn" onClick={() => handlePageChange(3)}>
              3
            </button>
            <span>...</span>
            <button className="page-btn" onClick={() => handlePageChange(10)}>
              10
            </button>
            <button className="page-btn" onClick={() => handlePageChange('next')}>
              Next →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrdersManagementPage;