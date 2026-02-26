'use client';
import './styles.css';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const Support = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [supportStats, setSupportStats] = useState({
    avgResponseTime: '15 min',
    satisfactionRate: '98%',
    openTickets: 2,
    supportAvailable: '24/7'
  });
  const [supportStatus, setSupportStatus] = useState({
    online: true,
    status: 'Support Online'
  });
  const [systemStatus, setSystemStatus] = useState([
    { id: 1, service: 'Website Builder', status: 'operational', updated: '5 minutes ago' },
    { id: 2, service: 'File Upload', status: 'operational', updated: '10 minutes ago' },
    { id: 3, service: 'Payment System', status: 'maintenance', updated: '1 hour ago' },
    { id: 4, service: 'Messaging', status: 'operational', updated: '15 minutes ago' }
  ]);
  const [tickets, setTickets] = useState([
    { 
      id: 1, 
      ticketId: 'TKT-2024-0012',
      subject: 'Website loading speed issues',
      description: 'Homepage taking more than 5 seconds to load on mobile devices',
      status: 'in-progress',
      priority: 'medium',
      createdAt: 'Mar 18, 2024',
      updatedAt: 'Today, 10:30 AM',
      category: 'Technical',
      project: 'Restaurant Website',
      attachments: 2
    },
    { 
      id: 2, 
      ticketId: 'TKT-2024-0011',
      subject: 'Payment method not working',
      description: 'Credit card payment failing during checkout process',
      status: 'resolved',
      priority: 'high',
      createdAt: 'Mar 15, 2024',
      updatedAt: 'Mar 16, 2024',
      category: 'Billing',
      project: 'Portfolio Site',
      attachments: 0
    },
    { 
      id: 3, 
      ticketId: 'TKT-2024-0010',
      subject: 'Design template not loading',
      description: 'Selected template not displaying correctly in preview',
      status: 'open',
      priority: 'medium',
      createdAt: 'Mar 20, 2024',
      updatedAt: 'Today, 9:15 AM',
      category: 'Design',
      project: 'Restaurant Website',
      attachments: 1
    }
  ]);
  const [knowledgeBaseSearch, setKnowledgeBaseSearch] = useState('');
  const [popularArticles, setPopularArticles] = useState([
    { id: 1, title: 'Getting Started Guide', description: 'Learn how to set up your first website project', icon: 'fas fa-rocket', updated: '2 days ago', views: 1250 },
    { id: 2, title: 'Billing & Payment FAQ', description: 'Common questions about invoices and payment methods', icon: 'fas fa-credit-card', updated: '1 week ago', views: 890 },
    { id: 3, title: 'File Upload Guide', description: 'How to upload and manage your project files', icon: 'fas fa-upload', updated: '3 days ago', views: 750 },
    { id: 4, title: 'Mobile Responsive Design', description: 'Understanding how your website works on mobile devices', icon: 'fas fa-mobile-alt', updated: '1 week ago', views: 620 }
  ]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Getting Started', icon: 'fas fa-play-circle', articleCount: 12 },
    { id: 2, name: 'Project Management', icon: 'fas fa-project-diagram', articleCount: 8 },
    { id: 3, name: 'Billing & Payments', icon: 'fas fa-credit-card', articleCount: 6 },
    { id: 4, name: 'File Management', icon: 'fas fa-file-upload', articleCount: 5 },
    { id: 5, name: 'Design & Templates', icon: 'fas fa-palette', articleCount: 10 },
    { id: 6, name: 'Technical Issues', icon: 'fas fa-cog', articleCount: 7 }
  ]);
  const [quickHelp, setQuickHelp] = useState([
    { id: 1, question: 'How do I upload my logo?', answer: 'Go to File Manager and drag your logo file to the upload area', icon: 'fas fa-question-circle' },
    { id: 2, question: 'When will my website be ready?', answer: 'Check the Progress page for current status and timeline', icon: 'fas fa-question-circle' },
    { id: 3, question: 'How do I change my package?', answer: 'Visit the Packages page to upgrade or modify your plan', icon: 'fas fa-question-circle' },
    { id: 4, question: 'Can I request design changes?', answer: 'Yes! Message the design team or submit a change request', icon: 'fas fa-question-circle' }
  ]);
  const [resources, setResources] = useState([
    { id: 1, title: 'Video Tutorials', description: 'Step-by-step video guides', icon: 'fas fa-video' },
    { id: 2, title: 'Documentation', description: 'Complete technical documentation', icon: 'fas fa-file-pdf' },
    { id: 3, title: 'Community Forum', description: 'Connect with other users', icon: 'fas fa-users' },
    { id: 4, title: 'Webinars', description: 'Live training sessions', icon: 'fas fa-calendar' }
  ]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    project: '',
    description: '',
    attachments: []
  });
  const [isLiveChatActive, setIsLiveChatActive] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showKnowledgeBaseResults, setShowKnowledgeBaseResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [activeHelpOption, setActiveHelpOption] = useState(null);
  const fileInputRef = useRef(null);

  // Update support status periodically
  useEffect(() => {
    const updateSupportStatus = () => {
      const hours = new Date().getHours();
      const isBusinessHours = hours >= 9 && hours < 17; // 9 AM to 5 PM
      
      setSupportStatus({
        online: isBusinessHours,
        status: isBusinessHours ? 'Support Online' : 'Support Offline - Available 9 AM to 5 PM EST'
      });
    };

    updateSupportStatus();
    const interval = setInterval(updateSupportStatus, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Update open ticket count
  useEffect(() => {
    const openTickets = tickets.filter(ticket => 
      ticket.status === 'open' || ticket.status === 'in-progress'
    ).length;
    
    setSupportStats(prev => ({
      ...prev,
      openTickets
    }));
  }, [tickets]);

  // Simulate system status updates
  useEffect(() => {
    const updateSystemStatus = () => {
      setSystemStatus(prev => 
        prev.map(service => ({
          ...service,
          updated: 'Just now',
          status: service.id === 3 ? 'operational' : service.status // Simulate payment system becoming operational
        }))
      );
    };

    const interval = setInterval(updateSystemStatus, 300000); // Update every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  // Handle menu toggle
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = () => {
    router.push('/dashboard');
  };

  // Handle help option selection
  const handleHelpOption = (option) => {
    setActiveHelpOption(option);
    
    switch(option) {
      case 'knowledge-base':
        console.log('Opening knowledge base...');
        setShowKnowledgeBaseResults(true);
        break;
      case 'live-chat':
        handleStartLiveChat();
        break;
      case 'create-ticket':
        setShowTicketModal(true);
        break;
      case 'video-call':
        console.log('Scheduling video call...');
        window.open('https://calendly.com/webcraft-support/video-call', '_blank');
        break;
      default:
        break;
    }
  };

  // Handle live chat
  const handleStartLiveChat = () => {
    if (!supportStatus.online) {
      alert('Support is currently offline. Please try again during business hours (9 AM - 5 PM EST) or submit a support ticket.');
      return;
    }

    setIsLiveChatActive(true);
    
    // Simulate initial greeting from support agent
    setTimeout(() => {
      const greeting = {
        id: Date.now(),
        sender: 'Support Agent',
        content: 'Hello! Welcome to WebCraft Support. How can I help you today?',
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        isIncoming: true
      };
      setChatMessages([greeting]);
    }, 1000);
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'You',
      content: chatInput,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      isIncoming: false
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate support agent response
    setTimeout(() => {
      const responses = [
        "Thanks for your message. Let me check that for you.",
        "I understand. Can you provide more details about the issue?",
        "We're looking into this. One moment please.",
        "I can help with that. Let me guide you through the solution."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const supportResponse = {
        id: Date.now() + 1,
        sender: 'Support Agent',
        content: randomResponse,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        isIncoming: true
      };
      
      setChatMessages(prev => [...prev, supportResponse]);
    }, 2000);
  };

  const handleCloseChat = () => {
    setIsLiveChatActive(false);
    setChatMessages([]);
    setChatInput('');
  };

  // Handle knowledge base search
  const handleKnowledgeBaseSearch = (e) => {
    e.preventDefault();
    
    if (!knowledgeBaseSearch.trim()) {
      setShowKnowledgeBaseResults(false);
      return;
    }

    // Simulate search results
    const results = [
      { id: 1, title: 'Troubleshooting Upload Issues', excerpt: 'Learn how to resolve common file upload problems...', category: 'File Management' },
      { id: 2, title: 'Optimizing Website Speed', excerpt: 'Tips to improve your website loading time...', category: 'Technical' },
      { id: 3, title: 'Understanding File Formats', excerpt: 'Supported file formats and their requirements...', category: 'File Management' }
    ];
    
    setSearchResults(results);
    setShowKnowledgeBaseResults(true);
    console.log('Searching for:', knowledgeBaseSearch);
  };

  // Handle ticket creation
  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.category || !newTicket.description) {
      alert('Please fill in all required fields.');
      return;
    }

    const newTicketObj = {
      id: tickets.length + 1,
      ticketId: `TKT-2024-00${tickets.length + 12}`,
      subject: newTicket.subject,
      description: newTicket.description,
      status: 'open',
      priority: newTicket.priority,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      updatedAt: 'Just now',
      category: newTicket.category,
      project: newTicket.project || 'Not specified',
      attachments: newTicket.attachments.length
    };

    setTickets(prev => [newTicketObj, ...prev]);
    setShowTicketModal(false);
    
    // Reset form
    setNewTicket({
      subject: '',
      category: '',
      priority: 'medium',
      project: '',
      description: '',
      attachments: []
    });

    // Show confirmation
    alert(`Ticket ${newTicketObj.ticketId} created successfully! You'll receive updates via email.`);
  };

  // Handle file attachment
  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type
    }));

    setNewTicket(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
    
    e.target.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Handle ticket actions
  const handleTicketAction = (ticketId, action) => {
    const ticket = tickets.find(t => t.id === ticketId);
    
    switch(action) {
      case 'view':
        console.log('Viewing ticket:', ticket.ticketId);
        router.push(`/support/tickets/${ticketId}`);
        break;
      case 'update':
        console.log('Updating ticket:', ticket.ticketId);
        setTickets(prev => 
          prev.map(t => 
            t.id === ticketId ? { ...t, status: 'resolved', updatedAt: 'Just now' } : t
          )
        );
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ticket ${ticket.ticketId}?`)) {
          setTickets(prev => prev.filter(t => t.id !== ticketId));
        }
        break;
      default:
        break;
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'open':
        return 'ticket-status open';
      case 'in-progress':
        return 'ticket-status in-progress';
      case 'resolved':
        return 'ticket-status resolved';
      default:
        return 'ticket-status';
    }
  };

  // Get priority badge class
  const getPriorityBadgeClass = (priority) => {
    switch(priority) {
      case 'low':
        return 'ticket-priority low';
      case 'medium':
        return 'ticket-priority medium';
      case 'high':
        return 'ticket-priority high';
      case 'urgent':
        return 'ticket-priority urgent';
      default:
        return 'ticket-priority';
    }
  };

  // Get system status class
  const getSystemStatusClass = (status) => {
    switch(status) {
      case 'operational':
        return 'status-item operational';
      case 'maintenance':
        return 'status-item maintenance';
      case 'degraded':
        return 'status-item degraded';
      case 'outage':
        return 'status-item outage';
      default:
        return 'status-item';
    }
  };

  // Get status indicator dot class
  const getStatusDotClass = (status) => {
    switch(status) {
      case 'operational':
        return 'status-dot operational';
      case 'maintenance':
        return 'status-dot maintenance';
      case 'degraded':
        return 'status-dot degraded';
      case 'outage':
        return 'status-dot outage';
      default:
        return 'status-dot';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch(status) {
      case 'operational':
        return 'Operational';
      case 'maintenance':
        return 'Maintenance';
      case 'degraded':
        return 'Degraded Performance';
      case 'outage':
        return 'Outage';
      default:
        return status;
    }
  };

  // Handle emergency contact
  const handleEmergencyContact = (method) => {
    switch(method) {
      case 'phone':
        console.log('Calling emergency support: +1 (555) 123-HELP');
        window.location.href = 'tel:+1555123HELP';
        break;
      case 'email':
        console.log('Emailing emergency support: emergency@webcraft.com');
        window.location.href = 'mailto:emergency@webcraft.com?subject=Emergency%20Support%20Request';
        break;
      default:
        break;
    }
  };

  // Handle article click
  const handleArticleClick = (articleId) => {
    console.log('Opening article:', articleId);
    // In a real app, this would navigate to the article page
    const article = popularArticles.find(a => a.id === articleId);
    alert(`Opening article: ${article?.title}\n\nThis would navigate to the full article page in a real application.`);
  };

  // Handle category click
  const handleCategoryClick = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    console.log('Browsing category:', category?.name);
    setKnowledgeBaseSearch(category?.name);
    handleKnowledgeBaseSearch({ preventDefault: () => {} });
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
              <span>Support Center</span>
            </div>
          </div>
          <div className="header-right">
            <div className="support-status">
              <div className={`status-indicator ${supportStatus.online ? 'online' : 'offline'}`}>
                <i className={`fas fa-circle ${supportStatus.online ? 'online' : 'offline'}`}></i>
                <span>{supportStatus.status}</span>
              </div>
            </div>
            <div className="header-actions">
              <button 
                className="icon-btn"
                onClick={() => console.log('Notifications clicked')}
              >
                <i className="fas fa-bell"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Support Content */}
        <div className="content-area">
          {/* Support Overview */}
          <section className="support-overview">
            <div className="support-stats-grid">
              <div className="support-stat-card">
                <div className="stat-icon primary">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-info">
                  <h3>{supportStats.avgResponseTime}</h3>
                  <p>Avg. Response Time</p>
                </div>
              </div>
              <div className="support-stat-card">
                <div className="stat-icon success">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-info">
                  <h3>{supportStats.satisfactionRate}</h3>
                  <p>Satisfaction Rate</p>
                </div>
              </div>
              <div className="support-stat-card">
                <div className="stat-icon warning">
                  <i className="fas fa-ticket-alt"></i>
                </div>
                <div className="stat-info">
                  <h3>{supportStats.openTickets}</h3>
                  <p>Open Tickets</p>
                </div>
              </div>
              <div className="support-stat-card">
                <div className="stat-icon info">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-info">
                  <h3>{supportStats.supportAvailable}</h3>
                  <p>Support Available</p>
                </div>
              </div>
            </div>
          </section>

          {/* Help Options */}
          <section className="card">
            <div className="card-header">
              <h3>How Can We Help You?</h3>
              <p>Choose the best way to get support for your issue</p>
            </div>
            <div className="card-body">
              <div className="help-options-grid">
                <div className="help-option">
                  <div className="option-icon primary">
                    <i className="fas fa-search"></i>
                  </div>
                  <div className="option-content">
                    <h4>Search Knowledge Base</h4>
                    <p>Find instant answers in our comprehensive help articles and guides</p>
                    <button 
                      className="btn btn-outline"
                      onClick={() => handleHelpOption('knowledge-base')}
                    >
                      Browse Articles
                    </button>
                  </div>
                </div>
                <div className="help-option">
                  <div className="option-icon success">
                    <i className="fas fa-comments"></i>
                  </div>
                  <div className="option-content">
                    <h4>Live Chat</h4>
                    <p>Chat with our support team in real-time for immediate assistance</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleHelpOption('live-chat')}
                    >
                      Start Chat
                    </button>
                  </div>
                </div>
                <div className="help-option">
                  <div className="option-icon warning">
                    <i className="fas fa-ticket-alt"></i>
                  </div>
                  <div className="option-content">
                    <h4>Create Support Ticket</h4>
                    <p>Submit a detailed request and track progress through resolution</p>
                    <button 
                      className="btn btn-outline"
                      id="createTicketBtn"
                      onClick={() => handleHelpOption('create-ticket')}
                    >
                      Create Ticket
                    </button>
                  </div>
                </div>
                <div className="help-option">
                  <div className="option-icon info">
                    <i className="fas fa-video"></i>
                  </div>
                  <div className="option-content">
                    <h4>Schedule Video Call</h4>
                    <p>Book a screen sharing session with our technical team</p>
                    <button 
                      className="btn btn-outline"
                      onClick={() => handleHelpOption('video-call')}
                    >
                      Schedule Call
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Support Content */}
          <div className="support-content-columns">
            {/* Left Column - Knowledge Base & Quick Help */}
            <div className="column">
              {/* Knowledge Base Search */}
              <section className="card">
                <div className="card-header">
                  <h3>Knowledge Base</h3>
                  <p>Find answers to common questions</p>
                </div>
                <div className="card-body">
                  <div className="knowledge-search">
                    <form onSubmit={handleKnowledgeBaseSearch} className="search-box large">
                      <i className="fas fa-search"></i>
                      <input 
                        type="text" 
                        placeholder="Search help articles..."
                        value={knowledgeBaseSearch}
                        onChange={(e) => setKnowledgeBaseSearch(e.target.value)}
                      />
                      <button type="submit" className="btn btn-primary">
                        Search
                      </button>
                    </form>
                  </div>

                  {showKnowledgeBaseResults && searchResults.length > 0 && (
                    <div className="search-results">
                      <h4>Search Results</h4>
                      <div className="results-list">
                        {searchResults.map(result => (
                          <div key={result.id} className="result-item">
                            <h5>{result.title}</h5>
                            <p>{result.excerpt}</p>
                            <span className="result-category">{result.category}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Articles */}
                  <div className="popular-articles">
                    <h4>Popular Articles</h4>
                    <div className="articles-grid">
                      {popularArticles.map(article => (
                        <div 
                          key={article.id} 
                          className="article-card"
                          onClick={() => handleArticleClick(article.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="article-icon">
                            <i className={article.icon}></i>
                          </div>
                          <div className="article-content">
                            <h5>{article.title}</h5>
                            <p>{article.description}</p>
                            <span className="article-meta">Updated {article.updated} • {article.views} views</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Article Categories */}
                  <div className="article-categories">
                    <h4>Browse by Category</h4>
                    <div className="categories-grid">
                      {categories.map(category => (
                        <div 
                          key={category.id} 
                          className="category-card"
                          onClick={() => handleCategoryClick(category.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <i className={category.icon}></i>
                          <span>{category.name}</span>
                          <span className="article-count">{category.articleCount} articles</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Recent Tickets */}
              <section className="card">
                <div className="card-header">
                  <h3>Your Recent Support Tickets</h3>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => console.log('View all tickets')}
                  >
                    View All Tickets
                  </button>
                </div>
                <div className="card-body">
                  <div className="tickets-list">
                    {tickets.slice(0, 2).map(ticket => (
                      <div key={ticket.id} className="ticket-item">
                        <div className="ticket-header">
                          <span className="ticket-id">{ticket.ticketId}</span>
                          <span className={getStatusBadgeClass(ticket.status)}>
                            {ticket.status === 'in-progress' ? 'In Progress' : ticket.status}
                          </span>
                        </div>
                        <div className="ticket-content">
                          <h5>{ticket.subject}</h5>
                          <p>{ticket.description}</p>
                        </div>
                        <div className="ticket-meta">
                          <span className="ticket-date">Created: {ticket.createdAt}</span>
                          <span className={getPriorityBadgeClass(ticket.priority)}>
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                          </span>
                        </div>
                        <div className="ticket-actions">
                          <button 
                            className="btn-text"
                            onClick={() => handleTicketAction(ticket.id, 'view')}
                          >
                            View Details
                          </button>
                          {ticket.status !== 'resolved' && (
                            <button 
                              className="btn-text"
                              onClick={() => handleTicketAction(ticket.id, 'update')}
                            >
                              Mark as Resolved
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column - Quick Help & Resources */}
            <div className="column">
              {/* Quick Help */}
              <section className="card">
                <div className="card-header">
                  <h3>Quick Help</h3>
                </div>
                <div className="card-body">
                  <div className="quick-help-list">
                    {quickHelp.map(item => (
                      <div key={item.id} className="help-item">
                        <div className="help-icon">
                          <i className={item.icon}></i>
                        </div>
                        <div className="help-content">
                          <h5>{item.question}</h5>
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* System Status */}
              <section className="card">
                <div className="card-header">
                  <h3>System Status</h3>
                  <span className={`status-indicator ${systemStatus.every(s => s.status === 'operational') ? 'online' : 'warning'}`}>
                    {systemStatus.every(s => s.status === 'operational') ? 'All Systems Operational' : 'Some Systems Affected'}
                  </span>
                </div>
                <div className="card-body">
                  <div className="system-status-list">
                    {systemStatus.map(service => (
                      <div key={service.id} className={getSystemStatusClass(service.status)}>
                        <div className={getStatusDotClass(service.status)}></div>
                        <span className="service-name">{service.service}</span>
                        <span className="service-status">{getStatusText(service.status)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="status-update">
                    <p><strong>Update:</strong> Payment system maintenance scheduled for tonight 2:00 AM - 4:00 AM EST</p>
                  </div>
                </div>
              </section>

              {/* Support Resources */}
              <section className="card">
                <div className="card-header">
                  <h3>Support Resources</h3>
                </div>
                <div className="card-body">
                  <div className="resources-list">
                    {resources.map(resource => (
                      <div 
                        key={resource.id} 
                        className="resource-item"
                        onClick={() => console.log(`Opening ${resource.title}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="resource-icon">
                          <i className={resource.icon}></i>
                        </div>
                        <div className="resource-content">
                          <span className="resource-title">{resource.title}</span>
                          <span className="resource-desc">{resource.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Emergency Support */}
              <section className="card emergency-support">
                <div className="card-header">
                  <h3>Emergency Support</h3>
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div className="card-body">
                  <div className="emergency-content">
                    <p>For critical issues affecting your live website, contact emergency support:</p>
                    <div className="emergency-contacts">
                      <div 
                        className="contact-item"
                        onClick={() => handleEmergencyContact('phone')}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className="fas fa-phone"></i>
                        <div className="contact-info">
                          <span className="contact-method">Emergency Phone</span>
                          <span className="contact-detail">+1 (555) 123-HELP</span>
                        </div>
                      </div>
                      <div 
                        className="contact-item"
                        onClick={() => handleEmergencyContact('email')}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className="fas fa-envelope"></i>
                        <div className="contact-info">
                          <span className="contact-method">Emergency Email</span>
                          <span className="contact-detail">emergency@webcraft.com</span>
                        </div>
                      </div>
                    </div>
                    <div className="emergency-note">
                      <p><strong>Note:</strong> Emergency support is for critical issues only. Response time guaranteed within 30 minutes.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Create Ticket Modal */}
      {showTicketModal && (
        <div className="modal-overlay" id="ticketModal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create Support Ticket</h3>
              <button 
                className="icon-btn close-modal"
                onClick={() => setShowTicketModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="ticket-form">
                <div className="form-group">
                  <label>Subject *</label>
                  <input 
                    type="text" 
                    placeholder="Brief description of your issue" 
                    required
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select 
                      required
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      <option value="Technical">Technical Issue</option>
                      <option value="Billing">Billing & Payment</option>
                      <option value="Design">Design & Templates</option>
                      <option value="Project">Project Management</option>
                      <option value="General">General Inquiry</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Priority *</label>
                    <select 
                      required
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Project (Optional)</label>
                  <select 
                    value={newTicket.project}
                    onChange={(e) => setNewTicket({...newTicket, project: e.target.value})}
                  >
                    <option value="">Select Project</option>
                    <option value="Restaurant Website">Restaurant Website</option>
                    <option value="Portfolio Site">Portfolio Site</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea 
                    placeholder="Please provide detailed information about your issue..." 
                    rows="5" 
                    required
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Attachments</label>
                  <div 
                    className="file-upload-area"
                    onClick={handleFileAttach}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="fas fa-cloud-upload-alt"></i>
                    <p>Drag and drop files here or click to browse</p>
                    <span className="file-types">Supported: JPG, PNG, PDF, DOC (Max: 10MB)</span>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                      multiple
                    />
                  </div>
                  
                  {newTicket.attachments.length > 0 && (
                    <div className="attachments-list">
                      {newTicket.attachments.map(attachment => (
                        <div key={attachment.id} className="attachment-item">
                          <span>{attachment.name}</span>
                          <span className="file-size">{attachment.size}</span>
                          <button 
                            className="remove-attachment"
                            onClick={() => setNewTicket({
                              ...newTicket, 
                              attachments: newTicket.attachments.filter(a => a.id !== attachment.id)
                            })}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-outline close-modal"
                onClick={() => setShowTicketModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCreateTicket}
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Chat Modal */}
      {isLiveChatActive && (
        <div className="chat-modal-overlay">
          <div className="chat-modal">
            <div className="chat-header">
              <div className="chat-info">
                <span className="chat-status online"></span>
                <h4>Live Chat Support</h4>
                <span className="agent-name">Connected to Support Agent</span>
              </div>
              <button 
                className="chat-close"
                onClick={handleCloseChat}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="chat-messages">
              {chatMessages.map(message => (
                <div 
                  key={message.id} 
                  className={`chat-message ${message.isIncoming ? 'incoming' : 'outgoing'}`}
                >
                  {message.isIncoming && (
                    <div className="message-avatar">
                      <img src="https://ui-avatars.com/api/?name=Support+Agent&background=6366f1&color=fff" alt="Support Agent" />
                    </div>
                  )}
                  <div className="message-content">
                    <div className="message-bubble">
                      <p>{message.content}</p>
                    </div>
                    <div className="message-meta">
                      <span>{message.sender}</span>
                      <span>{message.time}</span>
                    </div>
                  </div>
                  {!message.isIncoming && (
                    <div className="message-avatar">
                      <img src="https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff" alt="You" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input 
                type="text" 
                placeholder="Type your message..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendChatMessage();
                  }
                }}
              />
              <button 
                className="chat-send"
                onClick={handleSendChatMessage}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;