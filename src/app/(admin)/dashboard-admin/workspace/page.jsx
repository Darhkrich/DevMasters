'use client';

import './workspace.css';

import Link from 'next/link';
import { startTransition, useEffect, useMemo, useState } from 'react';

import {
  fetchStaffTasks,
  fetchWorkforceDashboard,
  getStoredUser,
  updateStaffTask,
} from '@/lib/boemApi';

const WORK_COLUMNS = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'in_review', label: 'In Review' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'done', label: 'Done' },
];

function formatDateLabel(value) {
  if (!value) return 'No due date';
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildDraft(task, draft) {
  return draft || {
    status: task.status,
    progress_percent: String(task.progress_percent ?? 0),
    staff_notes: task.staff_notes || '',
  };
}

export default function StaffWorkspacePage() {
  const currentUser = getStoredUser();
  const [dashboard, setDashboard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskDrafts, setTaskDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingTaskId, setSavingTaskId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadWorkspace = async () => {
    setLoading(true);
    try {
      const [dashboardData, taskData] = await Promise.all([
        fetchWorkforceDashboard(),
        fetchStaffTasks({ mine: 'true' }),
      ]);

      setDashboard(dashboardData);
      setTasks(taskData || []);
      setError('');
    } catch (requestError) {
      setError(requestError.message || 'Unable to load your staff workspace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, []);

  const groupedTasks = useMemo(() => {
    const groups = Object.fromEntries(WORK_COLUMNS.map((column) => [column.key, []]));
    tasks.forEach((task) => {
      const bucket = groups[task.status] || groups.todo;
      bucket.push(task);
    });
    return groups;
  }, [tasks]);

  const handleDraftChange = (task, field, value) => {
    setTaskDrafts((previous) => ({
      ...previous,
      [task.id]: {
        ...buildDraft(task, previous[task.id]),
        [field]: value,
      },
    }));
  };

  const handleSaveTask = async (task) => {
    const draft = buildDraft(task, taskDrafts[task.id]);
    setSavingTaskId(task.id);
    setError('');
    setSuccess('');

    try {
      await updateStaffTask(task.id, {
        status: draft.status,
        progress_percent: Number(draft.progress_percent || 0),
        staff_notes: draft.staff_notes,
      });

      setSuccess(`Saved updates for "${task.title}".`);
      startTransition(() => {
        loadWorkspace();
      });
    } catch (requestError) {
      setError(requestError.message || 'Unable to save task updates.');
    } finally {
      setSavingTaskId(null);
    }
  };

  return (
    <div className="staff-workspace-page">
      <main className="staff-workspace-main">
        <header className="staff-workspace-hero">
          <div>
            <p className="staff-workspace-eyebrow">Internal Workspace</p>
            <h1>{dashboard?.workspace_name || currentUser?.workspace_name || 'Staff Workspace'}</h1>
            <p className="staff-workspace-copy">
              Track your assigned work, update progress, and keep admin informed without leaving the admin shell.
            </p>
          </div>

          <div className="staff-workspace-links">
            {currentUser?.can_manage_staff_workspace && (
              <Link href="/dashboard-admin/team" className="staff-link-secondary">
                Open Team Control Center
              </Link>
            )}
            <Link href="/dashboard-admin" className="staff-link-primary">
              Back to Dashboard
            </Link>
          </div>
        </header>

        {currentUser?.can_manage_staff_workspace && (
          <div className="staff-banner">
            You are viewing the personal workspace layer. This page only shows tasks assigned directly to you.
          </div>
        )}

        {error && <div className="staff-alert staff-alert-error">{error}</div>}
        {success && <div className="staff-alert staff-alert-success">{success}</div>}

        <section className="staff-stat-grid">
          <article className="staff-stat-card">
            <span>Assigned</span>
            <strong>{dashboard?.assigned_tasks ?? dashboard?.open_tasks ?? 0}</strong>
            <p>Total work linked to you</p>
          </article>
          <article className="staff-stat-card">
            <span>In Progress</span>
            <strong>{dashboard?.in_progress_tasks ?? 0}</strong>
            <p>Tasks actively moving</p>
          </article>
          <article className="staff-stat-card">
            <span>Review</span>
            <strong>{dashboard?.review_tasks ?? dashboard?.in_review_tasks ?? 0}</strong>
            <p>Ready for admin feedback</p>
          </article>
          <article className="staff-stat-card">
            <span>Overdue</span>
            <strong>{dashboard?.overdue_tasks ?? 0}</strong>
            <p>Deadlines that need recovery</p>
          </article>
        </section>

        <section className="staff-focus-panel">
          <div className="staff-focus-copy">
            <h2>Focus Queue</h2>
            <p>Your most important tasks are surfaced here first so you can move quickly each day.</p>
          </div>

          <div className="staff-focus-list">
            {loading && <div className="staff-empty-state">Loading focus tasks...</div>}

            {!loading && (dashboard?.focus_tasks || []).length === 0 && (
              <div className="staff-empty-state">No focus tasks yet. You are all caught up.</div>
            )}

            {(dashboard?.focus_tasks || []).map((task) => (
              <article key={task.id} className="staff-focus-card">
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.assigned_to?.full_name || 'Unassigned'} • {task.team || 'General'}</p>
                </div>
                <div className="staff-focus-meta">
                  <span>{task.priority}</span>
                  <span>{formatDateLabel(task.due_at)}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="staff-board">
          {WORK_COLUMNS.map((column) => (
            <article key={column.key} className="staff-column">
              <div className="staff-column-header">
                <h2>{column.label}</h2>
                <span>{groupedTasks[column.key]?.length || 0}</span>
              </div>

              <div className="staff-column-body">
                {loading && <div className="staff-empty-state">Loading tasks...</div>}

                {!loading && (groupedTasks[column.key] || []).length === 0 && (
                  <div className="staff-empty-state">Nothing here right now.</div>
                )}

                {(groupedTasks[column.key] || []).map((task) => {
                  const draft = buildDraft(task, taskDrafts[task.id]);
                  return (
                    <article key={task.id} className={`staff-task-card ${task.is_overdue ? 'is-overdue' : ''}`}>
                      <div className="staff-task-top">
                        <div>
                          <h3>{task.title}</h3>
                          <p>{task.description || 'No summary added yet.'}</p>
                        </div>
                        <span className={`staff-priority-badge priority-${task.priority}`}>
                          {task.priority}
                        </span>
                      </div>

                      <div className="staff-task-meta">
                        <span>{task.team || 'General'}</span>
                        <span>{formatDateLabel(task.due_at)}</span>
                        <span>{task.progress_percent}% complete</span>
                      </div>

                      <div className="staff-task-fields">
                        <label>
                          Status
                          <select
                            value={draft.status}
                            onChange={(event) => handleDraftChange(task, 'status', event.target.value)}
                          >
                            {WORK_COLUMNS.map((option) => (
                              <option key={option.key} value={option.key}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label>
                          Progress
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={draft.progress_percent}
                            onChange={(event) => handleDraftChange(task, 'progress_percent', event.target.value)}
                          />
                        </label>
                      </div>

                      <label className="staff-notes-field">
                        Work notes
                        <textarea
                          rows="4"
                          value={draft.staff_notes}
                          onChange={(event) => handleDraftChange(task, 'staff_notes', event.target.value)}
                          placeholder="Share your update, blocker, or handoff note."
                        />
                      </label>

                      <button
                        type="button"
                        className="staff-save-button"
                        onClick={() => handleSaveTask(task)}
                        disabled={savingTaskId === task.id}
                      >
                        {savingTaskId === task.id ? 'Saving...' : 'Save Update'}
                      </button>
                    </article>
                  );
                })}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
