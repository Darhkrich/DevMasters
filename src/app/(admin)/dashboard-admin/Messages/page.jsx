'use client';

import { useState } from 'react';
import './message.css';

const MessagesDashboard = () => {
  const [activeConversation, setActiveConversation] = useState(0);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 0,
      name: 'Sarah Smith',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=3498db&color=fff',
      status: 'online',
      lastSeen: '2 hours ago',
      project: 'Order #102',
      unread: 3,
      preview: 'Can we add Apple Pay to the checkout options? I think it would improve conversion...',
      messages: [
        {
          id: 1,
          sender: 'Sarah Smith',
          avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=3498db&color=fff',
          content: 'Hi Mike, I was reviewing the checkout process and was wondering if we could add Apple Pay as an option?',
          time: '10:30 AM',
          type: 'received'
        },
        {
          id: 2,
          sender: 'Mike Developer',
          avatar: 'https://ui-avatars.com/api/?name=Mike+Developer&background=27ae60&color=fff',
          content: 'Hi Sarah! Yes, we can definitely add Apple Pay. I\'ll need to update the payment gateway integration. Should take about 2-3 hours.',
          time: '10:35 AM',
          type: 'sent'
        },
        {
          id: 3,
          sender: 'Sarah Smith',
          avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=3498db&color=fff',
          content: 'That would be amazing! Our analytics show that 40% of our mobile users have Apple devices, so this could really help conversions.',
          time: '10:40 AM',
          type: 'received'
        },
        {
          id: 4,
          sender: 'Sarah Smith',
          avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=3498db&color=fff',
          content: 'Also, while you\'re working on payments, could you check if Google Pay is possible too?',
          time: '10:41 AM',
          type: 'received'
        }
      ]
    },
    {
      id: 1,
      name: 'Sarah Lead',
      avatar: 'https://ui-avatars.com/api/?name=Team+Lead&background=e74c3c&color=fff',
      status: 'away',
      lastSeen: '5 hours ago',
      project: 'Order #107',
      unread: 0,
      preview: 'Client approved the design, you can start development on the restaurant website...',
      messages: []
    },
    {
      id: 2,
      name: 'Emily Davis',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=f39c12&color=fff',
      status: 'offline',
      lastSeen: '1 day ago',
      project: 'Order #107',
      unread: 0,
      preview: 'When can we see the menu functionality working? Our grand opening is approaching...',
      messages: []
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, you would send this to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleStartNewMessage = () => {
    alert('Starting a new message...');
    // Logic to start a new message
  };

  const handleArchiveView = () => {
    alert('Viewing archived messages...');
    // Logic to view archived messages
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="admin-container">
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Messages</h1>
            <p className="welcome-text">Communicate with clients and team members</p>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <input type="text" placeholder="Search messages..." />
              <button>🔍</button>
            </div>
            <button className="primary-btn" onClick={handleStartNewMessage}>
              + New Message
            </button>
          </div>
        </header>

        <div className="content-grid">
          {/* Conversations List */}
          <div className="content-card">
            <div className="card-header">
              <h2>Conversations</h2>
              <button className="view-all-btn" onClick={handleArchiveView}>
                Archived →
              </button>
            </div>
            <div className="conversations-list">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${activeConversation === conversation.id ? 'active' : ''}`}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="conversation-avatar">
                    <img src={conversation.avatar} alt={conversation.name} />
                    <div className={`online-status ${conversation.status}`}></div>
                  </div>
                  <div className="conversation-details">
                    <div className="conversation-header">
                      <h4>{conversation.name}</h4>
                      <span className="message-time">{conversation.lastSeen}</span>
                    </div>
                    <p className="message-preview">{conversation.preview}</p>
                    <div className="conversation-meta">
                      <span className="project-tag">{conversation.project}</span>
                      {conversation.unread > 0 && (
                        <span className="unread-count">{conversation.unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Thread */}
          <div className="content-card">
            <div className="message-thread">
              <div className="thread-header">
                <div className="thread-info">
                  <h3>{conversations[activeConversation].name}</h3>
                  <p>{conversations[activeConversation].project} - Ecommerce Store</p>
                </div>
                <div className="thread-actions">
                  <button className="icon-btn" title="Call">
                    📞
                  </button>
                  <button className="icon-btn" title="Video Call">
                    🎥
                  </button>
                  <button className="icon-btn" title="More">
                    ⋯
                  </button>
                </div>
              </div>

              <div className="messages-container">
                {conversations[activeConversation].messages.map((message) => (
                  <div key={message.id} className={`message ${message.type}`}>
                    {message.type === 'received' && (
                      <div className="message-avatar">
                        <img src={message.avatar} alt={message.sender} />
                      </div>
                    )}
                    <div className="message-content">
                      <p>{message.content}</p>
                      <span className="message-time">{message.time}</span>
                    </div>
                    {message.type === 'sent' && (
                      <div className="message-avatar">
                        <img src={message.avatar} alt={message.sender} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="message-input">
                <div className="input-tools">
                  <button className="tool-btn">📎</button>
                  <button className="tool-btn">🖼</button>
                  <button className="tool-btn">😊</button>
                </div>
                <textarea
                  placeholder="Type your message..."
                  rows="3"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button className="send-btn" onClick={handleSendMessage}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MessagesDashboard;