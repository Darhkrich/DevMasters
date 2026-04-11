'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchOrdersAdmin, updateOrderAdmin, deleteOrderAdmin } from '@/lib/boemApi';
import './order.css';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: '', search: '' });
  const router = useRouter();

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchOrdersAdmin(filters);
      setOrders(data.results || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderAdmin(orderId, { status: newStatus });
      loadOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (orderId) => {
    if (!confirm('Delete this order? This action cannot be undone.')) return;
    try {
      await deleteOrderAdmin(orderId);
      loadOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="ao-container">
      <main className="ao-main-content">
        {/* HEADER */}
        <div className="ao-header">
          <h1>Orders Management</h1>
          <button
            onClick={() => router.push('/dashboard-admin/orders/new')}
            className="ao-btn-primary"
          >
            + Create Manual Order
          </button>
        </div>

        {/* FILTERS */}
        <div className="ao-filters">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="ao-select"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="in_progress">In Progress</option>
            <option value="awaiting_client">Awaiting Client</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            type="text"
            placeholder="Search by reference, name, email"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="ao-search"
          />
        </div>

        {/* STATES */}
        {loading && <div className="ao-state">Loading orders...</div>}
        {error && <div className="ao-error">Error: {error}</div>}

        {/* LIST */}
        <div className="ao-list">
          {orders.map((order) => (
            <div key={order.id} className="ao-card">
              <div className="ao-card-left">
                <strong className="ao-order-ref">Order #{order.reference}</strong>
                <div className="ao-meta">
                  <div>{order.client_name} &lt;{order.client_email}&gt;</div>
                  <div>Total: ${order.total_amount} {order.currency}</div>
                  <div>Items: {order.item_count}</div>
                  <div>Placed: {new Date(order.created_at).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="ao-actions">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="ao-select ao-select-small"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="awaiting_client">Awaiting Client</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => router.push(`/dashboard-admin/orders/${order.id}`)}
                  className="ao-btn-secondary"
                >
                  View
                </button>

                <button
                  onClick={() => handleDelete(order.id)}
                  className="ao-btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
