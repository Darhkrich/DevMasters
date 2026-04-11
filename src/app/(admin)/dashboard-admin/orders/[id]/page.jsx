'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchOrder, updateOrderAdmin } from '@/lib/boemApi';
import './order-id.css';

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await fetchOrder(id);
        setOrder(data);
        setStatus(data.status);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!status || status === order?.status) return;
    setUpdating(true);
    try {
      const updated = await updateOrderAdmin(id, { status });
      setOrder(updated);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="aod-container">Loading order...</div>;
  if (error) return <div className="aod-container">Error: {error}</div>;
  if (!order) return <div className="aod-container">Order not found.</div>;

  return (
    <div className="aod-container">
      <main className="aod-main-content">
        <div className="aod-header">
          <h1>Order #{order.reference}</h1>
          <Link href="/dashboard-admin/orders" className="aod-btn-secondary">
            ← Back to Orders
          </Link>
        </div>

        <div className="aod-card">
          <div className="aod-card-header">
            <h3>Order Details</h3>
            <div className="aod-status-actions">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="aod-select"
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="in_progress">In Progress</option>
                <option value="awaiting_client">Awaiting Client</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || status === order.status}
                className="aod-btn-primary"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          <div className="aod-form-grid">
            <div><strong>Client:</strong> {order.client_name}</div>
            <div><strong>Email:</strong> {order.client_email}</div>
            {order.client_company && <div><strong>Company:</strong> {order.client_company}</div>}
            <div><strong>Placed on:</strong> {new Date(order.created_at).toLocaleString()}</div>
            <div><strong>Last updated:</strong> {new Date(order.updated_at).toLocaleString()}</div>
            <div><strong>Total:</strong> ${order.total_amount} {order.currency}</div>
            {order.timeline && <div><strong>Timeline:</strong> {order.timeline}</div>}
            {order.budget_min && <div><strong>Budget min:</strong> ${order.budget_min}</div>}
            {order.budget_max && <div><strong>Budget max:</strong> ${order.budget_max}</div>}
          </div>

          {order.project_details && (
            <div className="aod-note">
              <strong>Project details:</strong>
              <p>{order.project_details}</p>
            </div>
          )}

          {order.notes && (
            <div className="aod-note">
              <strong>Notes:</strong>
              <p>{order.notes}</p>
            </div>
          )}

          {order.admin_notes && (
            <div className="aod-note">
              <strong>Admin notes:</strong>
              <p>{order.admin_notes}</p>
            </div>
          )}
        </div>

        <div className="aod-card">
          <h3>Items</h3>
          <div className="aod-items-list">
            {order.items.map((item, idx) => (
              <div key={idx} className="aod-item-card">
                <div><strong>{item.title}</strong> ({item.item_type})</div>
                {item.item_id && <div>ID: {item.item_id}</div>}
                {item.price && <div>Price: ${item.price}</div>}
                <div>Quantity: {item.quantity}</div>
                {item.metadata && Object.keys(item.metadata).length > 0 && (
                  <details className="aod-metadata">
                    <summary>Metadata</summary>
                    <pre>{JSON.stringify(item.metadata, null, 2)}</pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>

        {order.activities?.length > 0 && (
          <div className="aod-card">
            <h3>Activity Log</h3>
            <ul className="aod-activity-list">
              {order.activities.map(act => (
                <li key={act.id} className="aod-activity-item">
                  <strong>{new Date(act.created_at).toLocaleString()}</strong> – {act.message}
                  {act.created_by && <span> (by {act.created_by})</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}