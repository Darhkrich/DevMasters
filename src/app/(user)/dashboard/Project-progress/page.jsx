'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  fetchOrder,
  fetchOrders,
  fetchProjectFiles,
  fetchThreads,
} from '@/lib/boemApi';
import './progress.css';

const STATUS_PROGRESS = {
  pending: 20,
  reviewed: 40,
  in_progress: 65,
  awaiting_client: 80,
  completed: 100,
  cancelled: 0,
};

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatMoney(value, currency = 'USD') {
  if (value === null || value === undefined || value === '') {
    return 'Custom Quote';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function toStatusLabel(status) {
  return status
    ?.replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || '';
}

export default function ProjectProgressPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [threadSummary, setThreadSummary] = useState([]);
  const [projectFiles, setProjectFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');

  const progress = useMemo(
    () => STATUS_PROGRESS[selectedOrder?.status] ?? 0,
    [selectedOrder?.status],
  );

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const payload = await fetchOrders();
        if (!isMounted) return;
        const results = payload.results || [];
        setOrders(results);
        setSelectedOrderId(results[0]?.id || null);
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'Unable to load your project progress.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedOrderId) return;

    let isMounted = true;

    const loadOrderDetail = async () => {
      setDetailLoading(true);
      try {
        const [orderPayload, threadsPayload, filesPayload] = await Promise.all([
          fetchOrder(selectedOrderId),
          fetchThreads({ order: selectedOrderId }),
          fetchProjectFiles({ order: selectedOrderId }),
        ]);

        if (!isMounted) return;

        setSelectedOrder(orderPayload);
        setThreadSummary(threadsPayload.results || []);
        setProjectFiles(filesPayload.results || []);
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'Unable to load this project.');
        }
      } finally {
        if (isMounted) setDetailLoading(false);
      }
    };

    loadOrderDetail();

    return () => {
      isMounted = false;
    };
  }, [selectedOrderId]);

  const handleDownloadReport = () => {
    if (!selectedOrder) return;

    const blob = new Blob(
      [
        JSON.stringify(
          {
            order: selectedOrder,
            threads: threadSummary,
            files: projectFiles,
          },
          null,
          2,
        ),
      ],
      { type: 'application/json' },
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${selectedOrder.reference || 'project'}-report.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pp-dashboard-container">
      <main className="pp-main-content">
        <header className="pp-top-header">
          <div className="pp-header-left">
            <div className="pp-breadcrumb">
              <Link href="/dashboard">Dashboard</Link>
              <i className="fas fa-chevron-right" />
              <span>Project Progress</span>
            </div>
          </div>
          <div className="pp-header-right">
            <div className="pp-overview-actions">
              <button className="pp-btn pp-btn-outline" onClick={handleDownloadReport} disabled={!selectedOrder}>
                Download Report
              </button>
              <Link href="/dashboard/Messages" className="pp-btn pp-btn-primary">
                Message DevMasters Team
              </Link>
            </div>
          </div>
        </header>

        {error ? <div className="pp-auth-error-message">{error}</div> : null}

        <div className="pp-content-area">
          <section className="pp-progress-overview">
            <div className="pp-overview-header">
              <div className="pp-project-basic-info">
                <h1>{selectedOrder?.reference || 'Your Projects'}</h1>
                <p>
                  {selectedOrder?.client_name || 'Select a project'}{' '}
                  {selectedOrder?.created_at ? `| Started ${formatDate(selectedOrder.created_at)}` : ''}
                </p>
                <div className={`pp-project-status-badge ${selectedOrder?.status || ''}`}>
                  {toStatusLabel(selectedOrder?.status)} - {progress}% Complete
                </div>
              </div>
              <div className="pp-form-group">
                <label htmlFor="orderSwitcher">Order</label>
                <select
                  id="orderSwitcher"
                  value={selectedOrderId || ''}
                  onChange={(event) => setSelectedOrderId(Number(event.target.value) || null)}
                >
                  {orders.map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.reference} - {toStatusLabel(order.status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pp-stats-grid">
              <div className="pp-stat-card">
                <div className="pp-stat-info">
                  <h3>{selectedOrder?.item_count || 0}</h3>
                  <p>Items</p>
                </div>
              </div>
              <div className="pp-stat-card">
                <div className="pp-stat-info">
                  <h3>{threadSummary.length}</h3>
                  <p>Message Threads</p>
                </div>
              </div>
              <div className="pp-stat-card">
                <div className="pp-stat-info">
                  <h3>{projectFiles.length}</h3>
                  <p>Project Files</p>
                </div>
              </div>
              <div className="pp-stat-card">
                <div className="pp-stat-info">
                  <h3>{formatMoney(selectedOrder?.total_amount, selectedOrder?.currency)}</h3>
                  <p>Project Value</p>
                </div>
              </div>
            </div>
          </section>

          {loading || detailLoading ? <p className="pp-loading-text">Loading project details...</p> : null}
          {!loading && orders.length === 0 ? <p className="pp-empty-text">No orders found yet.</p> : null}

          {selectedOrder ? (
            <>
              <div className="pp-content-columns">
                <div className="pp-column">
                  <section className="pp-card">
                    <div className="pp-card-header">
                      <h3>Project Summary</h3>
                    </div>
                    <div className="pp-card-body">
                      <div className="pp-summary">
                        <div className="pp-summary-item">
                          <span>Status</span>
                          <span className="pp-summary-value">{toStatusLabel(selectedOrder.status)}</span>
                        </div>
                        <div className="pp-summary-item">
                          <span>Timeline</span>
                          <span className="pp-summary-value">{selectedOrder.timeline || 'To be confirmed'}</span>
                        </div>
                        <div className="pp-summary-item">
                          <span>Budget Range</span>
                          <span className="pp-summary-value">
                            {selectedOrder.budget_min || selectedOrder.budget_max
                              ? `${formatMoney(selectedOrder.budget_min, selectedOrder.currency)} - ${formatMoney(selectedOrder.budget_max, selectedOrder.currency)}`
                              : 'Custom quote'}
                          </span>
                        </div>
                        <div className="pp-summary-item">
                          <span>Project Details</span>
                          <span className="pp-summary-value">
                            {selectedOrder.project_details || selectedOrder.notes || 'No notes yet.'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="pp-card">
                    <div className="pp-card-header">
                      <h3>Order Items</h3>
                    </div>
                    <div className="pp-card-body">
                      <div className="pp-task-list">
                        {(selectedOrder.items || []).map((item) => (
                          <div key={item.id} className="pp-task-item">
                            <span>{item.title}</span>
                            <span>
                              {item.quantity} x {formatMoney(item.price, selectedOrder.currency)}
                            </span>
                          </div>
                        ))}
                        {selectedOrder.items?.length === 0 ? <p>No order items yet.</p> : null}
                      </div>
                    </div>
                  </section>
                </div>

                <div className="pp-column">
                  <section className="pp-card">
                    <div className="pp-card-header">
                      <h3>Recent Activity</h3>
                    </div>
                    <div className="pp-card-body">
                      <div className="pp-activity-feed">
                        {(selectedOrder.activities || []).map((activity) => (
                          <div key={activity.id} className="pp-activity-item">
                            <div className="pp-activity-content">
                              <p>{activity.message}</p>
                              <span>{formatDate(activity.created_at)}</span>
                            </div>
                          </div>
                        ))}
                        {selectedOrder.activities?.length === 0 ? <p>No project activity yet.</p> : null}
                      </div>
                    </div>
                  </section>

                  <section className="pp-card">
                    <div className="pp-card-header">
                      <h3>Communication</h3>
                    </div>
                    <div className="pp-card-body">
                      <div className="pp-milestone-list">
                        {threadSummary.map((thread) => (
                          <div key={thread.id} className="pp-milestone-item">
                            <div className="pp-milestone-content">
                              <span className="pp-milestone-title">{thread.subject}</span>
                              <span className="pp-milestone-date">
                                {thread.last_message?.body || 'No preview available'}
                              </span>
                            </div>
                          </div>
                        ))}
                        {threadSummary.length === 0 ? <p>No message threads yet for this project.</p> : null}
                      </div>
                    </div>
                  </section>

                  <section className="pp-card">
                    <div className="pp-card-header">
                      <h3>Project Files</h3>
                    </div>
                    <div className="pp-card-body">
                      <div className="pp-file-list">
                        {projectFiles.map((file) => (
                          <div key={file.id} className="pp-file-item">
                            <span>{file.file_name}</span>
                            <span>{formatDate(file.created_at)}</span>
                          </div>
                        ))}
                        {projectFiles.length === 0 ? <p>No files attached to this order yet.</p> : null}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}