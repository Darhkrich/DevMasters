'use client';

import './team.css';

import Link from 'next/link';
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  createStaffTask,
  deleteStaffTask,
  fetchStaffTasks,
  fetchTeamMembers,
  fetchWorkforceDashboard,
  getStoredUser,
  updateStaffTask,
  updateTeamMember,
} from '@/lib/boemApi';

const TEAM_OPTIONS = [
  { value: 'DESIGN', label: 'Design' },
  { value: 'DEVELOPMENT', label: 'Development' },
  { value: 'QA', label: 'Quality Assurance' },
  { value: 'DEVOPS', label: 'DevOps' },
  { value: 'PROJECT', label: 'Project Management' },
  { value: 'PRODUCT', label: 'Product' },
  { value: 'CONTENT', label: 'Content' },
  { value: 'OPERATIONS', label: 'Operations' },
  { value: 'OTHER', label: 'Other' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'done', label: 'Done' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const emptyTaskForm = {
  title: '',
  description: '',
  team: '',
  assigned_to_id: '',
  priority: 'medium',
  due_at: '',
  estimated_hours: '',
  acceptance_criteria: '',
};

function formatDeadline(value) {
  if (!value) return 'No deadline';
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildMemberDraft(member, existingDraft) {
  return existingDraft || {
    staff_team: member.staff_team || '',
    staff_title: member.staff_title || '',
    is_staff: Boolean(member.is_staff),
    is_active: Boolean(member.is_active),
  };
}

export default function TeamControlPage() {
  const router = useRouter();
  const currentUser = useMemo(() => getStoredUser(), []);
  const canManage = Boolean(currentUser?.can_manage_staff_workspace);

  const [dashboard, setDashboard] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', team: '' });
  const [memberSearch, setMemberSearch] = useState('');
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [memberDrafts, setMemberDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingMemberId, setSavingMemberId] = useState(null);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadControlCenter = useCallback(async () => {
    setLoading(true);
    try {
      const [dashboardData, memberData, taskData] = await Promise.all([
        fetchWorkforceDashboard(),
        fetchTeamMembers({
          include_non_staff: false, // Only staff members
          search: memberSearch,
        }),
        fetchStaffTasks(filters),
      ]);

      setDashboard(dashboardData);
      setTeamMembers(memberData || []);
      setTasks(taskData || []);
      setError('');
    } catch (requestError) {
      setError(requestError.message || 'Unable to load the team control center.');
    } finally {
      setLoading(false);
    }
  }, [filters, memberSearch]);

  useEffect(() => {
    if (currentUser && !canManage) {
      router.replace('/dashboard-admin/workspace');
      return;
    }
    if (canManage) {
      void loadControlCenter();
    }
  }, [canManage, currentUser, loadControlCenter, router]);

  const groupedMembers = useMemo(() => {
    const groups = new Map();

    teamMembers.forEach((member) => {
      const key = member.staff_team || (member.is_staff ? 'OTHER' : 'UNASSIGNED');
      const current = groups.get(key) || [];
      current.push(member);
      groups.set(key, current);
    });

    return Array.from(groups.entries()).sort(([left], [right]) => left.localeCompare(right));
  }, [teamMembers]);

  const assignableMembers = useMemo(
    () => teamMembers.filter((member) => member.is_staff && member.is_active),
    [teamMembers],
  );

  const handleTaskFormChange = (event) => {
    const { name, value } = event.target;
    setTaskForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await createStaffTask({
        title: taskForm.title,
        description: taskForm.description,
        team: taskForm.team,
        assigned_to_id: taskForm.assigned_to_id || null,
        priority: taskForm.priority,
        due_at: taskForm.due_at ? new Date(taskForm.due_at).toISOString() : null,
        estimated_hours: taskForm.estimated_hours ? Number(taskForm.estimated_hours) : null,
        acceptance_criteria: taskForm.acceptance_criteria,
      });

      setTaskForm(emptyTaskForm);
      setSuccess('Task assigned successfully.');
      startTransition(() => {
        loadControlCenter();
      });
    } catch (requestError) {
      setError(requestError.message || 'Unable to assign the task right now.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMemberDraftChange = (member, field, value) => {
    setMemberDrafts((previous) => ({
      ...previous,
      [member.id]: {
        ...buildMemberDraft(member, previous[member.id]),
        [field]: value,
      },
    }));
  };

  const handleSaveMember = async (member) => {
    const draft = buildMemberDraft(member, memberDrafts[member.id]);
    setSavingMemberId(member.id);
    setError('');
    setSuccess('');

    try {
      await updateTeamMember(member.id, draft);
      setSuccess(`${member.full_name || member.email} updated successfully.`);
      startTransition(() => {
        loadControlCenter();
      });
    } catch (requestError) {
      setError(requestError.message || 'Unable to update that team member.');
    } finally {
      setSavingMemberId(null);
    }
  };

  const handleQuickStatusChange = async (taskId, status) => {
    setUpdatingTaskId(taskId);
    setError('');
    try {
      await updateStaffTask(taskId, { status });
      startTransition(() => {
        loadControlCenter();
      });
    } catch (requestError) {
      setError(requestError.message || 'Unable to update task status.');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;

    setUpdatingTaskId(taskId);
    setError('');
    try {
      await deleteStaffTask(taskId);
      setSuccess('Task removed.');
      startTransition(() => {
        loadControlCenter();
      });
    } catch (requestError) {
      setError(requestError.message || 'Unable to delete the task.');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (currentUser && !canManage) {
    return <div className="team-control-page">Redirecting to your workspace...</div>;
  }

  return (
    <div className="team-control-page">
      <main className="team-control-main">
        <header className="team-control-hero">
          <div>
            <p className="team-control-eyebrow">Internal Delivery</p>
            <h1>Team Control Center</h1>
            <p className="team-control-copy">
              Assign work to designers, developers, QA, and other internal staff without leaving the admin dashboard.
            </p>
          </div>
          <div className="team-control-links">
            <Link href="/dashboard-admin/workspace" className="team-link-secondary">
              Open My Workspace
            </Link>
            <Link href="/dashboard-admin" className="team-link-primary">
              Back to Overview
            </Link>
          </div>
        </header>

        {error && <div className="team-alert team-alert-error">{error}</div>}
        {success && <div className="team-alert team-alert-success">{success}</div>}

        <section className="team-stat-grid">
          <article className="team-stat-card">
            <span>Staff</span>
            <strong>{dashboard?.staff_count ?? 0}</strong>
            <p>Active internal accounts</p>
          </article>
          <article className="team-stat-card">
            <span>Open Tasks</span>
            <strong>{dashboard?.open_tasks ?? 0}</strong>
            <p>Work currently in the pipeline</p>
          </article>
          <article className="team-stat-card">
            <span>Review Queue</span>
            <strong>{dashboard?.in_review_tasks ?? 0}</strong>
            <p>Tasks waiting for approval</p>
          </article>
          <article className="team-stat-card">
            <span>Overdue</span>
            <strong>{dashboard?.overdue_tasks ?? 0}</strong>
            <p>Deadlines needing attention</p>
          </article>
        </section>

        <section className="team-layout">
          <article className="team-panel">
            <div className="team-panel-header">
              <div>
                <h2>Assign a Task</h2>
                <p>Create work for your internal delivery team.</p>
              </div>
            </div>

            <form className="team-form" onSubmit={handleCreateTask}>
              <label>
                Task title
                <input
                  name="title"
                  value={taskForm.title}
                  onChange={handleTaskFormChange}
                  placeholder="Homepage redesign"
                  required
                />
              </label>

              <div className="team-form-grid">
                <label>
                  Team
                  <select name="team" value={taskForm.team} onChange={handleTaskFormChange}>
                    <option value="">Auto from assignee</option>
                    {TEAM_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Assignee
                  <select
                    name="assigned_to_id"
                    value={taskForm.assigned_to_id}
                    onChange={handleTaskFormChange}
                  >
                    <option value="">Unassigned backlog</option>
                    {assignableMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.full_name || member.email} {member.staff_title ? `• ${member.staff_title}` : ''}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Priority
                  <select name="priority" value={taskForm.priority} onChange={handleTaskFormChange}>
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Due date
                  <input
                    type="datetime-local"
                    name="due_at"
                    value={taskForm.due_at}
                    onChange={handleTaskFormChange}
                  />
                </label>
              </div>

              <label>
                Estimated hours
                <input
                  type="number"
                  min="1"
                  name="estimated_hours"
                  value={taskForm.estimated_hours}
                  onChange={handleTaskFormChange}
                  placeholder="6"
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={taskForm.description}
                  onChange={handleTaskFormChange}
                  placeholder="Outline the deliverable and context."
                  rows="4"
                />
              </label>

              <label>
                Acceptance criteria
                <textarea
                  name="acceptance_criteria"
                  value={taskForm.acceptance_criteria}
                  onChange={handleTaskFormChange}
                  placeholder="What must be true before this task is approved?"
                  rows="3"
                />
              </label>

              <button type="submit" className="team-primary-button" disabled={submitting}>
                {submitting ? 'Assigning...' : 'Assign Task'}
              </button>
            </form>
          </article>

          <article className="team-panel">
            <div className="team-panel-header">
              <div>
                <h2>Task Queue</h2>
                <p>Watch work move across the internal delivery pipeline.</p>
              </div>
            </div>

            <div className="team-filter-row">
              <input
                value={filters.search}
                onChange={(event) => setFilters((previous) => ({ ...previous, search: event.target.value }))}
                placeholder="Search tasks or assignees"
              />
              <select
                value={filters.status}
                onChange={(event) => setFilters((previous) => ({ ...previous, status: event.target.value }))}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value || 'all'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={filters.team}
                onChange={(event) => setFilters((previous) => ({ ...previous, team: event.target.value }))}
              >
                <option value="">All teams</option>
                {TEAM_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="team-task-list">
              {loading && <div className="team-empty-state">Loading tasks...</div>}

              {!loading && tasks.length === 0 && (
                <div className="team-empty-state">No tasks match the current filters yet.</div>
              )}

              {tasks.map((task) => (
                <article key={task.id} className="team-task-card">
                  <div className="team-task-top">
                    <div>
                      <h3>{task.title}</h3>
                      <p>{task.description || 'No additional brief provided yet.'}</p>
                    </div>
                    <span className={`team-priority-badge priority-${task.priority}`}>
                      {task.priority.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="team-task-meta">
                    <span>{task.assigned_to?.full_name || 'Unassigned'}</span>
                    <span>{task.team || 'No team'}</span>
                    <span>{formatDeadline(task.due_at)}</span>
                    <span>{task.progress_percent}% complete</span>
                  </div>

                  {(task.order_reference || task.inquiry_subject || task.support_ticket_subject) && (
                    <div className="team-task-context">
                      {task.order_reference && <span>Order: {task.order_reference}</span>}
                      {task.inquiry_subject && <span>Inquiry: {task.inquiry_subject}</span>}
                      {task.support_ticket_subject && <span>Support: {task.support_ticket_subject}</span>}
                    </div>
                  )}

                  <div className="team-task-actions">
                    <select
                      value={task.status}
                      onChange={(event) => handleQuickStatusChange(task.id, event.target.value)}
                      disabled={updatingTaskId === task.id}
                    >
                      {STATUS_OPTIONS.filter((option) => option.value).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="team-danger-button"
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={updatingTaskId === task.id}
                    >
                      {updatingTaskId === task.id ? 'Working...' : 'Delete'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="team-panel">
          <div className="team-panel-header">
            <div>
              <h2>Staff Roster</h2>
              <p>Set workspace type, title, and staff access for internal accounts.</p>
            </div>
            <input
              value={memberSearch}
              onChange={(event) => setMemberSearch(event.target.value)}
              placeholder="Search by name or email"
              className="team-member-search"
            />
          </div>

          <div className="team-roster-groups">
            {groupedMembers.map(([group, members]) => (
              <section key={group} className="team-roster-group">
                <div className="team-roster-heading">
                  <h3>{group === 'UNASSIGNED' ? 'Not Yet Staff' : group.replace('_', ' ')}</h3>
                  <span>{members.length} member(s)</span>
                </div>

                <div className="team-member-grid">
                  {members.map((member) => {
                    const draft = buildMemberDraft(member, memberDrafts[member.id]);

                    return (
                      <article key={member.id} className="team-member-card">
                        <div className="team-member-summary">
                          <div>
                            <h4>{member.full_name || member.email}</h4>
                            <p>{member.email}</p>
                          </div>
                          <div className="team-member-metrics">
                            <span>{member.active_task_count || 0} active</span>
                            <span>{member.overdue_task_count || 0} overdue</span>
                          </div>
                        </div>

                        <div className="team-member-fields">
                          <label>
                            Workspace team
                            <select
                              value={draft.staff_team}
                              onChange={(event) => handleMemberDraftChange(member, 'staff_team', event.target.value)}
                            >
                              <option value="">Control/Admin</option>
                              {TEAM_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label>
                            Staff title
                            <input
                              value={draft.staff_title}
                              onChange={(event) => handleMemberDraftChange(member, 'staff_title', event.target.value)}
                              placeholder="Frontend Developer"
                            />
                          </label>
                        </div>

                        <div className="team-member-toggle-row">
                          <label>
                            <input
                              type="checkbox"
                              checked={draft.is_staff}
                              onChange={(event) => handleMemberDraftChange(member, 'is_staff', event.target.checked)}
                            />
                            Staff access
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={draft.is_active}
                              onChange={(event) => handleMemberDraftChange(member, 'is_active', event.target.checked)}
                            />
                            Active account
                          </label>
                        </div>

                        <button
                          type="button"
                          className="team-secondary-button"
                          onClick={() => handleSaveMember(member)}
                          disabled={savingMemberId === member.id}
                        >
                          {savingMemberId === member.id ? 'Saving...' : 'Save Member'}
                        </button>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
