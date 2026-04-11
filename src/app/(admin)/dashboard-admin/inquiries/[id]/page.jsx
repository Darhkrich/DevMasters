'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchInquiry, updateInquiryAdmin, deleteInquiryAdmin } from '@/lib/boemApi';
import './inquiries-id.css';

export default function AdminInquiryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadInquiry = async () => {
      try {
        const data = await fetchInquiry(id);
        setInquiry(data);
        setStatus(data.status || 'new');
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadInquiry();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!status || status === inquiry?.status) return;
    setUpdating(true);
    try {
      const updated = await updateInquiryAdmin(id, { status });
      setInquiry(updated);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      await deleteInquiryAdmin(id);
      router.push('/dashboard-admin/inquiries');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="aid-container">Loading inquiry...</div>;
  if (error) return <div className="aid-container">Error: {error}</div>;
  if (!inquiry) return <div className="aid-container">Inquiry not found.</div>;

  return (
    <div className="aid-container">
      <main className="aid-main-content">
        <div className="aid-header">
          <h1>Inquiry #{inquiry.id}</h1>
          <div className="aid-header-actions">
            <Link href="/dashboard-admin/inquiries" className="aid-btn-secondary">
              ← Back
            </Link>
            <button onClick={handleDelete} className="aid-btn-danger">
              Delete
            </button>
          </div>
        </div>

        <div className="aid-card">
          <div className="aid-card-header">
            <h3>Inquiry Details</h3>
            <div className="aid-status-actions">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="aid-select"
              >
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="spam">Spam</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || status === inquiry.status}
                className="aid-btn-primary"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          <div className="aid-form-grid">
            <div><strong>Name:</strong> {inquiry.name}</div>
            <div><strong>Email:</strong> {inquiry.email}</div>
            {inquiry.company && <div><strong>Company:</strong> {inquiry.company}</div>}
            {inquiry.phone && <div><strong>Phone:</strong> {inquiry.phone}</div>}
            <div><strong>Received:</strong> {new Date(inquiry.created_at).toLocaleString()}</div>
            <div><strong>Subject:</strong> {inquiry.subject}</div>
            <div><strong>Service Category:</strong> {inquiry.service_category}</div>
            <div><strong>Budget:</strong> {inquiry.budget}</div>
            {inquiry.timeline && <div><strong>Timeline:</strong> {inquiry.timeline}</div>}
          </div>

          {inquiry.message && (
            <div className="aid-note">
              <strong>Message:</strong>
              <p>{inquiry.message}</p>
            </div>
          )}

          {inquiry.project_details && inquiry.project_details !== inquiry.message && (
            <div className="aid-note">
              <strong>Project Details:</strong>
              <p>{inquiry.project_details}</p>
            </div>
          )}

          {inquiry.metadata && Object.keys(inquiry.metadata).length > 0 && (
            <div className="aid-metadata">
              <details>
                <summary>Metadata</summary>
                <pre>{JSON.stringify(inquiry.metadata, null, 2)}</pre>
              </details>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}