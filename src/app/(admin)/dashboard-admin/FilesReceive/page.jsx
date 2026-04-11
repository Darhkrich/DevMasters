'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchAllFilesAdmin, updateFileAdmin, deleteFileAdmin } from '@/lib/boemApi';
import './upload.css';

const API_BASE = process.env.NEXT_PUBLIC_BOEM_API_BASE_URL || 'http://localhost:8000/api/v1';

function formatBytes(bytes) {
  const value = Number(bytes || 0);
  if (!value) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  const formatted = value / 1024 ** index;
  return `${formatted.toFixed(formatted >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatDateTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function AdminFilesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ order: '', inquiry: '', role: '', status: '' });
  const [updatingId, setUpdatingId] = useState(null);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllFilesAdmin(filters);
      setFiles(data.results || data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleStatusUpdate = async (fileId, newStatus, reviewNotes = '') => {
    setUpdatingId(fileId);
    try {
      await updateFileAdmin(fileId, { review_status: newStatus, review_notes: reviewNotes });
      await loadFiles();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (fileId) => {
    if (!confirm('Delete this file?')) return;
    try {
      await deleteFileAdmin(fileId);
      await loadFiles();
    } catch (err) {
      alert(err.message);
    }
  };

  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await fetch(`${API_BASE}/files/${fileId}/download/`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      alert('Unable to download file.');
    }
  };

  return (
    <div className="af-container">
      <main className="af-main-content">
        <div className="af-header">
          <h1>Admin: Project Files</h1>
        </div>

        <div className="af-filters-bar">
          <input
            type="text"
            placeholder="Order ID"
            value={filters.order}
            onChange={(e) => setFilters({ ...filters, order: e.target.value })}
            className="af-filter-input"
          />
          <input
            type="text"
            placeholder="Inquiry ID"
            value={filters.inquiry}
            onChange={(e) => setFilters({ ...filters, inquiry: e.target.value })}
            className="af-filter-input"
          />
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="af-filter-select"
          >
            <option value="">All roles</option>
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="af-filter-select"
          >
            <option value="">All statuses</option>
            <option value="pending_review">Pending Review</option>
            <option value="in_review">In Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="changes_requested">Changes Requested</option>
          </select>
          <button className="af-btn-secondary" onClick={() => setFilters({ order: '', inquiry: '', role: '', status: '' })}>
            Clear
          </button>
        </div>

        {loading && <div className="af-state">Loading files...</div>}
        {error && <div className="af-error">Error: {error}</div>}

        <div className="af-list">
          {files.map((file) => (
            <div key={file.id} className="af-card">
              <div className="af-card-header">
                <div>
                  <strong>{file.file_name}</strong>
                  <div className="af-meta">Uploaded by: {file.uploaded_by || file.uploader?.email} ({file.uploader_role})</div>
                  <div className="af-meta">Size: {formatBytes(file.size_bytes)}</div>
                  <div className="af-meta">Date: {formatDateTime(file.created_at)}</div>
                  {file.order && <div className="af-meta">Order ID: {file.order}</div>}
                  {file.inquiry && <div className="af-meta">Inquiry ID: {file.inquiry}</div>}
                  {file.description && <div className="af-meta">Description: {file.description}</div>}
                </div>
                <div className="af-card-actions">
                  <button className="af-btn-outline" onClick={() => downloadFile(file.id, file.file_name)}>Download</button>
                  <button className="af-btn-danger" onClick={() => handleDelete(file.id)}>Delete</button>
                </div>
              </div>
              <div className="af-status-area">
                <select
                  value={file.review_status}
                  onChange={(e) => handleStatusUpdate(file.id, e.target.value, file.review_notes)}
                  disabled={updatingId === file.id}
                  className="af-status-select"
                >
                  <option value="pending_review">Pending Review</option>
                  <option value="in_review">In Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="changes_requested">Changes Requested</option>
                </select>
                <input
                  type="text"
                  placeholder="Review notes"
                  defaultValue={file.review_notes || ''}
                  onBlur={(e) => handleStatusUpdate(file.id, file.review_status, e.target.value)}
                  className="af-review-notes"
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
