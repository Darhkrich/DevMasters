'use client';

import './dashboard.css';
import ThemeToggle from '@/components/common/ThemeToggle';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  fetchOrderStats,
  fetchOrders,
  fetchWorkforceDashboard,
  getStoredUser,
} from '@/lib/boemApi';

const getQuickActions = (user) => (
  user?.can_manage_staff_workspace
    ? [
      { id: 1, label: 'Team Control', href: '/dashboard-admin/team', icon: 'Team' },
      { id: 2, label: 'My Workspace', href: '/dashboard-admin/workspace', icon: 'Tasks' },
      { id: 3, label: 'Orders', href: '/dashboard-admin/orders', icon: 'Orders' },
      { id: 4, label: 'Clients', href: '/dashboard-admin/clients', icon: 'Clients' },
    ]
    : [
      { id: 1, label: 'My Workspace', href: '/dashboard-admin/workspace', icon: 'Tasks' },
      { id: 2, label: 'Settings', href: '/dashboard-admin/Settings', icon: 'Settings' },
    ]
);

const getInitials = (firstName, lastName, fallback) => {
  const value = [firstName, lastName]
    .map((part) => (part || '').trim())
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
  return value || fallback;
};

const getStatusInfo = (status) => {
  switch (status) {
    case 'todo':
      return { className: 'ad-status-badge ad-status-pending', text: 'To Do' };
    case 'completed':
    case 'done':
      return { className: 'ad-status-badge ad-status-completed', text: 'Completed' };
    case 'in_progress':
      return { className: 'ad-status-badge ad-status-in-progress', text: 'In Progress' };
    case 'pending':
      return { className: 'ad-status-badge ad-status-pending', text: 'Pending Review' };
    case 'reviewed':
      return { className: 'ad-status-badge ad-status-pending', text: 'Reviewed' };
    case 'awaiting_client':
      return { className: 'ad-status-badge ad-status-pending', text: 'Awaiting Client' };
    case 'cancelled':
      return { className: 'ad-status-badge', text: 'Cancelled' };
    case 'blocked':
      return { className: 'ad-status-badge', text: 'Blocked' };
    default:
      return { className: 'ad-status-badge', text: status };
  }
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    monthlyRevenue: 0,
    pendingActions: 0,
    activeProjects: 0,
  });
  const [workforce, setWorkforce] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState('');
  const user = useMemo(() => getStoredUser(), []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const hours = now.getHours();

      let timeGreeting = 'Welcome back';
      if (hours < 12) timeGreeting = 'Good morning';
      else if (hours < 18) timeGreeting = 'Good afternoon';
      else timeGreeting = 'Good evening';

      setCurrentTime(timeString);
      setGreeting(timeGreeting);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [user?.can_manage_staff_workspace]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        if (user?.can_manage_staff_workspace) {
          const [statsPayload, ordersPayload, workforcePayload] = await Promise.all([
            fetchOrderStats(),
            fetchOrders(),
            fetchWorkforceDashboard(),
          ]);

          if (!isMounted) return;

          setStats({
            totalOrders: statsPayload.total_orders || 0,
            monthlyRevenue: statsPayload.monthly_revenue || 0,
            pendingActions: statsPayload.pending_actions || 0,
            activeProjects: statsPayload.active_projects || 0,
          });
          setWorkforce(workforcePayload);
          setRecentOrders((ordersPayload.results || []).slice(0, 5));
        } else {
          const workforcePayload = await fetchWorkforceDashboard();
          if (!isMounted) return;
          setWorkforce(workforcePayload);
          setRecentOrders(workforcePayload.focus_tasks || []);
        }

        setError('');
      } catch (requestError) {
        if (!isMounted) return;
        setError(requestError.message || 'Unable to load dashboard data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboard();
    return () => { isMounted = false; };
  }, [user?.can_manage_staff_workspace]);

  const pendingActions = useMemo(() => {
    return recentOrders
      .filter((order) => ['pending', 'reviewed', 'awaiting_client'].includes(order.status))
      .map((order) => ({
        id: order.id,
        title: order.status === 'awaiting_client' ? 'Waiting on Client' : 'Order Needs Review',
        description: `${order.reference} • ${order.client_name || order.client_email}`,
        time: new Date(order.created_at).toLocaleDateString(),
        priority: order.status === 'pending' ? 'urgent' : 'normal',
      }));
  }, [recentOrders]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const quickActions = getQuickActions(user);
  const staffInitials = getInitials(user?.first_name || 'Staff', user?.last_name || 'User', 'SU');
  const adminInitials = getInitials(user?.first_name || 'Admin', user?.last_name || 'User', 'AU');

  if (user && !user.can_manage_staff_workspace) {
    return (
      <div className="ad-dashboard-container">
        <main className="ad-main-content">
          <header className="ad-header">
            <div className="ad-header-left">
              <h1>{user.workspace_name || 'Staff Workspace Overview'}</h1>
              <p className="ad-welcome-text">
                {greeting}, {user?.first_name || 'Team Member'}! {currentTime && `It's ${currentTime}`} Your assigned work is surfaced below.
              </p>
            </div>
            <div className="ad-header-right">
              <ThemeToggle />
              <div className="ad-user-info">
                <div className="ad-user-avatar" aria-hidden="true">
                  {staffInitials}
                </div>
                <div className="ad-user-details">
                  <span className="ad-user-name">{user?.email || 'Staff User'}</span>
                  <span className="ad-user-role">{user?.staff_title || user?.workspace_name || 'Internal Staff'}</span>
                </div>
              </div>
            </div>
          </header>

          {error && (
            <div className="ad-error-card">
              <p>{error}</p>
              <Link href="/dashboard-admin/workspace" className="ad-view-all-btn">
                Open workspace
              </Link>
            </div>
          )}

          <div className="ad-stats-grid">
            <div className="ad-stat-card">
              <div className="ad-stat-icon orders">
                <span>Tasks</span>
              </div>
              <div className="ad-stat-info">
                <h3>{workforce?.assigned_tasks || 0}</h3>
                <p>Assigned Tasks</p>
                <span className="ad-stat-trend positive">Active workload</span>
              </div>
            </div>

            <div className="ad-stat-card">
              <div className="ad-stat-icon revenue">
                <span>Doing</span>
              </div>
              <div className="ad-stat-info">
                <h3>{workforce?.in_progress_tasks || 0}</h3>
                <p>In Progress</p>
                <span className="ad-stat-trend">Tasks moving right now</span>
              </div>
            </div>

            <div className="ad-stat-card">
              <div className="ad-stat-icon queue">
                <span>Review</span>
              </div>
              <div className="ad-stat-info">
                <h3>{workforce?.review_tasks || 0}</h3>
                <p>In Review</p>
                <span className="ad-stat-trend">Waiting on approval</span>
              </div>
            </div>

            <div className="ad-stat-card">
              <div className="ad-stat-icon active">
                <span>Risk</span>
              </div>
              <div className="ad-stat-info">
                <h3>{workforce?.overdue_tasks || 0}</h3>
                <p>Overdue</p>
                <span className={`ad-stat-trend ${(workforce?.overdue_tasks || 0) > 0 ? 'negative' : ''}`}>
                  {(workforce?.overdue_tasks || 0) > 0 ? 'Needs recovery' : 'On track'}
                </span>
              </div>
            </div>
          </div>

          <div className="ad-content-grid">
            <div className="ad-card">
              <div className="ad-card-header">
                <h2>Focus Tasks</h2>
                <Link className="ad-view-all-btn" href="/dashboard-admin/workspace">
                  Open Workspace →
                </Link>
              </div>
              <div className="ad-actions-list">
                {recentOrders.map((task) => {
                  const statusInfo = getStatusInfo(task.status);
                  return (
                    <div key={task.id} className="ad-action-item">
                      <div className="ad-action-details">
                        <h4>{task.title}</h4>
                        <p>{task.team || 'General'} • {task.assigned_to?.full_name || 'Unassigned'}</p>
                        <span className="ad-action-time">{task.due_at ? new Date(task.due_at).toLocaleString() : 'No deadline'}</span>
                      </div>
                      <span className={statusInfo.className}>{statusInfo.text}</span>
                    </div>
                  );
                })}

                {!loading && recentOrders.length === 0 && (
                  <div className="ad-no-actions">
                    <div className="ad-no-actions-icon">OK</div>
                    <p>No focus tasks yet. Open your workspace when new assignments arrive.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="ad-card">
              <div className="ad-card-header">
                <h2>Quick Actions</h2>
              </div>
              <div className="ad-action-buttons">
                {quickActions.map((action) => (
                  <Link key={action.id} className="ad-quick-btn" href={action.href}>
                    <span>{action.icon}</span>
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="ad-dashboard-container">
      <main className="ad-main-content">
        <header className="ad-header">
          <div className="ad-header-left">
            <h1>Dashboard Overview</h1>
            <p className="ad-welcome-text">
              {greeting}, {user?.first_name || 'Admin'}! {currentTime && `It's ${currentTime}`} Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <div className="ad-header-right">
            <ThemeToggle />
            <div className="ad-user-info">
              <div className="ad-user-avatar" aria-hidden="true">
                {adminInitials}
              </div>
              <div className="ad-user-details">
                <span className="ad-user-name">{user?.email || 'Admin User'}</span>
                <span className="ad-user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="ad-error-card">
            <p>{error}</p>
            <Link href="/admin-login" className="ad-view-all-btn">
              Go to admin login
            </Link>
          </div>
        )}

        <div className="ad-stats-grid">
          <div className="ad-stat-card">
            <div className="ad-stat-icon orders">
              <span>Orders</span>
            </div>
            <div className="ad-stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
              <span className="ad-stat-trend positive">Live from backend</span>
            </div>
          </div>

          <div className="ad-stat-card">
            <div className="ad-stat-icon revenue">
              <span>Revenue</span>
            </div>
            <div className="ad-stat-info">
              <h3>{formatCurrency(stats.monthlyRevenue)}</h3>
              <p>Monthly Revenue</p>
              <span className="ad-stat-trend positive">Current month</span>
            </div>
          </div>

          <div className="ad-stat-card">
            <div className="ad-stat-icon queue">
              <span>Queue</span>
            </div>
            <div className="ad-stat-info">
              <h3>{stats.pendingActions}</h3>
              <p>Pending Actions</p>
              <span className={`ad-stat-trend ${stats.pendingActions > 5 ? 'negative' : ''}`}>
                {stats.pendingActions > 5 ? 'Attention needed' : 'Under control'}
              </span>
            </div>
          </div>

          <div className="ad-stat-card">
            <div className="ad-stat-icon active">
              <span>Active</span>
            </div>
            <div className="ad-stat-info">
              <h3>{stats.activeProjects}</h3>
              <p>Active Projects</p>
              <span className="ad-stat-trend">In progress</span>
            </div>
          </div>
        </div>

        <div className="ad-content-grid">
          <div className="ad-card">
            <div className="ad-card-header">
              <h2>Recent Orders</h2>
              <Link className="ad-view-all-btn" href="/dashboard-admin/orders">
                View All →
              </Link>
            </div>
            <div className="ad-table-container">
              <table className="ad-data-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Client</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    return (
                      <tr key={order.id}>
                        <td>{order.reference}</td>
                        <td>
                          <div className="ad-client-cell">
                            <span className="ad-client-name">{order.client_name || 'Unknown Client'}</span>
                            <span className="ad-client-email">{order.client_email}</span>
                          </div>
                        </td>
                        <td>{order.item_count}</td>
                        <td>{formatCurrency(order.total_amount)}</td>
                        <td>
                          <span className={statusInfo.className}>{statusInfo.text}</span>
                        </td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}

                  {!loading && recentOrders.length === 0 && (
                    <tr>
                      <td colSpan="6">No orders yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-card-header">
              <h2>Pending Actions ({pendingActions.length})</h2>
              <Link className="ad-view-all-btn" href="/dashboard-admin/orders">
                View All →
              </Link>
            </div>
            <div className="ad-actions-list">
              {pendingActions.map((action) => (
                <div key={action.id} className={`ad-action-item ${action.priority}`}>
                  <div className="ad-action-icon">{action.priority === 'urgent' ? '!' : 'i'}</div>
                  <div className="ad-action-details">
                    <h4>{action.title}</h4>
                    <p>{action.description}</p>
                    <span className="ad-action-time">{action.time}</span>
                  </div>
                  <Link className="ad-action-btn" href="/dashboard-admin/orders">
                    Review
                  </Link>
                </div>
              ))}

              {!loading && pendingActions.length === 0 && (
                <div className="ad-no-actions">
                  <div className="ad-no-actions-icon">OK</div>
                  <p>All caught up. No pending actions.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="ad-quick-actions">
          <h2>Quick Actions</h2>
          <div className="ad-action-buttons">
            {quickActions.map((action) => (
              <Link key={action.id} className="ad-quick-btn" href={action.href}>
                <span>{action.icon}</span>
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
