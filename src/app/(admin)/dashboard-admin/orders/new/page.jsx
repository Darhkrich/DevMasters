'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createOrder } from '@/lib/boemApi';
import './pricing.css'; // reuse admin styles

export default function CreateOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Client details
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');

  // Project details
  const [projectDetails, setProjectDetails] = useState('');
  const [timeline, setTimeline] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [notes, setNotes] = useState('');

  // Items
  const [items, setItems] = useState([
    { item_type: 'service', item_id: '', title: '', price: '', quantity: 1 }
  ]);

  const handleAddItem = () => {
    setItems([
      ...items,
      { item_type: 'service', item_id: '', title: '', price: '', quantity: 1 }
    ]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate
    if (!clientName.trim() || !clientEmail.trim()) {
      setError('Client name and email are required.');
      setLoading(false);
      return;
    }

    // Prepare items (remove empty rows)
    const validItems = items.filter(item => item.title.trim());
    if (validItems.length === 0) {
      setError('At least one order item with a title is required.');
      setLoading(false);
      return;
    }

    const payload = {
      client_name: clientName.trim(),
      client_email: clientEmail.trim(),
      client_company: clientCompany.trim(),
      project_details: projectDetails.trim(),
      timeline: timeline.trim(),
      budget_min: budgetMin ? parseFloat(budgetMin) : null,
      budget_max: budgetMax ? parseFloat(budgetMax) : null,
      notes: notes.trim(),
      items: validItems.map(item => ({
        item_type: item.item_type || 'custom',
        item_id: item.item_id || '',
        title: item.title,
        price: item.price ? parseFloat(item.price) : null,
        quantity: item.quantity ? parseInt(item.quantity) : 1,
        metadata: {}
      }))
    };

    try {
      const response = await createOrder(payload);
      router.push(`/dashboard-admin/orders/${response.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-pricing-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Create New Order</h1>
        <Link href="/dashboard-admin/orders" className="secondary-btn">← Back to Orders</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form-card">
        <h3>Client Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Client Name *</label>
            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Client Email *</label>
            <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Company (optional)</label>
            <input type="text" value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} />
          </div>
        </div>

        <h3>Project Details</h3>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Project Details</label>
            <textarea rows="4" value={projectDetails} onChange={(e) => setProjectDetails(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Timeline</label>
            <input type="text" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g., 2 weeks" />
          </div>
          <div className="form-group">
            <label>Budget Min</label>
            <input type="number" step="0.01" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Budget Max</label>
            <input type="number" step="0.01" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} />
          </div>
          <div className="form-group full-width">
            <label>Notes</label>
            <textarea rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <h3>Order Items</h3>
        <div className="items-list" style={{ gridTemplateColumns: '1fr' }}>
          {items.map((item, idx) => (
            <div key={idx} className="item-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 0.5fr 0.5fr' }}>
                <div className="form-group">
                  <label>Type</label>
                  <select value={item.item_type} onChange={(e) => handleItemChange(idx, 'item_type', e.target.value)}>
                    <option value="service">Service</option>
                    <option value="template">Template</option>
                    <option value="package">Package</option>
                    <option value="ai">AI Automation</option>
                    <option value="bundle">Bundle</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Item ID (optional)</label>
                  <input type="text" value={item.item_id} onChange={(e) => handleItemChange(idx, 'item_id', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Title *</label>
                  <input type="text" value={item.title} onChange={(e) => handleItemChange(idx, 'title', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input type="number" step="0.01" value={item.price} onChange={(e) => handleItemChange(idx, 'price', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)} />
                </div>
              </div>
              {items.length > 1 && (
                <button type="button" className="btn-sm danger" onClick={() => handleRemoveItem(idx)} style={{ marginTop: '0.5rem' }}>
                  Remove Item
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" className="btn-sm" onClick={handleAddItem} style={{ marginBottom: '1rem' }}>
          + Add Item
        </button>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
}