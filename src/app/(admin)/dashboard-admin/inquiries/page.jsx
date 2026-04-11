'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchInquiries, deleteInquiryAdmin } from '@/lib/boemApi';
import './inquiries.css';

export default function AdminInquiriesPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '' });

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchInquiries(filters);
      setInquiries(data.results || data);
      setError('');
    } catch (err) {
      if (err.status === 401) {
        router.push('/login');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, router]);

  useEffect(() => {
    void loadInquiries();
  }, [loadInquiries]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this inquiry? This cannot be undone.')) return;
    try {
      await deleteInquiryAdmin(id);
      loadInquiries();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="ai-container">
      <main className="ai-main-content">
        <div className="ai-header">
          <h1>Admin: Inquiries</h1>
        </div>

        <div className="ai-filters">
          <input
            type="text"
            placeholder="Search by name, email, subject..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="ai-search"
          />
        </div>

        {loading && <div className="ai-state">Loading inquiries...</div>}
        {error && <div className="ai-error">Error: {error}</div>}

        {!loading && !error && (
          <div className="ai-list">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="ai-card">
                <div className="ai-card-header">
                  <strong>{inquiry.name}</strong>
                  <span className={`ai-badge ai-badge-${inquiry.status || 'new'}`}>
                    {inquiry.status || 'New'}
                  </span>
                </div>
                <div className="ai-card-details">
                  <div>{inquiry.email}</div>
                  <div>Subject: {inquiry.subject}</div>
                  <div>Received: {new Date(inquiry.created_at).toLocaleString()}</div>
                </div>
                <div className="ai-card-actions">
                  <Link href={`/dashboard-admin/inquiries/${inquiry.id}`} className="ai-btn-secondary">
                    View Details
                  </Link>
                  <button onClick={() => handleDelete(inquiry.id)} className="ai-btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {inquiries.length === 0 && (
              <div className="ai-empty">
                <p>No inquiries found.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
