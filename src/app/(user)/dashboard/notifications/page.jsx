'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '@/lib/boemApi';
import './notifications.css';

function formatDateTime(date) {
  return new Date(date).toLocaleString();
}

export default function NotificationsPage() {
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
    <div className="un-dashboard-container">
      <main className="un-main-content">
        {/* HEADER */}
        <div className="un-header">
          <div>
            <h1 className="un-title">Notifications</h1>
            <p className="un-subtitle">Stay updated with your project activity</p>
          </div>
          <button className="un-btn-outline" onClick={handleMarkAllRead}>
            Mark all as read
          </button>
        </div>

        {error && <div className="un-error">{error}</div>}

        {/* LIST */}
        <div className="un-list">
          {loading && <div className="un-state">Loading notifications...</div>}

          {!loading && notifications.length === 0 && (
            <div className="un-empty">
              <h3>No notifications</h3>
              <p>You’re all caught up. Updates will appear here.</p>
            </div>
          )}

          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`un-card ${!notif.is_read ? 'unread' : ''}`}
              onClick={() => handleMarkRead(notif.id)}
            >
              <Link href={notif.link || '#'} className="un-link">
                <div className="un-card-header">
                  <strong className="un-title-text">{notif.title}</strong>
                  <span className="un-time">
                    {formatDateTime(notif.created_at)}
                  </span>
                </div>
                <p className="un-message">{notif.message}</p>
                {!notif.is_read && <span className="un-badge" />}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}