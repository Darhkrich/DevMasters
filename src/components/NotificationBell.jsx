'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/boemApi';
import './NotificationsBell.css';

function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications({ limit: 10 });
      const list = data.results || data;
      setNotifications(list);
      const unread = list.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load once
  useEffect(() => {
    loadNotifications();
  }, []);

  // Refresh when dropdown opens to show latest
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="nb-notification-bell" ref={dropdownRef}>
      <button className="nb-bell-button" onClick={() => setIsOpen(!isOpen)}>
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && <span className="nb-badge">{unreadCount}</span>}
      </button>
      {isOpen && (
        <div className="nb-notification-dropdown">
          <div className="nb-dropdown-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="nb-mark-all-read">
                Mark all as read
              </button>
            )}
          </div>
          <div className="nb-dropdown-list">
            {loading && <div className="nb-loading">Loading...</div>}
            {!loading && notifications.length === 0 && (
              <div className="nb-empty">No notifications</div>
            )}
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`nb-notification-item ${!notif.is_read ? 'nb-unread' : ''}`}
                onClick={() => handleMarkRead(notif.id)}
              >
                <Link href={notif.link || '#'} className="nb-notification-link">
                  <div className="nb-notification-title">{notif.title}</div>
                  <div className="nb-notification-message">{notif.message}</div>
                  <div className="nb-notification-time">{formatTimeAgo(notif.created_at)}</div>
                </Link>
              </div>
            ))}
          </div>
          <div className="nb-dropdown-footer">
            <Link href="/dashboard/notifications">View all</Link>
          </div>
        </div>
      )}
    </div>
  );
}