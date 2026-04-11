'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { fetchClients, fetchSupportTickets } from '@/lib/boemApi';
import './styles.css';

export default function SupportClientPage() {
  const [clients, setClients] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [clientsPayload, ticketsPayload] = await Promise.all([
          fetchClients(),
          fetchSupportTickets(),
        ]);

        if (!isMounted) {
          return;
        }

        setClients(clientsPayload.results || []);
        setTickets(ticketsPayload.results || []);
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'Unable to load  clients.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredClients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return clients;
    }

    return clients.filter((client) =>
      [client.name, client.email, client.company]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [clients, searchQuery]);

  const ticketCountByEmail = useMemo(() => {
    const counts = new Map();
    tickets.forEach((ticket) => {
      const email = ticket.client_email || ticket.guest_email;
      if (email) {
        counts.set(email.toLowerCase(), (counts.get(email.toLowerCase()) || 0) + 1);
      }
    });
    return counts;
  }, [tickets]);

  return (
    <div className="admin-container">
      <main className="admin-main-content">
        <header className="admin-dashboard-header">
          <div className="admin-header-left">
            <h1>Support Clients</h1>
            <p className="admin-welcome-text">A support-focused view of  client relationships.</p>
          </div>
          <div className="admin-header-right">
            <Link href="/dashboard-admin/clients" className="primary-btn">
              Full Client Directory
            </Link>
          </div>
        </header>

        {error ? <div className="auth-error-message">{error}</div> : null}

        <div className="filters-bar">
          <div className="filter-group">
            <label htmlFor="clientSearch">Search</label>
            <input
              id="clientSearch"
              type="text"
              placeholder="Search clients"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>

        <div className="admin-content-card">
          <div className="admin-card-header">
            <h2>Clients ({filteredClients.length})</h2>
          </div>
          <div className="clients-list">
            {loading ? <p>Loading clients...</p> : null}
            {!loading && filteredClients.length === 0 ? <p>No clients found.</p> : null}
            {filteredClients.map((client) => (
              <div key={client.id} className="client-card">
                <div className="client-info">
                  <div className="client-main">
                    <h3>{client.name}</h3>
                    <p className="client-email">{client.email}</p>
                    <div className="client-tags">
                      <span className="client-tag package">{client.plan || 'starter'}</span>
                      {client.company ? <span className="client-tag new">{client.company}</span> : null}
                    </div>
                  </div>
                  <div className="client-stats">
                    <div className="client-stat">
                      <strong>{client.active_projects || 0}</strong>
                      <span>Projects</span>
                    </div>
                    <div className="client-stat">
                      <strong>{ticketCountByEmail.get(client.email.toLowerCase()) || 0}</strong>
                      <span>Tickets</span>
                    </div>
                    <div className="client-stat">
                      <strong>{client.credits || 0}</strong>
                      <span>Credits</span>
                    </div>
                  </div>
                </div>
                <div className="client-actions">
                  <Link className="admin-action-btn primary" href="/dashboard-admin/Messages">
                    Message
                  </Link>
                  <Link className="admin-action-btn secondary" href="/dashboard-admin/Support/support-tickets">
                    Tickets
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
