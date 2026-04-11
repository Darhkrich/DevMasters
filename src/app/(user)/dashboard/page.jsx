'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchMyOrders } from '@/lib/boemApi';
import ThemeToggle from '@/components/common/ThemeToggle';
import './orders.css';

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchMyOrders();
        setOrders(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  if (loading) {
    return <div className="uo-container"><div className="uo-state">Loading your dashboard...</div></div>;
  }

  if (error) {
    return <div className="uo-container"><div className="uo-state error">Error: {error}</div></div>;
  }

  return (
    <div className="uo-dashboard-container">
      <main className="uo-main-content">
        {/* HEADER */}
        <div className="uo-header">
          <div>
            <h1 className="uo-title">Orders Overview</h1>
            <p className="uo-subtitle">
              Monitor your service requests, track progress, and manage your activities
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* SUMMARY */}
        <div className="uo-summary">
          <div className="uo-summary-card">
            <span>Total Orders</span>
            <strong>{totalOrders}</strong>
          </div>

          <div className="uo-summary-card">
            <span>Pending</span>
            <strong>{pendingOrders}</strong>
          </div>

          <div className="uo-summary-card">
            <span>Completed</span>
            <strong>{completedOrders}</strong>
          </div>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="uo-empty">
            <h3>No orders yet</h3>
            <p>Start by exploring available services and placing your first request.</p>
            <Link href="/services" className="uo-btn-primary">
              Browse Services
            </Link>
          </div>
        ) : (
          <>
            {/* LIST */}
            <div className="uo-grid">
              {orders.map(order => (
                <div key={order.id} className="uo-card">
                  <div className="uo-card-header">
                    <strong className="uo-order-id">#{order.reference}</strong>
                    <span className={`uo-status uo-status-${order.status}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="uo-card-body">
                    <div className="uo-meta">
                      <span>Date</span>
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="uo-meta">
                      <span>Total</span>
                      <span>${order.total_amount} {order.currency}</span>
                    </div>

                    <div className="uo-meta">
                      <span>Items</span>
                      <span>{order.item_count}</span>
                    </div>
                  </div>

                  <Link href={`/dashboard/${order.id}`} className="uo-link">
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}