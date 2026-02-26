'use client';
import './message.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const Messages = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Design Team',
      avatar: 'https://ui-avatars.com/api/?name=Design+Team&background=6366f1&color=fff',
      online: true,
      lastMessage: 'We\'ve completed the initial design mockups for your review. Please let us know your feedback...',
      time: '10:30 AM',
      unreadCount: 3,
      project: 'Restaurant Website',
      hasAttachments: true,
      isActive: true,
      isArchived: false,
      messages: []
    },
    {
      id: 2,
      name: 'Sarah Johnson (PM)',
      avatar: 'https://ui-avatars.com/api/?name=Project+Manager&background=10b981&color=fff',
      online: true,
      lastMessage: 'Could you please provide the restaurant menu prices and operating hours?',
      time: 'Yesterday',
      unreadCount: 1,
      project: 'Restaurant Website',
      hasAttachments: false,
      isActive: false,
      isArchived: false,
      messages: []
    },
    {
      id: 3,
      name: 'Development Team',
      avatar: 'https://ui-avatars.com/api/?name=Developer+Team&background=f59e0b&color=fff',
      online: false,
      lastMessage: 'We\'ve started implementing the online ordering system. Everything is progressing...',
      time: 'Mar 18',
      unreadCount: 0,
      project: 'Restaurant Website',
      hasAttachments: true,
      isActive: false,
      isArchived: false,
      messages: []
    },
    {
      id: 4,
      name: 'Support Team',
      avatar: 'https://ui-avatars.com/api/?name=Support+Team&background=ef4444&color=fff',
      online: true,
      lastMessage: 'Your support request has been received and we\'re looking into the domain...',
      time: 'Mar 15',
      unreadCount: 0,
      project: 'Portfolio Site',
      hasAttachments: false,
      isActive: false,
      isArchived: false,
      messages: []
    },
    {
      id: 5,
      name: 'Sales Team',
      avatar: 'https://ui-avatars.com/api/?name=Sales+Team&background=8b5cf6&color=fff',
      online: false,
      lastMessage: 'Thank you for your interest in our e-commerce package. We\'d love to discuss...',
      time: 'Mar 10',
      unreadCount: 0,
      project: 'Completed',
      hasAttachments: false,
      isActive: false,
      isArchived: true,
      messages: []
    }
  ]);
  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Design Team',
      avatar: 'https://ui-avatars.com/api/?name=Design+Team&background=6366f1&color=fff',
      content: 'Hi John! We\'ve completed the initial design mockups for your restaurant website. We\'ve incorporated your brand colors and created a modern, responsive layout.',
      time: '10:15 AM',
      isIncoming: true,
      status: 'read',
      attachments: [
        { id: 1, type: 'image', url: 'https://via.placeholder.com/150x100/6366f1/ffffff?text=Mockup+1', name: 'Mockup 1' },
        { id: 2, type: 'image', url: 'https://via.placeholder.com/150x100/10b981/ffffff?text=Mockup+2', name: 'Mockup 2' }
      ]
    },
    {
      id: 2,
      sender: 'You',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff',
      content: 'Thanks for sending these over! The design looks great. I really like the color scheme and layout. Could we make the header image slightly larger?',
      time: '10:22 AM',
      isIncoming: false,
      status: 'read'
    },
    {
      id: 3,
      sender: 'Design Team',
      avatar: 'https://ui-avatars.com/api/?name=Design+Team&background=6366f1&color=fff',
      content: 'Absolutely! We can adjust the header size. I\'ve also attached the updated design file with your requested changes.',
      time: '10:30 AM',
      isIncoming: true,
      status: 'delivered',
      attachments: [
        { id: 3, type: 'pdf', url: '#', name: 'restaurant-design-updated.pdf', size: '2.4 MB' }
      ]
    },
    {
      id: 4,
      sender: 'Design Team',
      avatar: 'https://ui-avatars.com/api/?name=Design+Team&background=6366f1&color=fff',
      content: 'We wanted to check if you had a chance to review the initial color palette we sent?',
      time: '3:45 PM',
      date: 'Yesterday',
      isIncoming: true,
      status: 'read'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [newMessageRecipient, setNewMessageRecipient] = useState('');
  const [newMessageSubject, setNewMessageSubject] = useState('');
  const [teamMembers] = useState([
    { id: 1, name: 'Alex Designer', role: 'UI/UX Designer', avatar: 'https://ui-avatars.com/api/?name=Designer&background=6366f1&color=fff', online: true },
    { id: 2, name: 'Sam Developer', role: 'Frontend Developer', avatar: 'https://ui-avatars.com/api/?name=Developer&background=10b981&color=fff', online: true },
    { id: 3, name: 'Sarah Johnson', role: 'Project Manager', avatar: 'https://ui-avatars.com/api/?name=Project+Manager&background=f59e0b&color=fff', online: false }
  ]);
  const [sharedFiles] = useState([
    { id: 1, name: 'design-mockups.pdf', type: 'pdf', date: 'Today, 10:15 AM' },
    { id: 2, name: 'header-design.png', type: 'image', date: 'Today, 10:15 AM' },
    { id: 3, name: 'color-palette.jpg', type: 'image', date: 'Yesterday, 3:45 PM' }
  ]);

  const messageAreaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    let typingTimeout;
    
    if (newMessage.length > 0) {
      // Clear existing timeout
      if (typingTimeout) clearTimeout(typingTimeout);
      
      // Show typing indicator after 1 second of inactivity
      typingTimeout = setTimeout(() => {
        setTypingIndicator(true);
        
        // Simulate receiving a response after 2 seconds
        setTimeout(() => {
          setTypingIndicator(false);
          // Add simulated response
          const simulatedResponse = {
            id: messages.length + 1,
            sender: activeConversation.name,
            avatar: activeConversation.avatar,
            content: getRandomResponse(),
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            isIncoming: true,
            status: 'delivered'
          };
          setMessages(prev => [...prev, simulatedResponse]);
          
          // Mark conversation as unread
          setConversations(prev => 
            prev.map(conv => 
              conv.id === activeConversation.id 
                ? { ...conv, unreadCount: conv.unreadCount + 1, lastMessage: simulatedResponse.content.substring(0, 60) + '...' }
                : conv
            )
          );
        }, 2000);
      }, 1000);
    } else {
      setTypingIndicator(false);
    }

    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [newMessage, activeConversation, messages.length]);

  // Get random response for simulation
  const getRandomResponse = () => {
    const responses = [
      "Thanks for the feedback! We'll make those changes right away.",
      "Great point! We'll update the design accordingly.",
      "Noted! We'll incorporate that in the next revision.",
      "That makes sense. We'll adjust and send you an update soon.",
      "Perfect! We'll proceed with those modifications."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Handle menu toggle
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = () => {
    router.push('/dashboard');
  };

  // Handle conversation selection
  const handleConversationSelect = (conversation) => {
    setActiveConversation(conversation);
    // Mark conversation as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0, isActive: true }
          : { ...conv, isActive: false }
      )
    );
    
    // Load conversation messages (in a real app, this would fetch from API)
    console.log(`Loading messages for conversation: ${conversation.name}`);
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Filter conversations based on search and active filter
  const filteredConversations = conversations.filter(conv => {
    // Apply search filter
    const matchesSearch = searchQuery === '' || 
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply active filter
    switch(activeFilter) {
      case 'All':
        return matchesSearch && !conv.isArchived;
      case 'Unread':
        return matchesSearch && conv.unreadCount > 0 && !conv.isArchived;
      case 'Projects':
        return matchesSearch && conv.project && !conv.isArchived;
      case 'Archived':
        return matchesSearch && conv.isArchived;
      default:
        return matchesSearch;
    }
  });

  // Handle sending a message
  const handleSendMessage = () => {
    if (!newMessage.trim() && attachments.length === 0) return;

    const newMessageObj = {
      id: messages.length + 1,
      sender: 'You',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff',
      content: newMessage,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      isIncoming: false,
      status: 'sent',
      attachments: attachments.length > 0 ? [...attachments] : []
    };

    setMessages(prev => [...prev, newMessageObj]);
    
    // Update conversation last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === activeConversation.id 
          ? { 
              ...conv, 
              lastMessage: newMessage.substring(0, 60) + (newMessage.length > 60 ? '...' : ''),
              time: 'Just now',
              hasAttachments: attachments.length > 0 || conv.hasAttachments
            }
          : conv
      )
    );

    // Clear message and attachments
    setNewMessage('');
    setAttachments([]);
    
    console.log('Message sent:', newMessageObj);
  };

  // Handle key press for sending message (Enter to send, Shift+Enter for new line)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle file attachment
  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      type: file.type.split('/')[0] === 'image' ? 'image' : 'file',
      url: URL.createObjectURL(file),
      size: formatFileSize(file.size),
      file: file
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = ''; // Reset file input
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Handle attachment actions
  const handleAttachmentAction = (attachmentId, action) => {
    const attachment = attachments.find(a => a.id === attachmentId);
    
    switch(action) {
      case 'preview':
        console.log('Previewing attachment:', attachment.name);
        window.open(attachment.url, '_blank');
        break;
      case 'download':
        console.log('Downloading attachment:', attachment.name);
        const link = document.createElement('a');
        link.href = attachment.url;
        link.download = attachment.name;
        link.click();
        break;
      case 'remove':
        setAttachments(prev => prev.filter(a => a.id !== attachmentId));
        break;
      default:
        break;
    }
  };

  // Handle message actions
  const handleMessageAction = (messageId, action) => {
    const message = messages.find(m => m.id === messageId);
    
    switch(action) {
      case 'download':
        console.log('Downloading message attachment');
        // Handle attachment download
        break;
      case 'reply':
        console.log('Replying to message');
        setNewMessage(`Re: "${message.content.substring(0, 50)}..." `);
        break;
      default:
        break;
    }
  };

  // Handle thread actions
  const handleThreadAction = (action) => {
    switch(action) {
      case 'video-call':
        console.log('Starting video call with:', activeConversation.name);
        break;
      case 'phone-call':
        console.log('Starting phone call with:', activeConversation.name);
        break;
      case 'more-options':
        console.log('Showing more options');
        break;
      default:
        break;
    }
  };

  // Handle new message creation
  const handleNewMessage = () => {
    setShowNewMessageModal(true);
  };

  const handleSendNewMessage = () => {
    if (!newMessageRecipient || !newMessageSubject) return;

    const newConv = {
      id: conversations.length + 1,
      name: newMessageRecipient,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newMessageRecipient)}&background=6366f1&color=fff`,
      online: true,
      lastMessage: newMessageSubject,
      time: 'Just now',
      unreadCount: 0,
      project: 'New Conversation',
      hasAttachments: false,
      isActive: true,
      isArchived: false,
      messages: []
    };

    setConversations(prev => [
      newConv,
      ...prev.map(conv => ({ ...conv, isActive: false }))
    ]);
    
    setActiveConversation(newConv);
    setShowNewMessageModal(false);
    setNewMessageRecipient('');
    setNewMessageSubject('');
    
    console.log('New conversation started with:', newMessageRecipient);
  };

  // Handle conversation archiving
  const handleArchiveConversation = (conversationId) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, isArchived: !conv.isArchived }
          : conv
      )
    );
    
    if (activeConversation.id === conversationId) {
      const nextActive = conversations.find(conv => conv.id !== conversationId && !conv.isArchived);
      if (nextActive) {
        setActiveConversation(nextActive);
      }
    }
  };

  // Get message status icon
  const getMessageStatusIcon = (status) => {
    switch(status) {
      case 'sent':
        return 'fas fa-check';
      case 'delivered':
        return 'fas fa-check-double';
      case 'read':
        return 'fas fa-check-double text-blue-500';
      default:
        return 'far fa-clock';
    }
  };

  // Format time for display
  const formatMessageTime = (time) => {
    if (time === 'Just now') return time;
    const now = new Date();
    const messageTime = new Date(`2000-01-01 ${time}`);
    return time;
  };

  // Get file icon
  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'pdf':
        return 'fas fa-file-pdf';
      case 'image':
        return 'fas fa-image';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word';
      default:
        return 'fas fa-file';
    }
  };

  // Group messages by date
  const groupMessagesByDate = useCallback(() => {
    const groups = [];
    let currentDate = null;

    messages.forEach((message, index) => {
      const messageDate = message.date || 'Today';
      
      if (messageDate !== currentDate) {
        groups.push({
          type: 'date',
          content: messageDate,
          id: `date-${index}`
        });
        currentDate = messageDate;
      }
      
      groups.push({
        type: 'message',
        content: message,
        id: message.id
      });
    });

    return groups;
  }, [messages]);

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
              <span>Messages</span>
            </div>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <button 
                className="btn btn-primary"
                id="newMessageBtn"
                onClick={handleNewMessage}
              >
                <i className="fas fa-plus"></i>
                New Message
              </button>
              <button 
                className="icon-btn"
                onClick={() => console.log('Notifications clicked')}
              >
                <i className="fas fa-bell"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Messages Content */}
        <div className="messages-container">
          {/* Sidebar - Conversation List */}
          <aside className="conversations-sidebar">
            <div className="conversations-header">
              <h3>Conversations</h3>
              <div className="conversation-actions">
                <button 
                  className="icon-btn" 
                  title="Filter"
                  onClick={() => console.log('Filter clicked')}
                >
                  <i className="fas fa-filter"></i>
                </button>
                <button 
                  className="icon-btn" 
                  title="Search"
                  onClick={() => document.querySelector('.conversation-search input')?.focus()}
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>

            {/* Search Box */}
            <div className="conversation-search">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input 
                  type="text" 
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="conversation-filters">
              {['All', 'Unread', 'Projects', 'Archived'].map((filter) => (
                <button
                  key={filter}
                  className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => handleFilterChange(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Conversation List */}
            <div className="conversation-list">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${conversation.isActive ? 'active' : ''} ${conversation.unreadCount > 0 ? 'unread' : ''} ${conversation.isArchived ? 'archived' : ''}`}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <div className="conversation-avatar">
                    <img src={conversation.avatar} alt={conversation.name} />
                    <span className={`online-indicator ${conversation.online ? '' : 'offline'}`}></span>
                  </div>
                  <div className="conversation-content">
                    <div className="conversation-header">
                      <span className="conversation-name">{conversation.name}</span>
                      <span className="conversation-time">{conversation.time}</span>
                    </div>
                    <div className="conversation-preview">
                      <p>{conversation.lastMessage}</p>
                      {conversation.unreadCount > 0 && (
                        <span className="unread-badge">{conversation.unreadCount}</span>
                      )}
                    </div>
                    <div className="conversation-meta">
                      <span className="project-tag">{conversation.project}</span>
                      {conversation.hasAttachments && (
                        <span className="attachment-indicator">
                          <i className="fas fa-paperclip"></i>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main - Message Thread */}
          <main className="message-thread">
            {/* Thread Header */}
            <div className="thread-header">
              <div className="thread-info">
                <div className="thread-avatar">
                  <img src={activeConversation.avatar} alt={activeConversation.name} />
                  <span className={`online-indicator ${activeConversation.online ? '' : 'offline'}`}></span>
                </div>
                <div className="thread-details">
                  <h3>{activeConversation.name}</h3>
                  <p>{activeConversation.project} • {activeConversation.online ? 'Online now' : 'Last seen today'}</p>
                </div>
              </div>
              <div className="thread-actions">
                <button 
                  className="icon-btn" 
                  title="Video Call"
                  onClick={() => handleThreadAction('video-call')}
                >
                  <i className="fas fa-video"></i>
                </button>
                <button 
                  className="icon-btn" 
                  title="Phone Call"
                  onClick={() => handleThreadAction('phone-call')}
                >
                  <i className="fas fa-phone"></i>
                </button>
                <button 
                  className="icon-btn" 
                  title="More Options"
                  onClick={() => handleThreadAction('more-options')}
                >
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="message-area" ref={messageAreaRef}>
              {groupMessagesByDate().map((group) => {
                if (group.type === 'date') {
                  return (
                    <div key={group.id} className="date-separator">
                      <span>{group.content}</span>
                    </div>
                  );
                }

                const message = group.content;
                return (
                  <div key={group.id} className={`message ${message.isIncoming ? 'incoming' : 'outgoing'}`}>
                    {message.isIncoming ? (
                      <>
                        <div className="message-avatar">
                          <img src={message.avatar} alt={message.sender} />
                        </div>
                        <div className="message-content">
                          <div className="message-bubble">
                            <p>{message.content}</p>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="message-attachments">
                                {message.attachments.map((attachment) => (
                                  <div key={attachment.id} className={`attachment-item ${attachment.type}`}>
                                    {attachment.type === 'image' ? (
                                      <>
                                        <img src={attachment.url} alt={attachment.name} />
                                        <div className="attachment-overlay">
                                          <button 
                                            className="btn-icon"
                                            onClick={() => window.open(attachment.url, '_blank')}
                                          >
                                            <i className="fas fa-search-plus"></i>
                                          </button>
                                          <button 
                                            className="btn-icon"
                                            onClick={() => {
                                              const link = document.createElement('a');
                                              link.href = attachment.url;
                                              link.download = attachment.name;
                                              link.click();
                                            }}
                                          >
                                            <i className="fas fa-download"></i>
                                          </button>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="file-icon">
                                          <i className={getFileIcon(attachment.type)}></i>
                                        </div>
                                        <div className="file-info">
                                          <span className="file-name">{attachment.name}</span>
                                          <span className="file-size">{attachment.size}</span>
                                        </div>
                                        <button 
                                          className="download-btn"
                                          onClick={() => console.log('Downloading:', attachment.name)}
                                        >
                                          <i className="fas fa-download"></i>
                                        </button>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="message-meta">
                            <span className="message-time">{formatMessageTime(message.time)}</span>
                            <span className="message-status">
                              <i className={getMessageStatusIcon(message.status)}></i>
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="message-content">
                          <div className="message-bubble">
                            <p>{message.content}</p>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="message-attachments">
                                {message.attachments.map((attachment) => (
                                  <div key={attachment.id} className={`attachment-item ${attachment.type}`}>
                                    {attachment.type === 'image' ? (
                                      <>
                                        <img src={attachment.url} alt={attachment.name} />
                                        <div className="attachment-overlay">
                                          <button className="btn-icon">
                                            <i className="fas fa-search-plus"></i>
                                          </button>
                                          <button className="btn-icon">
                                            <i className="fas fa-download"></i>
                                          </button>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="file-icon">
                                          <i className={getFileIcon(attachment.type)}></i>
                                        </div>
                                        <div className="file-info">
                                          <span className="file-name">{attachment.name}</span>
                                          <span className="file-size">{attachment.size}</span>
                                        </div>
                                        <button className="download-btn">
                                          <i className="fas fa-download"></i>
                                        </button>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="message-meta">
                            <span className="message-time">{formatMessageTime(message.time)}</span>
                            <span className="message-status">
                              <i className={getMessageStatusIcon(message.status)}></i>
                            </span>
                          </div>
                        </div>
                        <div className="message-avatar">
                          <img src={message.avatar} alt={message.sender} />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="message-input-container">
              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="attachments-preview">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="attachment-preview">
                      {attachment.type === 'image' ? (
                        <img src={attachment.url} alt={attachment.name} />
                      ) : (
                        <div className="file-preview">
                          <i className={getFileIcon(attachment.type)}></i>
                          <span>{attachment.name}</span>
                        </div>
                      )}
                      <button 
                        className="remove-attachment"
                        onClick={() => handleAttachmentAction(attachment.id, 'remove')}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="message-input-toolbar">
                <button 
                  className="toolbar-btn" 
                  title="Attach File"
                  onClick={handleAttachFile}
                >
                  <i className="fas fa-paperclip"></i>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    multiple
                  />
                </button>
                <button 
                  className="toolbar-btn" 
                  title="Add Image"
                  onClick={() => console.log('Add image')}
                >
                  <i className="fas fa-image"></i>
                </button>
                <button 
                  className="toolbar-btn" 
                  title="Add Emoji"
                  onClick={() => console.log('Add emoji')}
                >
                  <i className="fas fa-smile"></i>
                </button>
                <button 
                  className="toolbar-btn" 
                  title="Templates"
                  onClick={() => console.log('Show templates')}
                >
                  <i className="fas fa-sticky-note"></i>
                </button>
              </div>
              <div className="message-input">
                <textarea 
                  placeholder="Type your message..." 
                  rows="3"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                ></textarea>
                <button 
                  className="btn btn-primary send-btn"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() && attachments.length === 0}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
              {typingIndicator && (
                <div className="message-input-footer">
                  <span className="typing-indicator">
                    <i className="fas fa-circle"></i>
                    {activeConversation.name} is typing...
                  </span>
                </div>
              )}
            </div>
          </main>

          {/* Sidebar - Conversation Details */}
          {isDetailsOpen && (
            <aside className="conversation-details">
              <div className="details-header">
                <h4>Conversation Details</h4>
                <button 
                  className="icon-btn"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="details-content">
                {/* Project Info */}
                <div className="details-section">
                  <h5>Project Information</h5>
                  <div className="project-info">
                    <div className="project-avatar">
                      <img src="https://via.placeholder.com/60x40/6366f1/ffffff?text=RS" alt="Project" />
                    </div>
                    <div className="project-details">
                      <span className="project-name">{activeConversation.project}</span>
                      <span className="project-status in-progress">In Progress</span>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="details-section">
                  <h5>Team Members</h5>
                  <div className="team-members">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="team-member">
                        <div className="member-avatar">
                          <img src={member.avatar} alt={member.name} />
                          <span className={`online-indicator ${member.online ? '' : 'offline'}`}></span>
                        </div>
                        <div className="member-info">
                          <span className="member-name">{member.name}</span>
                          <span className="member-role">{member.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shared Files */}
                <div className="details-section">
                  <h5>Shared Files</h5>
                  <div className="shared-files">
                    {sharedFiles.map((file) => (
                      <div key={file.id} className="shared-file">
                        <div className="file-icon">
                          <i className={getFileIcon(file.type)}></i>
                        </div>
                        <div className="file-info">
                          <span className="file-name">{file.name}</span>
                          <span className="file-date">{file.date}</span>
                        </div>
                        <button 
                          className="download-btn"
                          onClick={() => console.log(`Downloading ${file.name}`)}
                        >
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="details-section">
                  <h5>Quick Actions</h5>
                  <div className="quick-actions">
                    <button 
                      className="btn btn-outline full-width"
                      onClick={() => console.log('Schedule meeting')}
                    >
                      <i className="fas fa-calendar"></i>
                      Schedule Meeting
                    </button>
                    <button 
                      className="btn btn-outline full-width"
                      onClick={() => console.log('Create task')}
                    >
                      <i className="fas fa-tasks"></i>
                      Create Task
                    </button>
                    <button 
                      className="btn btn-outline full-width"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        console.log('Chat link copied to clipboard');
                      }}
                    >
                      <i className="fas fa-link"></i>
                      Copy Chat Link
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="modal-overlay" onClick={() => setShowNewMessageModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Message</h3>
              <button 
                className="modal-close"
                onClick={() => setShowNewMessageModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>To:</label>
                <input 
                  type="text" 
                  placeholder="Enter recipient name or email"
                  value={newMessageRecipient}
                  onChange={(e) => setNewMessageRecipient(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Subject:</label>
                <input 
                  type="text" 
                  placeholder="Enter message subject"
                  value={newMessageSubject}
                  onChange={(e) => setNewMessageSubject(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Message:</label>
                <textarea 
                  placeholder="Type your message here..."
                  rows="4"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setShowNewMessageModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSendNewMessage}
                disabled={!newMessageRecipient || !newMessageSubject}
              >
                <i className="fas fa-paper-plane"></i>
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;