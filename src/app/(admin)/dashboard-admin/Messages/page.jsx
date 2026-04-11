'use client';

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import Link from 'next/link';
import {
  fetchThreads,
  fetchThread,
  replyToThread,
  markThreadRead,
  updateThread,
  deleteThread,
  getStoredUser,
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

export default function AdminMessagesPage() {
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [activeThread, setActiveThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [pollingActive, setPollingActive] = useState(true);
  const messagesEndRef = useRef(null);

  const storedUser = getStoredUser();
  const adminName = storedUser?.first_name
    ? `${storedUser.first_name} ${storedUser.last_name}`.trim()
    : storedUser?.email || 'Admin';

  const filteredThreads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return threads;
    return threads.filter((thread) => {
      const preview = thread.last_message?.body || '';
      return [thread.subject, preview, thread.client_name, thread.client_email]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [searchQuery, threads]);

  const loadThreadList = useCallback(async (preferredThreadId = null) => {
    try {
      const payload = await fetchThreads();
      const results = payload.results || [];
      setThreads(results);
      setActiveThreadId((previousId) => {
        if (preferredThreadId && results.some((thread) => thread.id === preferredThreadId)) {
          return preferredThreadId;
        }
        if (!previousId && results.length > 0) {
          return results[0].id;
        }
        if (previousId && !results.some((thread) => thread.id === previousId)) {
          return results[0]?.id || null;
        }
        return previousId;
      });
      return results;
    } catch (err) {
      setError(err.message || 'Unable to load conversations.');
      return [];
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const results = await loadThreadList();
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, [loadThreadList]);

  useEffect(() => {
    if (!activeThreadId) return;
    let mounted = true;
    const loadActive = async () => {
      setThreadLoading(true);
      try {
        const thread = await fetchThread(activeThreadId, 'admin');
        if (!mounted) return;
        setActiveThread(thread);

        if (thread.unread_count > 0) {
          await markThreadRead(activeThreadId, { sender_role: 'client' });
          setThreads((prev) =>
            prev.map((t) =>
              t.id === activeThreadId ? { ...t, unread_count: 0 } : t
            )
          );
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to open thread.');
      } finally {
        if (mounted) setThreadLoading(false);
      }
    };
    loadActive();
    return () => { mounted = false; };
  }, [activeThreadId]);

  useEffect(() => {
    if (!activeThreadId || !pollingActive) return;
    const intervalId = setInterval(async () => {
      try {
        const updated = await fetchThread(activeThreadId, 'admin');
        if (JSON.stringify(updated.messages) !== JSON.stringify(activeThread?.messages)) {
          setActiveThread(updated);
        }
      } catch {}
    }, 5000);
    return () => clearInterval(intervalId);
  }, [activeThreadId, pollingActive, activeThread?.messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  const handleSendReply = async () => {
    const body = newMessage.trim();
    if (!body || !activeThreadId) return;
    setSending(true);
    try {
      await replyToThread(activeThreadId, {
        sender_name: adminName,
        sender_role: 'admin',
        body,
      });
      setNewMessage('');
      await loadThreadList(activeThreadId);
      const updated = await fetchThread(activeThreadId, 'admin');
      setActiveThread(updated);
    } catch (err) {
      setError(err.message || 'Unable to send reply.');
    } finally {
      setSending(false);
    }
  };

  const handleArchive = async (threadId, currentArchived) => {
    await updateThread(threadId, { is_archived: !currentArchived });
    await loadThreadList(threadId);
  };

  const handleDelete = async (threadId) => {
    if (!confirm('Delete this conversation permanently?')) return;
    await deleteThread(threadId);
    await loadThreadList();
    if (activeThreadId === threadId) setActiveThreadId(null);
  };

  return (
    <div className="am-container">
      <main className="am-main-content">
        <div className="am-header">
          <h1>Support Conversations</h1>
        </div>

        {error && <div className="am-error">{error}</div>}

        <div className="am-layout">
          {/* SIDEBAR */}
          <aside className="am-sidebar">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="am-search"
            />

            <div className="am-thread-list">
              {loading && <div className="am-loading">Loading conversations...</div>}
              {!loading && filteredThreads.length === 0 && (
                <div className="am-empty-state">No conversations found.</div>
              )}
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  className={`am-thread-item ${thread.id === activeThreadId ? 'active' : ''}`}
                  onClick={() => setActiveThreadId(thread.id)}
                >
                  <strong>{thread.subject}</strong>
                  <p>{thread.client_name || 'Unknown Client'}</p>
                  {thread.unread_count > 0 && <span className="am-unread-badge">{thread.unread_count}</span>}
                </div>
              ))}
            </div>
          </aside>

          {/* THREAD */}
          <section className="am-thread">
            {activeThread ? (
              <>
                <div className="am-thread-header">
                  <h3>{activeThread.subject}</h3>
                </div>

                <div className="am-messages">
                  {threadLoading && <div className="am-loading">Loading messages...</div>}
                  {activeThread.messages?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`am-message ${msg.sender_role === 'admin' ? 'outgoing' : 'incoming'}`}
                    >
                      <div className="am-message-bubble">
                        <p>{msg.body}</p>
                      </div>
                      <div className="am-message-meta">
                        <span>{msg.sender_name}</span>
                        <span>{formatDateTime(msg.created_at)}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="am-reply">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write a reply..."
                  />
                  <button onClick={handleSendReply} disabled={sending || !newMessage.trim()}>
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </>
            ) : (
              <div className="am-empty">Select a conversation to view messages.</div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
