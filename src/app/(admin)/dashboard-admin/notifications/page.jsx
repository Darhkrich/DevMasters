// app/(admin)/dashboard-admin/notifications/page.jsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/boemApi';
import './notifications.css';

function formatDateTime(date) {
  return new Date(date).toLocaleString();
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data.results || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="an-container">
      <main className="an-main-content">
        <div className="an-header">
          <h1>Notifications</h1>
          <button className="an-btn-outline" onClick={handleMarkAllRead}>
            Mark all as read
          </button>
        </div>

        {error && <div className="an-error">{error}</div>}

        <div className="an-list">
          {loading && <div className="an-state">Loading notifications...</div>}
          {!loading && notifications.length === 0 && (
            <div className="an-empty">No notifications yet.</div>
          )}
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`an-card ${!notif.is_read ? 'unread' : ''}`}
              onClick={() => handleMarkRead(notif.id)}
            >
              <Link href={notif.link || '#'} className="an-link">
                <div className="an-card-header">
                  <strong>{notif.title}</strong>
                  <span className="an-time">{formatDateTime(notif.created_at)}</span>
                </div>
                <div className="an-message">{notif.message}</div>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}