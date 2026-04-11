'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchOrder } from '@/lib/boemApi';
import './orders-id.css';

export default function UserOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await fetchOrder(id);
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadOrder();
  }, [id]);

  if (loading) return <div className="uod-container"><div className="uod-state">Loading order...</div></div>;
  if (error) return <div className="uod-container"><div className="uod-state error">Error: {error}</div></div>;
  if (!order) return <div className="uod-container"><div className="uod-state">Order not found.</div></div>;

  return (
    <div className="uod-container">

      {/* HEADER */}
      <div className="uod-header">
        <div>
          <h1 className="uod-title">Order #{order.reference}</h1>
          <p className="uod-subtitle">Detailed overview of your request</p>
        </div>

        <span className={`uod-status uod-status-${order.status}`}>
          {order.status}
        </span>
      </div>

      {/* MAIN GRID */}
      <div className="uod-grid">

        {/* LEFT SIDE */}
        <div className="uod-main">

          {/* CLIENT INFO */}
          <div className="uod-card">
            <h3 className="uod-card-title">Client Information</h3>

            <div className="uod-info">
              <div><span>Name</span><strong>{order.client_name}</strong></div>
              <div><span>Email</span><strong>{order.client_email}</strong></div>
              {order.client_company && (
                <div><span>Company</span><strong>{order.client_company}</strong></div>
              )}
            </div>
          </div>

          {/* PROJECT DETAILS */}
          {(order.project_details || order.notes) && (
            <div className="uod-card">
              <h3 className="uod-card-title">Project Brief</h3>

              {order.project_details && (
                <p className="uod-text">{order.project_details}</p>
              )}

              {order.notes && (
                <div className="uod-note">
                  <strong>Notes:</strong>
                  <p>{order.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* ITEMS */}
          <div className="uod-card">
            <h3 className="uod-card-title">Order Items</h3>

            <div className="uod-items">
              {order.items.map((item, idx) => (
                <div key={idx} className="uod-item">
                  <div className="uod-item-top">
                    <strong>{item.title}</strong>
                    <span className="uod-item-type">{item.item_type}</span>
                  </div>

                  <div className="uod-item-meta">
                    {item.price && <span>${item.price}</span>}
                    {item.quantity > 1 && <span>x {item.quantity}</span>}
                  </div>

                  {item.metadata?.description && (
                    <p className="uod-item-desc">{item.metadata.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT SIDE (SUMMARY) */}
        <div className="uod-sidebar">

          <div className="uod-card sticky">
            <h3 className="uod-card-title">Order Summary</h3>

            <div className="uod-summary">
              <div><span>Placed</span><strong>{new Date(order.created_at).toLocaleString()}</strong></div>
              <div><span>Total</span><strong>${order.total_amount} {order.currency}</strong></div>
              {order.timeline && (
                <div><span>Timeline</span><strong>{order.timeline}</strong></div>
              )}
              <div><span>Items</span><strong>{order.items.length}</strong></div>
            </div>

            <Link href="/dashboard" className="uod-btn-secondary">
              ← Back to Orders
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}