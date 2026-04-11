'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  fetchClients,
  fetchSupportTickets,
  fetchThreads,
} from '@/lib/boemApi';
import './styles.css';

function formatDateTime(value) {
  if (!value) {
    return '';
  }

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function toStatusLabel(value) {
  return value
    ?.replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || '';
}

export default function SupportDashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [threads, setThreads] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const [ticketsPayload, threadsPayload, clientsPayload] = await Promise.all([
          fetchSupportTickets(),
          fetchThreads(),
          fetchClients(),
        ]);

        if (!isMounted) {
          return;
        }

        setTickets(ticketsPayload.results || []);
        setThreads(threadsPayload.results || []);
        setClients(clientsPayload.results || []);
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'Unable to load the support dashboard.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => ({
    openTickets: tickets.filter((ticket) => ['open', 'in-progress'].includes(ticket.status)).length,
    urgentTickets: tickets.filter((ticket) => ticket.priority === 'urgent').length,
    resolvedTickets: tickets.filter((ticket) => ['resolved', 'closed'].includes(ticket.status)).length,
    activeClients: clients.length,
  }), [clients.length, tickets]);

  const urgentTickets = useMemo(
    () =>
      tickets
        .filter((ticket) => ticket.priority === 'urgent' || ticket.status === 'open')
        .slice(0, 5),
    [tickets],
  );

  return (
    <div className="admin-container">
      <main className="admin-main-content">
        <header className="admin-dashboard-header">
          <div className="admin-header-left">
            <h1>Support Dashboard</h1>
            <p className="admin-welcome-text">Monitor tickets, threads, and client activity.</p>
          </div>
          <div className="admin-header-right">
            <div className="header-actions">
              <Link href="/dashboard-admin/Support/support-tickets" className="primary-btn">
                View Tickets
              </Link>
            </div>
          </div>
        </header>

        {error ? <div className="auth-error-message">{error}</div> : null}
        {loading ? <p>Loading support dashboard...</p> : null}

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-info">
              <h3>{stats.openTickets}</h3>
              <p>Open Tickets</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-info">
              <h3>{stats.urgentTickets}</h3>
              <p>Urgent Tickets</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-info">
              <h3>{threads.length}</h3>
              <p>Message Threads</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-info">
              <h3>{stats.activeClients}</h3>
              <p>Client Profiles</p>
            </div>
          </div>
        </div>

        <div className="admin-content-grid">
          <section className="admin-content-card">
            <div className="admin-card-header">
              <h2>Priority Queue</h2>
            </div>
            <div className="tickets-list">
              {urgentTickets.map((ticket) => (
                <div key={ticket.id} className="ticket-item critical">
                  <div className="ticket-header">
                    <h3>Ticket #{ticket.id}</h3>
                    <span className={`ticket-priority ${ticket.priority}`}>
                      {toStatusLabel(ticket.priority)}
                    </span>
                  </div>
                  <div className="ticket-details">
                    <p><strong>{ticket.subject}</strong></p>
                    <p>{ticket.client_name || ticket.guest_name || ticket.client_email || ticket.guest_email}</p>
                    <p>Updated {formatDateTime(ticket.updated_at || ticket.created_at)}</p>
                  </div>
                </div>
              ))}
              {!loading && urgentTickets.length === 0 ? <p>No urgent tickets right now.</p> : null}
            </div>
          </section>

          <section className="admin-content-card">
            <div className="admin-card-header">
              <h2>Recent Client Messages</h2>
            </div>
            <div className="client-messages">
              {threads.slice(0, 6).map((thread) => (
                <div key={thread.id} className="message-item">
                  <div className="message-sender">
                    <strong>{thread.client_name || thread.subject}</strong>
                    <span className="message-time">{formatDateTime(thread.updated_at)}</span>
                  </div>
                  <p className="message-preview">{thread.last_message?.body || 'No preview available'}</p>
                  <span className="message-ticket">{thread.subject}</span>
                </div>
              ))}
              {!loading && threads.length === 0 ? <p>No threads yet.</p> : null}
            </div>
          </section>

          <section className="admin-content-card">
            <div className="admin-card-header">
              <h2>Support Links</h2>
            </div>
            <div className="quick-actions-grid">
              <Link className="quick-admin-action-btn" href="/dashboard-admin/Support/support-tickets">
                Ticket List
              </Link>
              <Link className="quick-admin-action-btn" href="/dashboard-admin/Messages">
                Messages
              </Link>
              <Link className="quick-admin-action-btn" href="/dashboard-admin/clients">
                Clients
              </Link>
              <Link className="quick-admin-action-btn" href="/dashboard-admin/FilesReceive">
                Files
              </Link>
            </div>
          </section>

          <section className="admin-content-card">
            <div className="admin-card-header">
              <h2>Recently Created Tickets</h2>
            </div>
            <div className="assigned-tickets">
              {tickets.slice(0, 6).map((ticket) => (
                <div key={ticket.id} className="ticket-item assigned">
                  <div className="ticket-header">
                    <h3>{ticket.subject}</h3>
                    <span className={`ticket-status ${ticket.status}`}>
                      {toStatusLabel(ticket.status)}
                    </span>
                  </div>
                  <div className="ticket-details">
                    <p>{ticket.client_name || ticket.guest_name || ticket.client_email || ticket.guest_email}</p>
                    <div className="ticket-meta">
                      <span className="ticket-time">{toStatusLabel(ticket.category)}</span>
                      <span className="ticket-client-waiting">
                        {ticket.reply_count || 0} replies
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {!loading && tickets.length === 0 ? <p>No tickets yet.</p> : null}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
