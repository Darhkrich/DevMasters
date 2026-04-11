'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  createThread,
  fetchThread,
  fetchThreads,
  getStoredUser,
  replyToThread,
} from '@/lib/boemApi';
import './message.css';

function formatDateTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function buildDisplayName(user) {
  if (!user) return 'DevMasters Client';
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  return fullName || user.name || user.email || 'DevMasters Client';
}

export default function MessagesPage() {
  const storedUser = getStoredUser();
  const senderName = buildDisplayName(storedUser);
  const messagesEndRef = useRef(null);

  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [activeThread, setActiveThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [newThreadSubject, setNewThreadSubject] = useState('');
  const [newThreadBody, setNewThreadBody] = useState('');
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);

  const filteredThreads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return threads;
    return threads.filter((thread) => {
      const preview = thread.last_message?.body || '';
      return [thread.subject, preview, thread.client_name]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [searchQuery, threads]);

  const loadThreadList = async (preferredThreadId = null) => {
    const payload = await fetchThreads();
    const results = payload.results || [];
    setThreads(results);
    const nextThreadId =
      preferredThreadId ||
      (results.some((thread) => thread.id === activeThreadId) ? activeThreadId : results[0]?.id);
    if (nextThreadId) {
      setActiveThreadId(nextThreadId);
    } else {
      setActiveThreadId(null);
      setActiveThread(null);
    }
    return results;
  };

  // Initial load
  useEffect(() => {
    let isMounted = true;
    const initialize = async () => {
      try {
        const payload = await fetchThreads();
        if (!isMounted) return;
        const results = payload.results || [];
        setThreads(results);
        setActiveThreadId(results[0]?.id || null);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Unable to load your conversations.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    initialize();
    return () => { isMounted = false; };
  }, []);

  // Load active thread when ID changes
  useEffect(() => {
    if (!activeThreadId) return;
    let isMounted = true;
    const loadActiveThread = async () => {
      setThreadLoading(true);
      try {
        const payload = await fetchThread(activeThreadId, 'client');
        if (!isMounted) return;
        setActiveThread(payload);
        setThreads((current) =>
          current.map((thread) =>
            thread.id === payload.id
              ? {
                  ...thread,
                  unread_count: 0,
                  last_message: payload.last_message,
                  updated_at: payload.updated_at,
                }
              : thread
          )
        );
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Unable to open this conversation.');
      } finally {
        if (isMounted) setThreadLoading(false);
      }
    };
    loadActiveThread();
    return () => { isMounted = false; };
  }, [activeThreadId]);

  // Manual refresh
  const handleRefresh = async () => {
    if (activeThreadId) {
      setThreadLoading(true);
      try {
        const updated = await fetchThread(activeThreadId, 'client');
        setActiveThread(updated);
        setThreads(prev =>
          prev.map(t =>
            t.id === updated.id
              ? {
                  ...t,
                  unread_count: updated.unread_count,
                  last_message: updated.last_message,
                  updated_at: updated.updated_at,
                }
              : t
          )
        );
      } catch (err) {
        console.error('Refresh error', err);
      } finally {
        setThreadLoading(false);
      }
    } else {
      await loadThreadList();
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  const handleSendReply = async () => {
    const body = newMessage.trim();
    if (!body || !activeThreadId) return;
    setSending(true);
    setError('');
    try {
      await replyToThread(activeThreadId, {
        sender_name: senderName,
        sender_role: 'client',
        body,
      });
      setNewMessage('');
      await loadThreadList(activeThreadId);
      const detail = await fetchThread(activeThreadId, 'client');
      setActiveThread(detail);
    } catch (err) {
      setError(err.message || 'Unable to send your message.');
    } finally {
      setSending(false);
    }
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    const subject = newThreadSubject.trim();
    const body = newThreadBody.trim();
    if (!subject || !body) {
      setError('Please provide both a subject and a message.');
      return;
    }
    setCreating(true);
    setError('');
    try {
      const payload = await createThread({
        subject,
        body,
        sender_name: senderName,
        sender_role: 'client',
        client_email: storedUser?.email,
        client_name: senderName,
      });
      setShowComposer(false);
      setNewThreadSubject('');
      setNewThreadBody('');
      await loadThreadList(payload.id);
    } catch (err) {
      setError(err.message || 'Unable to start a new conversation.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="msg-dashboard-container">
      <main className="msg-main-content">
        <header className="msg-top-header">
          <button className="mobile-menu-btn" onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}>
            <i className="fas fa-bars" />
          </button>
          <div className="msg-header-left">
            <div className="msg-breadcrumb">
              <Link href="/dashboard">Dashboard</Link>
              <i className="fas fa-chevron-right" />
              <span>Messages</span>
            </div>
          </div>
          <div className="msg-header-right">
            <div className="msg-header-actions">
              <button className="msg-btn msg-btn-primary" onClick={() => setShowComposer(true)}>
                New Message
              </button>
              <button
                className="msg-btn msg-btn-outline"
                onClick={handleRefresh}
                title="Refresh messages"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </header>

        {error && <div className="msg-auth-error-message">{error}</div>}

        <div className="msg-messages-container">
          <aside className={`msg-conversations-sidebar ${leftSidebarOpen ? 'mobile-visible' : ''}`}>
            <div className="msg-conversations-header">
              <h3>Conversations</h3>
            </div>
            <div className="msg-conversation-search">
              <div className="msg-search-box">
                <i className="fas fa-search" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="msg-conversation-list">
              {loading && <p>Loading conversations...</p>}
              {!loading && filteredThreads.length === 0 && (
                <p>No conversations yet. Start one with the team.</p>
              )}
              {filteredThreads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  className={`msg-conversation-item ${thread.id === activeThreadId ? 'active' : ''}`}
                  onClick={() => setActiveThreadId(thread.id)}
                >
                  <div className="msg-conversation-content">
                    <div className="msg-conversation-top">
                      <strong>{thread.subject}</strong>
                      <span>{formatDateTime(thread.updated_at)}</span>
                    </div>
                    <p>{thread.last_message?.body || 'No messages yet.'}</p>
                  </div>
                  {thread.unread_count > 0 && (
                    <span className="msg-unread-badge">{thread.unread_count}</span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          <section className="msg-message-thread">
            {activeThread ? (
              <>
                <div className="msg-thread-header">
                  <div className="msg-thread-details">
                    <h3>{activeThread.subject}</h3>
                    <p>Updated {formatDateTime(activeThread.updated_at)}</p>
                  </div>
                </div>

                <div className="msg-message-area">
                  {threadLoading && <p>Loading thread...</p>}
                  {(activeThread.messages || []).map((message) => (
                    <div
                      key={message.id}
                      className={`msg-message ${message.sender_role === 'client' ? 'outgoing' : 'incoming'}`}
                    >
                      <div className="msg-message-content">
                        <div className="msg-message-bubble">
                          <p>{message.body}</p>
                        </div>
                        <div className="msg-message-meta">
                          <span>{message.sender_name}</span>
                          <span>{formatDateTime(message.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="msg-message-input-container">
                  <div className="msg-message-input">
                    <textarea
                      placeholder="Write your reply..."
                      rows="4"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                      className="msg-btn msg-btn-primary msg-send-btn"
                      onClick={handleSendReply}
                      disabled={sending || !newMessage.trim()}
                    >
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="msg-empty-state">
                <h3>No conversation selected</h3>
                <p>Pick a thread from the left or start a new one with the team.</p>
              </div>
            )}
          </section>

          <aside className="msg-conversation-details">
            <div className="msg-details-header">
              <h4>Thread Details</h4>
            </div>
            <div className="msg-details-content">
              <div className="msg-details-section">
                <h5>Summary</h5>
                <p><strong>Subject:</strong> {activeThread?.subject || 'No thread selected'}</p>
                <p><strong>Total messages:</strong> {activeThread?.messages?.length || 0}</p>
                <p><strong>Last update:</strong> {formatDateTime(activeThread?.updated_at)}</p>
              </div>
              <div className="msg-details-section">
                <h5>Quick Actions</h5>
                <div className="msg-user-quick-actions">
                  <Link href="/dashboard/Project-progress" className="msg-btn msg-btn-outline msg-full-width">
                    View Project Progress
                  </Link>
                  <Link href="/dashboard/Support" className="msg-btn msg-btn-outline msg-full-width">
                    Open Support Center
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
        {leftSidebarOpen && (
          <div className="mobile-sidebar-overlay active" onClick={() => setLeftSidebarOpen(false)} />
        )}
      </main>

      {showComposer && (
        <div className="msg-modal-overlay" onClick={() => setShowComposer(false)}>
          <div className="msg-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="msg-modal-header">
              <h3>Start a New Conversation</h3>
              <button className="msg-modal-close" onClick={() => setShowComposer(false)}>
                <i className="fas fa-times" />
              </button>
            </div>
            <form className="msg-modal-body" onSubmit={handleCreateThread}>
              <div className="msg-form-group">
                <label htmlFor="threadSubject">Subject</label>
                <input
                  id="threadSubject"
                  type="text"
                  value={newThreadSubject}
                  onChange={(e) => setNewThreadSubject(e.target.value)}
                  placeholder="What do you need help with?"
                />
              </div>
              <div className="msg-form-group">
                <label htmlFor="threadBody">Message</label>
                <textarea
                  id="threadBody"
                  rows="5"
                  value={newThreadBody}
                  onChange={(e) => setNewThreadBody(e.target.value)}
                  placeholder="Share the context DevMasters team should know."
                />
              </div>
              <div className="msg-modal-footer">
                <button
                  type="button"
                  className="msg-btn msg-btn-outline"
                  onClick={() => setShowComposer(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="msg-btn msg-btn-primary" disabled={creating}>
                  {creating ? 'Starting...' : 'Start Conversation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}