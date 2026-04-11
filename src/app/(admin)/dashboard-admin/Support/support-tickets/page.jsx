'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  fetchSupportTicket,
  fetchSupportTickets,
  getStoredUser,
  replyToSupportTicket,
  updateSupportTicket,
} from '@/lib/boemApi';
import './styles.css';

function formatDateTime(value) {
  if (!value) {
    return '';
  }

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function toLabel(value) {
  return value
    ?.replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || '';
}

function buildDisplayName(user) {
  if (!user) {
    return 'DevMasters Support';
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  return fullName || user.name || user.email || 'DevMasters Support';
}

export default function SupportTicketsDashboard() {
  const storedUser = getStoredUser();
  const senderName = buildDisplayName(storedUser);

  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [error, setError] = useState('');

  const filteredTickets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
      const matchesSearch =
        !query ||
        [
          ticket.subject,
          ticket.client_name,
          ticket.client_email,
          ticket.guest_name,
          ticket.guest_email,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));

      return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
    });
  }, [categoryFilter, priorityFilter, searchQuery, statusFilter, tickets]);

  const loadTickets = async (preferredTicketId = null) => {
    const payload = await fetchSupportTickets();
    const results = payload.results || [];
    setTickets(results);

    const nextTicketId =
      preferredTicketId ||
      (results.some((ticket) => ticket.id === selectedTicketId) ? selectedTicketId : results[0]?.id);

    if (nextTicketId) {
      setSelectedTicketId(nextTicketId);
    } else {
      setSelectedTicketId(null);
      setSelectedTicket(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const payload = await fetchSupportTickets();
        if (!isMounted) {
          return;
        }

        const results = payload.results || [];
        setTickets(results);
        setSelectedTicketId(results[0]?.id || null);
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'Unable to load support tickets.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedTicketId) {
      return undefined;
    }

    let isMounted = true;

    const loadDetail = async () => {
      setDetailLoading(true);
      try {
        const payload = await fetchSupportTicket(selectedTicketId);
        if (isMounted) {
          setSelectedTicket(payload);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'Unable to load the selected ticket.');
        }
      } finally {
        if (isMounted) {
          setDetailLoading(false);
        }
      }
    };

    loadDetail();

    return () => {
      isMounted = false;
    };
  }, [selectedTicketId]);

  const handleStatusChange = async (ticketId, status) => {
    setSaving(true);
    setError('');

    try {
      await updateSupportTicket(ticketId, { status });
      await loadTickets(ticketId);
      const payload = await fetchSupportTicket(ticketId);
      setSelectedTicket(payload);
    } catch (requestError) {
      setError(requestError.message || 'Unable to update the ticket status.');
    } finally {
      setSaving(false);
    }
  };

  const handleSendReply = async () => {
    const body = replyBody.trim();
    if (!body || !selectedTicketId) {
      return;
    }

    setReplying(true);
    setError('');

    try {
      await replyToSupportTicket(selectedTicketId, {
        sender_name: senderName,
        sender_role: 'admin',
        body,
      });
      setReplyBody('');
      await loadTickets(selectedTicketId);
      const payload = await fetchSupportTicket(selectedTicketId);
      setSelectedTicket(payload);
    } catch (requestError) {
      setError(requestError.message || 'Unable to reply to this ticket.');
    } finally {
      setReplying(false);
    }
  };

  return (
    <div className="admin-container">
      <main className="admin-main-content">
        <header className="admin-dashboard-header">
          <div className="admin-header-left">
            <h1>Support Tickets</h1>
            <p className="admin-welcome-text">Work through live support requests.</p>
          </div>
          <div className="admin-header-right">
            <Link href="/dashboard-admin/Support" className="primary-btn">
              Back to Support
            </Link>
          </div>
        </header>

        {error ? <div className="auth-error-message">{error}</div> : null}

        <div className="filters-bar">
          <div className="filter-group">
            <label htmlFor="ticketSearch">Search</label>
            <input
              id="ticketSearch"
              type="text"
              placeholder="Search subject or client"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="statusFilter">Status</label>
            <select id="statusFilter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="priorityFilter">Priority</label>
            <select id="priorityFilter" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="categoryFilter">Category</label>
            <select id="categoryFilter" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="all">All</option>
              <option value="general">General</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="project">Project</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>
        </div>

        <div className="admin-content-grid">
          <section className="admin-content-card">
            <div className="admin-card-header">
              <h2>Ticket Queue ({filteredTickets.length})</h2>
            </div>
            <div className="tickets-list">
              {loading ? <p>Loading tickets...</p> : null}
              {!loading && filteredTickets.length === 0 ? <p>No tickets match the current filters.</p> : null}
              {filteredTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  className={`ticket-item assigned ${ticket.id === selectedTicketId ? 'active-ticket' : ''}`}
                  onClick={() => setSelectedTicketId(ticket.id)}
                >
                  <div className="ticket-header">
                    <h3>{ticket.subject}</h3>
                    <span className={`ticket-status ${ticket.status}`}>{toLabel(ticket.status)}</span>
                  </div>
                  <div className="ticket-details">
                    <p>{ticket.client_name || ticket.guest_name || ticket.client_email || ticket.guest_email}</p>
                    <div className="ticket-meta">
                      <span>{toLabel(ticket.priority)} priority</span>
                      <span>{toLabel(ticket.category)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="admin-content-card">
            <div className="admin-card-header">
              <h2>Ticket Details</h2>
              {selectedTicket ? (
                <select
                  value={selectedTicket.status}
                  onChange={(event) => handleStatusChange(selectedTicket.id, event.target.value)}
                  disabled={saving}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              ) : null}
            </div>
            <div className="admin-card-body">
              {detailLoading ? <p>Loading details...</p> : null}
              {!detailLoading && !selectedTicket ? <p>Select a ticket to review it.</p> : null}
              {selectedTicket ? (
                <>
                  <div className="ticket-details">
                    <p><strong>Subject:</strong> {selectedTicket.subject}</p>
                    <p><strong>Client:</strong> {selectedTicket.client_name || selectedTicket.guest_name || selectedTicket.guest_email}</p>
                    <p><strong>Email:</strong> {selectedTicket.guest_email || selectedTicket.client_email || 'N/A'}</p>
                    <p><strong>Category:</strong> {toLabel(selectedTicket.category)}</p>
                    <p><strong>Priority:</strong> {toLabel(selectedTicket.priority)}</p>
                    <p><strong>Created:</strong> {formatDateTime(selectedTicket.created_at)}</p>
                    <p>{selectedTicket.description}</p>
                  </div>

                  <div className="client-messages">
                    {(selectedTicket.replies || []).map((reply) => (
                      <div key={reply.id} className="message-item">
                        <div className="message-sender">
                          <strong>{reply.sender_name}</strong>
                          <span className="message-time">{formatDateTime(reply.created_at)}</span>
                        </div>
                        <p className="message-preview">{reply.body}</p>
                      </div>
                    ))}
                    {selectedTicket.replies?.length === 0 ? <p>No replies yet.</p> : null}
                  </div>

                  <div className="form-group">
                    <label htmlFor="adminReply">Reply</label>
                    <textarea
                      id="adminReply"
                      rows="4"
                      value={replyBody}
                      onChange={(event) => setReplyBody(event.target.value)}
                      placeholder="Write your support response..."
                    />
                  </div>
                  <button className="primary-btn" onClick={handleSendReply} disabled={replying || !replyBody.trim()}>
                    {replying ? 'Sending...' : 'Send Reply'}
                  </button>
                </>
              ) : null}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
