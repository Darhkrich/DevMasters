'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  createSupportTicket,
  fetchOrders,
  fetchSupportTicket,
  fetchSupportTickets,
  getStoredUser,
  replyToSupportTicket,
  updateSupportTicket,
} from '@/lib/boemApi';
import './support.css';

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

function toStatusLabel(status) {
  return status
    ?.replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || '';
}

function buildDisplayName(user) {
  if (!user) return 'DevMasters Client';
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  return fullName || user.name || user.email || 'DevMasters Client';
}

export default function SupportPage() {
  const storedUser = getStoredUser();
  const senderName = buildDisplayName(storedUser);

  const [tickets, setTickets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replying, setReplying] = useState(false);
  const [closingTicket, setClosingTicket] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [form, setForm] = useState({
    subject: '',
    category: 'general',
    priority: 'normal',
    orderId: '',
    description: '',
  });

  const stats = useMemo(() => ({
    open: tickets.filter((ticket) => ['open', 'in-progress'].includes(ticket.status)).length,
    resolved: tickets.filter((ticket) => ['resolved', 'closed'].includes(ticket.status)).length,
    urgent: tickets.filter((ticket) => ticket.priority === 'urgent').length,
  }), [tickets]);

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

    return results;
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const [ticketsPayload, ordersPayload] = await Promise.all([
          fetchSupportTickets(),
          fetchOrders(),
        ]);

        if (!isMounted) return;

        const ticketResults = ticketsPayload.results || [];
        setTickets(ticketResults);
        setOrders(ordersPayload.results || []);
        setSelectedTicketId(ticketResults[0]?.id || null);
      } catch (requestError) {
        if (!isMounted) return;
        setError(requestError.message || 'Unable to load your support center.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedTicketId) return;

    let isMounted = true;

    const loadSelectedTicket = async () => {
      setDetailLoading(true);
      try {
        const payload = await fetchSupportTicket(selectedTicketId);
        if (isMounted) setSelectedTicket(payload);
      } catch (requestError) {
        if (isMounted) setError(requestError.message || 'Unable to load this support ticket.');
      } finally {
        if (isMounted) setDetailLoading(false);
      }
    };

    loadSelectedTicket();

    return () => {
      isMounted = false;
    };
  }, [selectedTicketId]);

  const handleCreateTicket = async (event) => {
    event.preventDefault();

    const subject = form.subject.trim();
    const description = form.description.trim();

    if (!subject || !description) {
      setError('Please fill in the subject and description for your ticket.');
      return;
    }

    const selectedOrder = orders.find((order) => String(order.id) === form.orderId);
    const descriptionWithProject = selectedOrder
      ? `[Project ${selectedOrder.reference}] ${description}`
      : description;

    setSubmitting(true);
    setError('');

    try {
      const payload = await createSupportTicket({
        subject,
        category: form.category,
        priority: form.priority,
        description: descriptionWithProject,
      });
      setForm({
        subject: '',
        category: 'general',
        priority: 'normal',
        orderId: '',
        description: '',
      });
      setShowCreateModal(false);
      await loadTickets(payload.id);
    } catch (requestError) {
      setError(requestError.message || 'Unable to create a new support ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async () => {
    const body = replyBody.trim();
    if (!body || !selectedTicketId) return;

    setReplying(true);
    setError('');

    try {
      await replyToSupportTicket(selectedTicketId, {
        sender_name: senderName,
        sender_role: 'client',
        body,
      });
      setReplyBody('');
      await loadTickets(selectedTicketId);
      const detail = await fetchSupportTicket(selectedTicketId);
      setSelectedTicket(detail);
    } catch (requestError) {
      setError(requestError.message || 'Unable to reply to this support ticket.');
    } finally {
      setReplying(false);
    }
  };

  const handleResolveTicket = async () => {
    if (!selectedTicketId) return;

    setClosingTicket(true);
    setError('');

    try {
      await updateSupportTicket(selectedTicketId, { status: 'resolved' });
      await loadTickets(selectedTicketId);
      const detail = await fetchSupportTicket(selectedTicketId);
      setSelectedTicket(detail);
    } catch (requestError) {
      setError(requestError.message || 'Unable to update this ticket.');
    } finally {
      setClosingTicket(false);
    }
  };

  return (
    <div className="sp-dashboard-container">
      <main className="sp-main-content">
        <header className="sp-top-header">
          <div className="sp-header-left">
            <div className="sp-breadcrumb">
              <Link href="/dashboard">Dashboard</Link>
              <i className="fas fa-chevron-right" />
              <span>Support Center</span>
            </div>
          </div>
          <div className="sp-header-right">
            <div className="sp-header-actions">
              <button className="sp-btn sp-btn-primary" onClick={() => setShowCreateModal(true)}>
                New Ticket
              </button>
            </div>
          </div>
        </header>

        {error ? <div className="sp-error-message">{error}</div> : null}

        <div className="sp-content-area">
          <div className="sp-stats-grid">
            <div className="sp-stat-card">
              <div className="sp-stat-info">
                <h3>{stats.open}</h3>
                <p>Open Tickets</p>
              </div>
            </div>
            <div className="sp-stat-card">
              <div className="sp-stat-info">
                <h3>{stats.urgent}</h3>
                <p>Urgent Tickets</p>
              </div>
            </div>
            <div className="sp-stat-card">
              <div className="sp-stat-info">
                <h3>{stats.resolved}</h3>
                <p>Resolved Tickets</p>
              </div>
            </div>
            <div className="sp-stat-card">
              <div className="sp-stat-info">
                <h3>{orders.length}</h3>
                <p>Active Orders</p>
              </div>
            </div>
          </div>

          <div className="sp-content-columns">
            <section className="sp-card">
              <div className="sp-card-header">
                <h3>Your Tickets</h3>
              </div>
              <div className="sp-card-body">
                {loading ? <p>Loading tickets...</p> : null}
                {!loading && tickets.length === 0 ? (
                  <p>No tickets yet. Create one if you need help from DevMasters Team.</p>
                ) : null}
                <div className="sp-tickets-list">
                  {tickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      type="button"
                      className={`sp-ticket-item ${ticket.id === selectedTicketId ? 'active' : ''}`}
                      onClick={() => setSelectedTicketId(ticket.id)}
                    >
                      <div className="sp-ticket-header">
                        <span className="sp-ticket-id">Ticket #{ticket.id}</span>
                        <span className={`sp-ticket-status ${ticket.status}`}>
                          {toStatusLabel(ticket.status)}
                        </span>
                      </div>
                      <div className="sp-ticket-content">
                        <h5>{ticket.subject}</h5>
                        <p>{ticket.client_email || storedUser?.email}</p>
                      </div>
                      <div className="sp-ticket-meta">
                        <span>{toStatusLabel(ticket.priority)} priority</span>
                        <span>{ticket.reply_count || 0} replies</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="sp-card">
              <div className="sp-card-header">
                <h3>Ticket Conversation</h3>
                {selectedTicket && ['open', 'in-progress'].includes(selectedTicket.status) ? (
                  <button
                    className="sp-btn sp-btn-outline sp-btn-sm"
                    onClick={handleResolveTicket}
                    disabled={closingTicket}
                  >
                    {closingTicket ? 'Updating...' : 'Mark Resolved'}
                  </button>
                ) : null}
              </div>
              <div className="sp-card-body">
                {detailLoading ? <p>Loading ticket...</p> : null}
                {!detailLoading && !selectedTicket ? (
                  <p>Select a ticket to read the conversation.</p>
                ) : null}
                {selectedTicket ? (
                  <>
                    <div className="sp-ticket-detail-summary">
                      <h4>{selectedTicket.subject}</h4>
                      <p>{selectedTicket.description}</p>
                      <p>
                        <strong>Status:</strong> {toStatusLabel(selectedTicket.status)}{' '}
                        <strong>Category:</strong> {toStatusLabel(selectedTicket.category)}
                      </p>
                      <p><strong>Created:</strong> {formatDateTime(selectedTicket.created_at)}</p>
                    </div>

                    <div className="sp-activity-feed">
                      {(selectedTicket.replies || []).map((reply) => (
                        <div key={reply.id} className="sp-activity-item">
                          <div className="sp-activity-content">
                            <p><strong>{reply.sender_name}</strong> {reply.body}</p>
                            <span>{formatDateTime(reply.created_at)}</span>
                          </div>
                        </div>
                      ))}
                      {selectedTicket.replies?.length === 0 ? (
                        <p>No replies yet. Team will reply here.</p>
                      ) : null}
                    </div>

                    <div className="sp-message-input-container">
                      <div className="sp-message-input">
                        <textarea
                          rows="4"
                          placeholder="Reply to this ticket..."
                          value={replyBody}
                          onChange={(event) => setReplyBody(event.target.value)}
                        />
                        <button
                          className="sp-btn sp-btn-primary sp-send-btn"
                          onClick={handleSendReply}
                          disabled={replying || !replyBody.trim()}
                        >
                          {replying ? 'Sending...' : 'Send Reply'}
                        </button>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </section>

            <section className="sp-card">
              <div className="sp-card-header">
                <h3>Helpful Links</h3>
              </div>
              <div className="sp-card-body">
                <div className="sp-resources-list">
                  <Link href="/dashboard/Project-progress" className="sp-resource-item">
                    <div className="sp-resource-content">
                      <span className="sp-resource-title">Project Progress</span>
                      <span className="sp-resource-desc">Track your delivery status</span>
                    </div>
                  </Link>
                  <Link href="/dashboard/UploadFile" className="sp-resource-item">
                    <div className="sp-resource-content">
                      <span className="sp-resource-title">Upload Files</span>
                      <span className="sp-resource-desc">Send assets and project documents</span>
                    </div>
                  </Link>
                  <Link href="/dashboard/Messages" className="sp-resource-item">
                    <div className="sp-resource-content">
                      <span className="sp-resource-title">Messages</span>
                      <span className="sp-resource-desc">Talk directly with DevMasters team</span>
                    </div>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {showCreateModal ? (
        <div className="sp-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="sp-modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="sp-modal-header">
              <h3>Create Support Ticket</h3>
              <button className="sp-icon-btn sp-modal-close" onClick={() => setShowCreateModal(false)}>
                <i className="fas fa-times" />
              </button>
            </div>
            <form className="sp-modal-body" onSubmit={handleCreateTicket}>
              <div className="sp-ticket-form">
                <div className="sp-form-group">
                  <label htmlFor="ticketSubject">Subject</label>
                  <input
                    id="ticketSubject"
                    type="text"
                    value={form.subject}
                    onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                    placeholder="Short summary of the issue"
                  />
                </div>
                <div className="sp-form-row">
                  <div className="sp-form-group">
                    <label htmlFor="ticketCategory">Category</label>
                    <select
                      id="ticketCategory"
                      value={form.category}
                      onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                    >
                      <option value="general">General</option>
                      <option value="technical">Technical</option>
                      <option value="billing">Billing</option>
                      <option value="project">Project</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                  <div className="sp-form-group">
                    <label htmlFor="ticketPriority">Priority</label>
                    <select
                      id="ticketPriority"
                      value={form.priority}
                      onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="sp-form-group">
                  <label htmlFor="ticketOrder">Related Order</label>
                  <select
                    id="ticketOrder"
                    value={form.orderId}
                    onChange={(event) => setForm((current) => ({ ...current, orderId: event.target.value }))}
                  >
                    <option value="">Not tied to a specific order</option>
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.reference} - {order.status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sp-form-group">
                  <label htmlFor="ticketDescription">Description</label>
                  <textarea
                    id="ticketDescription"
                    rows="5"
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    placeholder="Tell DevMasters what happened, what you expected, and what you need."
                  />
                </div>
              </div>
              <div className="sp-modal-footer">
                <button
                  type="button"
                  className="sp-btn sp-btn-outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sp-btn sp-btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}