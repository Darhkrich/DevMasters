
'use client';
import './billing.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Billing = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const [billingStats, setBillingStats] = useState({
    totalSpent: 1247.00,
    paidInvoices: 8,
    pendingPayments: 1,
    paymentMethods: 2
  });
  const [currentBalance, setCurrentBalance] = useState({
    amount: 399.00,
    dueDate: '5 days',
    status: 'pending'
  });
  const [invoices, setInvoices] = useState([
    { 
      id: 1, 
      invoiceNumber: 'INV-2024-0012',
      date: 'Mar 15, 2024',
      description: 'Business Website Package - Restaurant',
      amount: 399.00,
      status: 'pending',
      dueDate: '2024-03-20',
      tax: 0.00,
      items: [
        { name: 'E-commerce Package', quantity: 1, price: 399.00 }
      ]
    },
    { 
      id: 2, 
      invoiceNumber: 'INV-2024-0011',
      date: 'Feb 10, 2024',
      description: 'Essential Website Package - Portfolio',
      amount: 199.00,
      status: 'paid',
      paidDate: '2024-02-12',
      tax: 0.00,
      items: [
        { name: 'Essential Website Package', quantity: 1, price: 199.00 }
      ]
    },
    { 
      id: 3, 
      invoiceNumber: 'INV-2024-0010',
      date: 'Jan 5, 2024',
      description: 'Additional Pages - Business Site',
      amount: 149.00,
      status: 'paid',
      paidDate: '2024-01-07',
      tax: 0.00,
      items: [
        { name: 'Additional Pages (5 pages)', quantity: 1, price: 149.00 }
      ]
    },
    { 
      id: 4, 
      invoiceNumber: 'INV-2023-0009',
      date: 'Dec 12, 2023',
      description: 'E-commerce Package - Online Store',
      amount: 699.00,
      status: 'paid',
      paidDate: '2023-12-15',
      tax: 0.00,
      items: [
        { name: 'E-commerce Package', quantity: 1, price: 699.00 }
      ]
    },
    { 
      id: 5, 
      invoiceNumber: 'INV-2023-0008',
      date: 'Nov 20, 2023',
      description: 'Custom Development - Booking System',
      amount: 299.00,
      status: 'paid',
      paidDate: '2023-11-25',
      tax: 0.00,
      items: [
        { name: 'Custom Booking System', quantity: 1, price: 299.00 }
      ]
    },
    { 
      id: 6, 
      invoiceNumber: 'INV-2023-0007',
      date: 'Oct 15, 2023',
      description: 'Essential Website Package - Business',
      amount: 199.00,
      status: 'paid',
      paidDate: '2023-10-18',
      tax: 0.00,
      items: [
        { name: 'Essential Website Package', quantity: 1, price: 199.00 }
      ]
    }
  ]);
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'credit_card', last4: '4242', brand: 'visa', expires: '12/25', isDefault: true },
    { id: 2, type: 'paypal', email: 'john@example.com', isDefault: false }
  ]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

  // Calculate due date and update countdown
  useEffect(() => {
    const calculateDaysUntilDue = () => {
      const dueDate = new Date('2024-03-20');
      const today = new Date();
      const timeDiff = dueDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      setCurrentBalance(prev => ({
        ...prev,
        dueDate: daysDiff > 0 ? `${daysDiff} days` : 'Overdue'
      }));
    };

    calculateDaysUntilDue();
    const interval = setInterval(calculateDaysUntilDue, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Update pending invoice count
  useEffect(() => {
    const pendingCount = invoices.filter(invoice => invoice.status === 'pending').length;
    setBillingStats(prev => ({
      ...prev,
      pendingPayments: pendingCount
    }));
  }, [invoices]);

  // Handle menu toggle
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    console.log('Menu toggled:', !isMenuOpen);
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = () => {
    router.push('/dashboard');
  };

  // Handle pay now action
  const handlePayNow = () => {
    setShowPaymentModal(true);
    setPaymentAmount(currentBalance.amount);
    console.log('Initiating payment for:', currentBalance.amount);
  };

  // Handle payment submission
  const handlePaymentSubmit = () => {
    console.log('Processing payment of:', paymentAmount);
    
    // Simulate payment processing
    setTimeout(() => {
      // Update invoice status
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.status === 'pending' 
            ? { 
                ...invoice, 
                status: 'paid', 
                paidDate: new Date().toISOString().split('T')[0] 
              } 
            : invoice
        )
      );
      
      // Update current balance
      setCurrentBalance(prev => ({
        ...prev,
        amount: 0,
        status: 'paid'
      }));
      
      // Update billing stats
      setBillingStats(prev => ({
        ...prev,
        totalSpent: prev.totalSpent + paymentAmount,
        paidInvoices: prev.paidInvoices + 1,
        pendingPayments: 0
      }));
      
      setShowPaymentModal(false);
      setPaymentAmount(0);
      
      alert('Payment successful!');
    }, 1500);
  };

  // Handle invoice actions
  const handleInvoiceAction = (invoiceId, action) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    
    switch(action) {
      case 'view':
        setSelectedInvoice(invoice);
        setShowInvoiceModal(true);
        console.log('Viewing invoice:', invoice.invoiceNumber);
        break;
      case 'download':
        downloadInvoice(invoice);
        break;
      case 'pay':
        setPaymentAmount(invoice.amount);
        setShowPaymentModal(true);
        console.log('Paying invoice:', invoice.invoiceNumber);
        break;
      case 'receipt':
        downloadReceipt(invoice);
        break;
      default:
        break;
    }
  };

  // Download invoice as PDF
  const downloadInvoice = (invoice) => {
    console.log('Downloading invoice:', invoice.invoiceNumber);
    
    // Create invoice content
    const invoiceContent = `
      Invoice: ${invoice.invoiceNumber}
      Date: ${invoice.date}
      Description: ${invoice.description}
      Amount: $${invoice.amount.toFixed(2)}
      Status: ${invoice.status}
      
      Items:
      ${invoice.items.map(item => 
        `${item.name} - Qty: ${item.quantity} - $${item.price.toFixed(2)}`
      ).join('\n')}
      
      Total: $${invoice.amount.toFixed(2)}
      Thank you for your business!
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download receipt
  const downloadReceipt = (invoice) => {
    console.log('Downloading receipt for:', invoice.invoiceNumber);
    
    const receiptContent = `
      Receipt: ${invoice.invoiceNumber}
      Paid Date: ${invoice.paidDate}
      Description: ${invoice.description}
      Amount Paid: $${invoice.amount.toFixed(2)}
      
      Thank you for your payment!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${invoice.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle export all invoices
  const handleExportAll = () => {
    console.log('Exporting all invoices...');
    
    const exportData = {
      billingStats,
      currentBalance,
      invoices,
      paymentMethods
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billing-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Filter invoices based on status
  const filteredInvoices = () => {
    if (filterStatus === 'All Status') {
      return invoices;
    }
    
    const statusMap = {
      'Paid': 'paid',
      'Pending': 'pending',
      'Overdue': 'overdue'
    };
    
    return invoices.filter(invoice => 
      invoice.status === statusMap[filterStatus]
    );
  };

  // Paginate invoices
  const paginatedInvoices = () => {
    const filtered = filteredInvoices();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredInvoices().length / itemsPerPage);

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'paid':
        return 'status-badge paid';
      case 'pending':
        return 'status-badge pending';
      case 'overdue':
        return 'status-badge overdue';
      default:
        return 'status-badge';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch(status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'overdue':
        return 'Overdue';
      default:
        return status;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Handle support actions
  const handleSupportAction = (action) => {
    switch(action) {
      case 'invoice-help':
        console.log('Getting invoice help...');
        // Open help modal or chat
        break;
      case 'refund-request':
        console.log('Requesting refund...');
        // Open refund request form
        break;
      case 'tax-documents':
        console.log('Accessing tax documents...');
        // Open tax documents
        break;
      default:
        break;
    }
  };

  // Close modal
  const closeModal = () => {
    setShowInvoiceModal(false);
    setShowPaymentModal(false);
    setSelectedInvoice(null);
  };

  // Render pagination buttons
  const renderPagination = () => {
    const pages = [];
    
    // Previous button
    pages.push(
      <button
        key="prev"
        className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="fas fa-chevron-left"></i>
      </button>
    );
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    pages.push(
      <button
        key="next"
        className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    );
    
    return pages;
  };

  return (
    <div className="dashboard-container">
      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <button 
              className="menu-toggle" 
              id="menuToggle"
              onClick={handleMenuToggle}
            >
              <i className="fas fa-bars"></i>
            </button>
            <div className="breadcrumb">
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleBreadcrumbClick();
                }}
              >
                Dashboard
              </a>
              <i className="fas fa-chevron-right"></i>
              <span>Billing & Invoices</span>
            </div>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <button 
                className="icon-btn"
                onClick={() => {
                  setUnreadNotifications(0);
                  console.log('Notifications cleared');
                }}
                aria-label={`Notifications ${unreadNotifications > 0 ? `(${unreadNotifications} unread)` : ''}`}
              >
                <i className="fas fa-bell"></i>
                {unreadNotifications > 0 && (
                  <>
                    <span className="notification-dot"></span>
                    <span className="notification-count">{unreadNotifications}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Billing Content */}
        <div className="content-area">
          {/* Billing Overview */}
          <section className="billing-overview">
            <div className="billing-stats-grid">
              <div className="billing-stat-card">
                <div className="stat-icon primary">
                  <i className="fas fa-file-invoice"></i>
                </div>
                <div className="stat-info">
                  <h3>{formatCurrency(billingStats.totalSpent)}</h3>
                  <p>Total Spent</p>
                </div>
              </div>
              <div className="billing-stat-card">
                <div className="stat-icon success">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-info">
                  <h3>{billingStats.paidInvoices}</h3>
                  <p>Paid Invoices</p>
                </div>
              </div>
              <div className="billing-stat-card">
                <div className="stat-icon warning">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-info">
                  <h3>{billingStats.pendingPayments}</h3>
                  <p>Pending Payment</p>
                </div>
              </div>
              <div className="billing-stat-card">
                <div className="stat-icon info">
                  <i className="fas fa-credit-card"></i>
                </div>
                <div className="stat-info">
                  <h3>{billingStats.paymentMethods}</h3>
                  <p>Payment Methods</p>
                </div>
              </div>
            </div>
          </section>

          {/* Current Balance & Actions */}
          <section className="card">
            <div className="card-header">
              <h3>Current Balance</h3>
              <span className={`balance-status ${currentBalance.status} ${currentBalance.dueDate === 'Overdue' ? 'overdue' : ''}`}>
                {currentBalance.status === 'pending' ? `Due in ${currentBalance.dueDate}` : 'Paid'}
              </span>
            </div>
            <div className="card-body">
              <div className="balance-section">
                <div className="balance-amount">
                  <span className="amount">{formatCurrency(currentBalance.amount)}</span>
                  {currentBalance.status === 'pending' && (
                    <span className={`balance-status due ${currentBalance.dueDate === 'Overdue' ? 'overdue' : ''}`}>
                      {currentBalance.dueDate === 'Overdue' ? 'OVERDUE' : `Due in ${currentBalance.dueDate}`}
                    </span>
                  )}
                </div>
                <div className="balance-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={handlePayNow}
                    disabled={currentBalance.amount === 0}
                  >
                    <i className="fas fa-credit-card"></i>
                    {currentBalance.amount === 0 ? 'Paid' : 'Pay Now'}
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => {
                      const pendingInvoice = invoices.find(inv => inv.status === 'pending');
                      if (pendingInvoice) {
                        downloadInvoice(pendingInvoice);
                      }
                    }}
                    disabled={currentBalance.amount === 0}
                  >
                    <i className="fas fa-download"></i>
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Invoice History */}
          <section className="card">
            <div className="card-header">
              <h3>Invoice History</h3>
              <div className="header-actions">
                <div className="filter-dropdown">
                  <select 
                    className="filter-select"
                    value={filterStatus}
                    onChange={(e) => handleFilterChange(e.target.value)}
                  >
                    <option>All Status</option>
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Overdue</option>
                  </select>
                </div>
                <button 
                  className="btn btn-outline"
                  onClick={handleExportAll}
                >
                  <i className="fas fa-download"></i>
                  Export All
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedInvoices().map((invoice) => (
                      <tr key={invoice.id}>
                        <td>
                          <strong>{invoice.invoiceNumber}</strong>
                        </td>
                        <td>{invoice.date}</td>
                        <td>{invoice.description}</td>
                        <td>{formatCurrency(invoice.amount)}</td>
                        <td>
                          <span className={getStatusBadgeClass(invoice.status)}>
                            {getStatusText(invoice.status)}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="icon-btn small"
                              onClick={() => handleInvoiceAction(invoice.id, 'view')}
                              title="View Invoice"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button 
                              className="icon-btn small"
                              onClick={() => handleInvoiceAction(invoice.id, 'download')}
                              title="Download Invoice"
                            >
                              <i className="fas fa-download"></i>
                            </button>
                            {invoice.status === 'pending' ? (
                              <button 
                                className="icon-btn small"
                                onClick={() => handleInvoiceAction(invoice.id, 'pay')}
                                title="Pay Invoice"
                              >
                                <i className="fas fa-credit-card"></i>
                              </button>
                            ) : (
                              <button 
                                className="icon-btn small"
                                onClick={() => handleInvoiceAction(invoice.id, 'receipt')}
                                title="Download Receipt"
                              >
                                <i className="fas fa-receipt"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  {renderPagination()}
                </div>
              )}
            </div>
          </section>

          {/* Billing Support */}
          <section className="card">
            <div className="card-header">
              <h3>Billing Support</h3>
            </div>
            <div className="card-body">
              <div className="support-options-grid">
                <div className="support-option">
                  <i className="fas fa-file-invoice-dollar"></i>
                  <h4>Invoice Questions</h4>
                  <p>Have questions about your invoice or need clarification?</p>
                  <button 
                    className="btn btn-outline"
                    onClick={() => handleSupportAction('invoice-help')}
                  >
                    Get Help
                  </button>
                </div>
                <div className="support-option">
                  <i className="fas fa-exchange-alt"></i>
                  <h4>Refund Request</h4>
                  <p>Request a refund for services according to our policy</p>
                  <button 
                    className="btn btn-outline"
                    onClick={() => handleSupportAction('refund-request')}
                  >
                    Request Refund
                  </button>
                </div>
                <div className="support-option">
                  <i className="fas fa-receipt"></i>
                  <h4>Tax Documents</h4>
                  <p>Access your tax receipts and financial documents</p>
                  <button 
                    className="btn btn-outline"
                    onClick={() => handleSupportAction('tax-documents')}
                  >
                    View Documents
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Invoice Details: {selectedInvoice.invoiceNumber}</h3>
              <button className="modal-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="invoice-details">
                <div className="detail-row">
                  <span className="detail-label">Invoice Date:</span>
                  <span className="detail-value">{selectedInvoice.date}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{selectedInvoice.description}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Amount:</span>
                  <span className="detail-value">{formatCurrency(selectedInvoice.amount)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`detail-value ${selectedInvoice.status}`}>
                    {getStatusText(selectedInvoice.status)}
                  </span>
                </div>
                {selectedInvoice.paidDate && (
                  <div className="detail-row">
                    <span className="detail-label">Paid Date:</span>
                    <span className="detail-value">{selectedInvoice.paidDate}</span>
                  </div>
                )}
                <div className="items-section">
                  <h4>Items</h4>
                  {selectedInvoice.items.map((item, index) => (
                    <div key={index} className="item-row">
                      <span>{item.name}</span>
                      <span>{item.quantity} × {formatCurrency(item.price)}</span>
                      <span>{formatCurrency(item.quantity * item.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="total-section">
                  <span>Total</span>
                  <span>{formatCurrency(selectedInvoice.amount)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={closeModal}>
                Close
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  downloadInvoice(selectedInvoice);
                  closeModal();
                }}
              >
                <i className="fas fa-download"></i>
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Make Payment</h3>
              <button className="modal-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="payment-details">
                <div className="payment-amount">
                  <span>Amount to Pay:</span>
                  <span className="amount">{formatCurrency(paymentAmount)}</span>
                </div>
                <div className="payment-methods">
                  <h4>Payment Methods</h4>
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="payment-method">
                      <input 
                        type="radio" 
                        id={`method-${method.id}`}
                        name="paymentMethod"
                        defaultChecked={method.isDefault}
                      />
                      <label htmlFor={`method-${method.id}`}>
                        {method.type === 'credit_card' ? (
                          <>
                            <i className="fab fa-cc-visa"></i>
                            <span>•••• {method.last4} - Expires {method.expires}</span>
                          </>
                        ) : (
                          <>
                            <i className="fab fa-paypal"></i>
                            <span>PayPal - {method.email}</span>
                          </>
                        )}
                        {method.isDefault && <span className="default-badge">Default</span>}
                      </label>
                    </div>
                  ))}
                  <button className="btn-text add-method">
                    <i className="fas fa-plus"></i>
                    Add New Payment Method
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={closeModal}>
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handlePaymentSubmit}
              >
                <i className="fas fa-credit-card"></i>
                Pay {formatCurrency(paymentAmount)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;