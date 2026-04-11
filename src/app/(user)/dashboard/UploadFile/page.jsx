'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  buildMediaUrl,
  deleteProjectFile,
  fetchOrders,
  fetchProjectFiles,
  uploadProjectFile,
} from '@/lib/boemApi';
import './upload.css';

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

function resolveFileHref(file) {
  if (file.file) return buildMediaUrl(file.file);
  if (file.file_url) return file.file_url;
  return '#';
}

// Helper to get status badge class
function getStatusBadge(status) {
  switch (status) {
    case 'approved': return 'uf-status-approved';
    case 'rejected': return 'uf-status-rejected';
    case 'in_review': return 'uf-status-in-review';
    case 'changes_requested': return 'uf-status-changes';
    default: return 'uf-status-pending';
  }
}

export default function UploadFilesPage() {
  const fileInputRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [description, setDescription] = useState('');
  const [pendingFiles, setPendingFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  // Fetch orders and files, optionally filtered by order
  const loadData = useCallback(async (orderId = selectedOrderId) => {
    const [ordersPayload, filesPayload] = await Promise.all([
      fetchOrders(),
      fetchProjectFiles(orderId ? { order: orderId } : {}),
    ]);
    setOrders(ordersPayload.results || []);
    setFiles(filesPayload.results || []);
  }, [selectedOrderId]);

  useEffect(() => {
    let isMounted = true;
    const initialize = async () => {
      try {
        await loadData();
      } catch (err) {
        if (isMounted) setError(err.message || 'Unable to load your files.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    initialize();
    return () => { isMounted = false; };
  }, [loadData]);

  // When selected order changes, reload files filtered by that order
  useEffect(() => {
    if (!loading) {
      void loadData(selectedOrderId);
    }
  }, [selectedOrderId, loading, loadData]);

  const filteredFiles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return files.filter(file => {
      if (query) {
        return [file.file_name, file.description, file.uploaded_by]
          .filter(Boolean)
          .some(val => val.toLowerCase().includes(query));
      }
      return true;
    });
  }, [files, searchQuery]);

  const stats = useMemo(() => {
    const totalBytes = files.reduce((sum, f) => sum + Number(f.size_bytes || 0), 0);
    return {
      totalFiles: files.length,
      totalBytes,
      clientUploads: files.filter(f => f.uploader_role === 'client').length,
      adminFiles: files.filter(f => f.uploader_role === 'admin').length,
    };
  }, [files]);

  const handleFileSelection = (e) => {
    setPendingFiles(Array.from(e.target.files || []));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedOrderId) {
      setError('Please choose an order.');
      return;
    }
    if (pendingFiles.length === 0) {
      setError('Please select files to upload.');
      return;
    }

    setUploading(true);
    setError('');
    try {
      await Promise.all(
        pendingFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('order', selectedOrderId);
          if (description.trim()) formData.append('description', description.trim());
          formData.append('file', file);
          return uploadProjectFile(formData);
        })
      );
      setPendingFiles([]);
      setDescription('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadData(selectedOrderId);
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    setDeletingId(fileId);
    setError('');
    try {
      await deleteProjectFile(fileId);
      await loadData(selectedOrderId);
    } catch (err) {
      setError(err.message || 'Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="uf-dashboard-container">
      <main className="uf-main-content">
        <header className="uf-top-header">
          <div className="uf-header-left">
            <div className="uf-breadcrumb">
              <Link href="/dashboard">Dashboard</Link>
              <i className="fas fa-chevron-right" />
              <span>File Manager</span>
            </div>
          </div>
        </header>

        {error && <div className="uf-auth-error-message">{error}</div>}

        <div className="uf-content-area">
          <div className="uf-stats-grid">
            <div className="uf-stat-card">
              <div className="uf-stat-info">
                <h3>{stats.totalFiles}</h3>
                <p>Total Files</p>
              </div>
            </div>
            <div className="uf-stat-card">
              <div className="uf-stat-info">
                <h3>{formatBytes(stats.totalBytes)}</h3>
                <p>Total Size</p>
              </div>
            </div>
            <div className="uf-stat-card">
              <div className="uf-stat-info">
                <h3>{stats.clientUploads}</h3>
                <p>Your Uploads</p>
              </div>
            </div>
            <div className="uf-stat-card">
              <div className="uf-stat-info">
                <h3>{stats.adminFiles}</h3>
                <p>Shared Files</p>
              </div>
            </div>
          </div>

          <section className="uf-card">
            <div className="uf-card-header">
              <h3>Upload Files</h3>
              <p>Attach assets, briefs, and content to an existing order.</p>
            </div>
            <div className="uf-card-body">
              <form className="uf-upload-container" onSubmit={handleUpload}>
                <div className="uf-form-group">
                  <label htmlFor="orderSelect">Order</label>
                  <select
                    id="orderSelect"
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                  >
                    <option value="">Choose an order</option>
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.reference} - {order.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="uf-form-group">
                  <label htmlFor="fileDescription">Description</label>
                  <textarea
                    id="fileDescription"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional note about this upload"
                  />
                </div>

                <div className="uf-form-group">
                  <label htmlFor="projectFiles">Files</label>
                  <input
                    id="projectFiles"
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelection}
                  />
                  <p>{pendingFiles.length > 0 ? `${pendingFiles.length} file(s) selected` : 'No files selected yet.'}</p>
                </div>

                <button type="submit" className="uf-btn uf-btn-primary" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload to DevMasters'}
                </button>
              </form>
            </div>
          </section>

          <section className="uf-card">
            <div className="uf-card-header">
              <h3>Project Files</h3>
              <div className="uf-library-controls">
                <div className="uf-search-box">
                  <i className="fas fa-search" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="uf-card-body">
              {loading && <p>Loading files...</p>}
              {!loading && filteredFiles.length === 0 && <p>No files found for this order.</p>}

              <div className="uf-files-list">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="uf-file-card">
                    <div className="uf-file-info">
                      <span className="uf-file-name">{file.file_name}</span>
                      <span className="uf-file-meta">
                        {formatBytes(file.size_bytes)} | {file.uploader_role} | {formatDateTime(file.created_at)}
                      </span>
                      <span className="uf-file-meta">
                        Order #{file.order || 'N/A'} {file.description ? `| ${file.description}` : ''}
                      </span>
                      {file.review_status && (
                        <span className={`uf-file-status ${getStatusBadge(file.review_status)}`}>
                          {file.review_status.replace(/_/g, ' ')}
                        </span>
                      )}
                      {file.review_notes && (
                        <span className="uf-file-review-notes">Notes: {file.review_notes}</span>
                      )}
                    </div>
                    <div className="uf-file-actions">
                      <a
                        href={resolveFileHref(file)}
                        target="_blank"
                        rel="noreferrer"
                        className="uf-btn uf-btn-outline uf-btn-sm"
                      >
                        Open
                      </a>
                      {file.uploader_role === 'client' && (
                        <button
                          className="uf-btn uf-btn-outline uf-btn-sm uf-error"
                          onClick={() => handleDelete(file.id)}
                          disabled={deletingId === file.id}
                        >
                          {deletingId === file.id ? 'Deleting...' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
