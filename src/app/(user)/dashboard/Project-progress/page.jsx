'use client';
import './styles.css';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const ProjectProgress = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [projectData, setProjectData] = useState({
    title: 'Restaurant Website Progress',
    type: 'E-commerce Package',
    startDate: 'March 15, 2024',
    deadline: 'April 6, 2024',
    overallProgress: 60,
    status: 'in-progress'
  });
  const [projectStats, setProjectStats] = useState({
    tasksCompleted: 12,
    tasksRemaining: 8,
    daysUntilDeadline: 3,
    teamMembers: 3,
    lastUpdate: 'Today, 10:30 AM'
  });
  const [phases, setPhases] = useState([
    {
      id: 1,
      title: 'Project Planning',
      status: 'completed',
      dates: 'Mar 15 - Mar 17, 2024',
      progress: 100,
      tasks: [
        { id: 1, name: 'Requirements gathering', status: 'completed' },
        { id: 2, name: 'Project scope definition', status: 'completed' },
        { id: 3, name: 'Timeline creation', status: 'completed' }
      ],
      team: []
    },
    {
      id: 2,
      title: 'Design Phase',
      status: 'completed',
      dates: 'Mar 18 - Mar 22, 2024',
      progress: 100,
      tasks: [
        { id: 4, name: 'UI/UX design creation', status: 'completed' },
        { id: 5, name: 'Client design approval', status: 'completed' },
        { id: 6, name: 'Color scheme finalization', status: 'completed' }
      ],
      team: []
    },
    {
      id: 3,
      title: 'Development',
      status: 'current',
      dates: 'Mar 23 - Apr 2, 2024',
      progress: 60,
      tasks: [
        { id: 7, name: 'Frontend development', status: 'completed' },
        { id: 8, name: 'Homepage creation', status: 'completed' },
        { id: 9, name: 'Menu page development', status: 'in-progress' },
        { id: 10, name: 'Online ordering system', status: 'pending' },
        { id: 11, name: 'Contact form integration', status: 'pending' }
      ],
      team: [
        { id: 1, name: 'Sam Developer', role: 'Frontend Developer', avatar: 'https://ui-avatars.com/api/?name=Developer&background=6366f1&color=fff' },
        { id: 2, name: 'Alex Designer', role: 'UI/UX Designer', avatar: 'https://ui-avatars.com/api/?name=Designer&background=10b981&color=fff' }
      ]
    },
    {
      id: 4,
      title: 'Client Review',
      status: 'upcoming',
      dates: 'Apr 3 - Apr 5, 2024',
      progress: 0,
      tasks: [
        { id: 12, name: 'Client testing period', status: 'pending' },
        { id: 13, name: 'Feedback collection', status: 'pending' },
        { id: 14, name: 'Revisions implementation', status: 'pending' }
      ],
      team: []
    },
    {
      id: 5,
      title: 'Final Delivery',
      status: 'upcoming',
      dates: 'Apr 6, 2024',
      progress: 0,
      tasks: [
        { id: 15, name: 'Final quality assurance', status: 'pending' },
        { id: 16, name: 'Website deployment', status: 'pending' },
        { id: 17, name: 'Client handover', status: 'pending' }
      ],
      team: []
    }
  ]);
  const [activities, setActivities] = useState([
    { id: 1, type: 'success', icon: 'fas fa-code', user: 'Sam Developer', action: 'completed homepage development', time: '2 hours ago' },
    { id: 2, type: 'primary', icon: 'fas fa-comment', user: 'Design Team', action: 'sent design approval request', time: '1 day ago' },
    { id: 3, type: 'warning', icon: 'fas fa-upload', user: 'You', action: 'uploaded restaurant menu content', time: '2 days ago' },
    { id: 4, type: 'info', icon: 'fas fa-tasks', user: 'Project Manager', action: 'updated project timeline', time: '3 days ago' }
  ]);
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Sarah Johnson', role: 'Project Manager', email: 'sarah@webcraft.com', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff', online: true },
    { id: 2, name: 'Alex Designer', role: 'UI/UX Designer', email: 'alex@webcraft.com', avatar: 'https://ui-avatars.com/api/?name=Alex+Designer&background=10b981&color=fff', online: true },
    { id: 3, name: 'Sam Developer', role: 'Frontend Developer', email: 'sam@webcraft.com', avatar: 'https://ui-avatars.com/api/?name=Sam+Developer&background=f59e0b&color=fff', online: false }
  ]);
  const [milestones, setMilestones] = useState([
    { id: 1, title: 'Project Planning Complete', date: 'Mar 17, 2024', status: 'completed' },
    { id: 2, title: 'Design Approval', date: 'Mar 22, 2024', status: 'completed' },
    { id: 3, title: 'Development Phase', date: 'Due Apr 2, 2024', status: 'current' },
    { id: 4, title: 'Client Review', date: 'Due Apr 5, 2024', status: 'upcoming' },
    { id: 5, title: 'Project Delivery', date: 'Due Apr 6, 2024', status: 'upcoming' }
  ]);
  const [previewFeatures, setPreviewFeatures] = useState([
    { id: 1, name: 'Responsive Homepage', status: 'completed' },
    { id: 2, name: 'Menu Page Development', status: 'in-progress' },
    { id: 3, name: 'Online Ordering System', status: 'pending' },
    { id: 4, name: 'Contact Form Integration', status: 'pending' }
  ]);
  const [currentPhase, setCurrentPhase] = useState('Development');
  const [nextMilestone, setNextMilestone] = useState('Menu Page Completion');
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const autoProgressInterval = useRef(null);

  // Calculate days until deadline
  useEffect(() => {
    const calculateDaysUntilDeadline = () => {
      const deadline = new Date('2024-04-06');
      const today = new Date();
      const timeDiff = deadline.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      setProjectStats(prev => ({
        ...prev,
        daysUntilDeadline: daysDiff > 0 ? daysDiff : 0
      }));
    };

    calculateDaysUntilDeadline();
    const interval = setInterval(calculateDaysUntilDeadline, 24 * 60 * 60 * 1000); // Update daily
    
    return () => clearInterval(interval);
  }, []);

  // Simulate auto-progress for current phase (demo purposes)
  useEffect(() => {
    autoProgressInterval.current = setInterval(() => {
      setPhases(prev => 
        prev.map(phase => {
          if (phase.status === 'current') {
            const newProgress = Math.min(phase.progress + 1, 100);
            const allTasksCompleted = newProgress === 100;
            
            if (allTasksCompleted) {
              // Move to next phase
              const nextPhaseIndex = prev.findIndex(p => p.id === phase.id) + 1;
              if (nextPhaseIndex < prev.length) {
                setTimeout(() => {
                  setPhases(prevPhases => 
                    prevPhases.map(p => {
                      if (p.id === phase.id) return { ...p, status: 'completed', progress: 100 };
                      if (p.id === prev[nextPhaseIndex].id) return { ...p, status: 'current' };
                      return p;
                    })
                  );
                }, 1000);
              }
            }
            
            return { ...phase, progress: newProgress };
          }
          return phase;
        })
      );
    }, 30000); // Update every 30 seconds

    return () => {
      if (autoProgressInterval.current) {
        clearInterval(autoProgressInterval.current);
      }
    };
  }, []);

  // Calculate overall progress from phases
  useEffect(() => {
    const totalProgress = phases.reduce((sum, phase) => sum + phase.progress, 0);
    const overallProgress = Math.round(totalProgress / phases.length);
    
    setProjectData(prev => ({
      ...prev,
      overallProgress
    }));

    // Calculate tasks completed and remaining
    const allTasks = phases.flatMap(phase => phase.tasks);
    const completedTasks = allTasks.filter(task => task.status === 'completed').length;
    const remainingTasks = allTasks.filter(task => task.status !== 'completed').length;
    
    setProjectStats(prev => ({
      ...prev,
      tasksCompleted: completedTasks,
      tasksRemaining: remainingTasks
    }));

    // Find current phase
    const current = phases.find(phase => phase.status === 'current');
    if (current) {
      setCurrentPhase(current.title);
    }

    // Find next milestone
    const nextMilestone = milestones.find(m => m.status === 'current' || m.status === 'upcoming');
    if (nextMilestone) {
      setNextMilestone(nextMilestone.title);
    }
  }, [phases, milestones]);

  // Handle menu toggle
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    console.log('Menu toggled:', !isMenuOpen);
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbNavigation = (path) => {
    switch(path) {
      case 'dashboard':
        router.push('/dashboard');
        break;
      case 'project-details':
        router.push('/dashboard-project');
        break;
      default:
        break;
    }
  };

  // Handle project actions
  const handleProjectAction = (action) => {
    switch(action) {
      case 'download-report':
        console.log('Downloading progress report...');
        // Generate and download report
        const reportData = {
          project: projectData,
          stats: projectStats,
          phases: phases,
          milestones: milestones
        };
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `progress-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        break;
      case 'request-update':
        console.log('Requesting progress update...');
        // Simulate team update
        const newActivity = {
          id: activities.length + 1,
          type: 'info',
          icon: 'fas fa-bell',
          user: 'Project Manager',
          action: 'sent progress update upon request',
          time: 'Just now'
        };
        setActivities(prev => [newActivity, ...prev]);
        setProjectStats(prev => ({
          ...prev,
          lastUpdate: 'Just now'
        }));
        break;
      default:
        break;
    }
  };

  // Handle timeline actions
  const handleTimelineAction = (action) => {
    switch(action) {
      case 'expand':
        setIsTimelineExpanded(!isTimelineExpanded);
        console.log('Timeline expanded:', !isTimelineExpanded);
        break;
      default:
        break;
    }
  };

  // Handle team member actions
  const handleTeamMemberAction = (memberId, action) => {
    const member = teamMembers.find(m => m.id === memberId);
    
    switch(action) {
      case 'email':
        console.log('Opening email to:', member.email);
        window.location.href = `mailto:${member.email}`;
        break;
      case 'chat':
        console.log('Opening chat with:', member.name);
        // Open chat interface
        break;
      default:
        break;
    }
  };

  // Handle quick actions
  const handleQuickAction = (action) => {
    switch(action) {
      case 'request-update':
        handleProjectAction('request-update');
        break;
      case 'download-report':
        handleProjectAction('download-report');
        break;
      case 'schedule-call':
        console.log('Scheduling call...');
        // Open calendar scheduling
        break;
      case 'report-issue':
        console.log('Reporting issue...');
        // Open issue reporting form
        break;
      default:
        break;
    }
  };

  // Handle preview actions
  const handlePreviewAction = (action) => {
    switch(action) {
      case 'full-preview':
        console.log('Opening full preview...');
        window.open('https://project-preview.example.com', '_blank');
        break;
      case 'live-preview':
        console.log('Opening live preview...');
        window.open('https://restaurant-website-preview.example.com', '_blank');
        break;
      case 'mobile-view':
        console.log('Opening mobile view...');
        window.open('https://restaurant-website-preview.example.com?view=mobile', '_blank');
        break;
      default:
        break;
    }
  };

  // Handle task completion (for demo purposes)
  const handleTaskComplete = (phaseId, taskId) => {
    setPhases(prev => 
      prev.map(phase => {
        if (phase.id === phaseId) {
          return {
            ...phase,
            tasks: phase.tasks.map(task => 
              task.id === taskId ? { ...task, status: 'completed' } : task
            )
          };
        }
        return phase;
      })
    );

    // Add activity
    const phase = phases.find(p => p.id === phaseId);
    const task = phase?.tasks.find(t => t.id === taskId);
    if (task) {
      const newActivity = {
        id: activities.length + 1,
        type: 'success',
        icon: 'fas fa-check',
        user: 'You',
        action: `marked "${task.name}" as complete`,
        time: 'Just now'
      };
      setActivities(prev => [newActivity, ...prev]);
    }
  };

  // Get phase status badge
  const getPhaseStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return 'completed';
      case 'current':
        return 'in-progress';
      case 'upcoming':
        return 'upcoming';
      default:
        return '';
    }
  };

  // Get phase status text
  const getPhaseStatusText = (status) => {
    switch(status) {
      case 'completed':
        return 'Completed';
      case 'current':
        return 'In Progress';
      case 'upcoming':
        return 'Upcoming';
      default:
        return '';
    }
  };

  // Get phase marker icon
  const getPhaseMarkerIcon = (status) => {
    switch(status) {
      case 'completed':
        return 'fas fa-check';
      case 'current':
        return 'fas fa-spinner';
      default:
        return 'far fa-circle';
    }
  };

  // Get task icon
  const getTaskIcon = (status) => {
    switch(status) {
      case 'completed':
        return 'fas fa-check-circle';
      case 'in-progress':
        return 'fas fa-spinner';
      default:
        return 'far fa-circle';
    }
  };

  // Get task class
  const getTaskClass = (status) => {
    switch(status) {
      case 'completed':
        return 'task-item completed';
      case 'in-progress':
        return 'task-item in-progress';
      default:
        return 'task-item pending';
    }
  };

  // Get activity icon class
  const getActivityIconClass = (type) => {
    switch(type) {
      case 'success':
        return 'activity-icon success';
      case 'primary':
        return 'activity-icon primary';
      case 'warning':
        return 'activity-icon warning';
      case 'info':
        return 'activity-icon info';
      default:
        return 'activity-icon';
    }
  };

  // Get milestone icon
  const getMilestoneIcon = (status) => {
    switch(status) {
      case 'completed':
        return 'fas fa-check';
      case 'current':
        return 'fas fa-spinner';
      default:
        return 'far fa-circle';
    }
  };

  // Get milestone class
  const getMilestoneClass = (status) => {
    switch(status) {
      case 'completed':
        return 'milestone-item completed';
      case 'current':
        return 'milestone-item current';
      default:
        return 'milestone-item upcoming';
    }
  };

  // Get feature status icon
  const getFeatureStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return 'fas fa-check';
      case 'in-progress':
        return 'fas fa-spinner';
      default:
        return 'far fa-circle';
    }
  };

  // Get feature status class
  const getFeatureStatusClass = (status) => {
    switch(status) {
      case 'completed':
        return 'feature-item completed';
      case 'in-progress':
        return 'feature-item in-progress';
      default:
        return 'feature-item pending';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="dashboard-container">
      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <button 
              className="menu-toggle" 
              id="menuToggle"
              onClick={handleMenuToggle}
            >
              <i className="fas fa-bars"></i>
            </button>
            <div className="breadcrumb">
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleBreadcrumbNavigation('dashboard');
                }}
              >
                Dashboard
              </a>
              <i className="fas fa-chevron-right"></i>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleBreadcrumbNavigation('project-details');
                }}
              >
                Restaurant Website
              </a>
              <i className="fas fa-chevron-right"></i>
              <span>Project Progress</span>
            </div>
          </div>
          <div className="header-right">
            <div className="project-deadline">
              <i className="fas fa-clock"></i>
              <span>{projectStats.daysUntilDeadline} days until delivery</span>
            </div>
            <div className="header-actions">
              <button 
                className="icon-btn"
                onClick={() => console.log('Notifications clicked')}
              >
                <i className="fas fa-bell"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Progress Content */}
        <div className="content-area">
          {/* Project Overview */}
          <section className="progress-overview">
            <div className="overview-header">
              <div className="project-basic-info">
                <h1>{projectData.title}</h1>
                <p>{projectData.type} • Started {projectData.startDate}</p>
                <div className={`project-status-badge ${projectData.status}`}>
                  <i className="fas fa-sync-alt"></i>
                  {getPhaseStatusText(projectData.status)} - {projectData.overallProgress}% Complete
                </div>
              </div>
              <div className="overview-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => handleProjectAction('download-report')}
                >
                  <i className="fas fa-download"></i>
                  Progress Report
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleProjectAction('request-update')}
                >
                  <i className="fas fa-sync"></i>
                  Request Update
                </button>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="progress-stats-grid">
              <div className="progress-stat-card">
                <div className="stat-icon">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <div className="stat-info">
                  <h3>{projectStats.tasksCompleted}</h3>
                  <p>Tasks Completed</p>
                </div>
              </div>
              <div className="progress-stat-card">
                <div className="stat-icon">
                  <i className="fas fa-list-ul"></i>
                </div>
                <div className="stat-info">
                  <h3>{projectStats.tasksRemaining}</h3>
                  <p>Tasks Remaining</p>
                </div>
              </div>
              <div className="progress-stat-card">
                <div className="stat-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-info">
                  <h3>{projectStats.daysUntilDeadline}</h3>
                  <p>Days Until Deadline</p>
                </div>
              </div>
              <div className="progress-stat-card">
                <div className="stat-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-info">
                  <h3>{projectStats.teamMembers}</h3>
                  <p>Team Members</p>
                </div>
              </div>
            </div>
          </section>

          {/* Main Progress Content */}
          <div className="progress-content-columns">
            {/* Left Column - Progress Timeline */}
            <div className="column">
              {/* Progress Timeline */}
              <section className="card">
                <div className="card-header">
                  <h3>Project Timeline</h3>
                  <div className="timeline-actions">
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => handleTimelineAction('expand')}
                    >
                      <i className="fas fa-expand"></i>
                      {isTimelineExpanded ? 'Collapse' : 'Full View'}
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div 
                    className={`progress-timeline ${isTimelineExpanded ? 'expanded' : ''}`}
                    style={{ maxHeight: isTimelineExpanded ? 'none' : '800px' }}
                  >
                    {phases.map((phase) => (
                      <div 
                        key={phase.id} 
                        className={`timeline-phase ${phase.status}`}
                      >
                        <div className="phase-header">
                          <div className="phase-marker">
                            <i className={getPhaseMarkerIcon(phase.status)}></i>
                          </div>
                          <div className="phase-info">
                            <h4>{phase.title}</h4>
                            <span className="phase-dates">{phase.dates}</span>
                          </div>
                          <div className="phase-status">
                            <span className={`status-badge ${getPhaseStatusBadge(phase.status)}`}>
                              {getPhaseStatusText(phase.status)}
                            </span>
                          </div>
                        </div>
                        
                        {phase.status === 'current' && (
                          <div className="phase-progress">
                            <div className="progress-section">
                              <div className="progress-header">
                                <span>Phase Progress</span>
                                <span>{phase.progress}%</span>
                              </div>
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{ width: `${phase.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="phase-tasks">
                          {phase.tasks.map((task) => (
                            <div 
                              key={task.id}
                              className={getTaskClass(task.status)}
                              onClick={() => {
                                if (task.status !== 'completed' && phase.status === 'current') {
                                  handleTaskComplete(phase.id, task.id);
                                }
                              }}
                              style={{ 
                                cursor: (phase.status === 'current' && task.status !== 'completed') ? 'pointer' : 'default'
                              }}
                            >
                              <i className={getTaskIcon(task.status)}></i>
                              <span>{task.name}</span>
                            </div>
                          ))}
                        </div>

                        {phase.team.length > 0 && (
                          <div className="phase-team">
                            <h5>Assigned Team</h5>
                            <div className="team-members-mini">
                              {phase.team.map((member) => (
                                <div key={member.id} className="team-member-mini">
                                  <img src={member.avatar} alt={member.name} />
                                  <span>{member.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Recent Activity */}
              <section className="card">
                <div className="card-header">
                  <h3>Recent Activity</h3>
                  <span className="activity-count">{activities.length} activities</span>
                </div>
                <div className="card-body">
                  <div className="activity-feed">
                    {activities.map((activity) => (
                      <div key={activity.id} className="activity-item">
                        <div className={getActivityIconClass(activity.type)}>
                          <i className={activity.icon}></i>
                        </div>
                        <div className="activity-content">
                          <p>
                            <strong>{activity.user}</strong> {activity.action}
                          </p>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column - Progress Details */}
            <div className="column">
              {/* Progress Summary */}
              <section className="card">
                <div className="card-header">
                  <h3>Progress Summary</h3>
                  <span className="last-update">Updated {projectStats.lastUpdate}</span>
                </div>
                <div className="card-body">
                  <div className="progress-summary">
                    <div className="summary-item">
                      <span>Overall Progress</span>
                      <div className="progress-section">
                        <div className="progress-bar large">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${projectData.overallProgress}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{projectData.overallProgress}%</span>
                      </div>
                    </div>
                    <div className="summary-item">
                      <span>Current Phase</span>
                      <span className="summary-value">{currentPhase}</span>
                    </div>
                    <div className="summary-item">
                      <span>Days Remaining</span>
                      <span className="summary-value">{projectStats.daysUntilDeadline} days</span>
                    </div>
                    <div className="summary-item">
                      <span>Next Milestone</span>
                      <span className="summary-value">{nextMilestone}</span>
                    </div>
                    <div className="summary-item">
                      <span>Last Update</span>
                      <span className="summary-value">{projectStats.lastUpdate}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Team Members */}
              <section className="card">
                <div className="card-header">
                  <h3>Project Team</h3>
                  <span className="online-count">
                    {teamMembers.filter(m => m.online).length} online
                  </span>
                </div>
                <div className="card-body">
                  <div className="project-team">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="team-member-card">
                        <div className="member-avatar">
                          <img src={member.avatar} alt={member.name} />
                          <span className={`online-indicator ${member.online ? '' : 'offline'}`}></span>
                        </div>
                        <div className="member-details">
                          <h5>{member.name}</h5>
                          <span className="member-role">{member.role}</span>
                          <span className="member-contact">{member.email}</span>
                        </div>
                        <div className="member-actions">
                          <button 
                            className="icon-btn small"
                            onClick={() => handleTeamMemberAction(member.id, 'email')}
                            title={`Email ${member.name}`}
                          >
                            <i className="fas fa-envelope"></i>
                          </button>
                          {member.online && (
                            <button 
                              className="icon-btn small"
                              onClick={() => handleTeamMemberAction(member.id, 'chat')}
                              title={`Chat with ${member.name}`}
                            >
                              <i className="fas fa-comment"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Milestones */}
              <section className="card">
                <div className="card-header">
                  <h3>Key Milestones</h3>
                  <span className="milestone-progress">
                    {milestones.filter(m => m.status === 'completed').length}/{milestones.length} completed
                  </span>
                </div>
                <div className="card-body">
                  <div className="milestones-list">
                    {milestones.map((milestone) => (
                      <div 
                        key={milestone.id} 
                        className={getMilestoneClass(milestone.status)}
                        onClick={() => console.log(`Milestone clicked: ${milestone.title}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="milestone-icon">
                          <i className={getMilestoneIcon(milestone.status)}></i>
                        </div>
                        <div className="milestone-content">
                          <span className="milestone-title">{milestone.title}</span>
                          <span className="milestone-date">{milestone.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Quick Actions */}
              <section className="card">
                <div className="card-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="card-body">
                  <div className="quick-actions-grid">
                    <button 
                      className="quick-action-btn"
                      onClick={() => handleQuickAction('request-update')}
                    >
                      <i className="fas fa-comment"></i>
                      <span>Request Update</span>
                    </button>
                    <button 
                      className="quick-action-btn"
                      onClick={() => handleQuickAction('download-report')}
                    >
                      <i className="fas fa-download"></i>
                      <span>Download Report</span>
                    </button>
                    <button 
                      className="quick-action-btn"
                      onClick={() => handleQuickAction('schedule-call')}
                    >
                      <i className="fas fa-calendar"></i>
                      <span>Schedule Call</span>
                    </button>
                    <button 
                      className="quick-action-btn"
                      onClick={() => handleQuickAction('report-issue')}
                    >
                      <i className="fas fa-flag"></i>
                      <span>Report Issue</span>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Project Preview */}
          <section className="card">
            <div className="card-header">
              <h3>Live Preview</h3>
              <button 
                className="btn btn-outline"
                onClick={() => handlePreviewAction('full-preview')}
              >
                <i className="fas fa-external-link-alt"></i>
                Open Full Preview
              </button>
            </div>
            <div className="card-body">
              <div className="project-preview-container">
                <div className="preview-frame">
                  <img 
                    src="https://via.placeholder.com/800x450/6366f1/ffffff?text=Website+Preview" 
                    alt="Website Preview" 
                    className="preview-image"
                    onClick={() => handlePreviewAction('live-preview')}
                    style={{ cursor: 'pointer' }}
                  />
                  <div className="preview-overlay">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handlePreviewAction('live-preview')}
                    >
                      <i className="fas fa-eye"></i>
                      View Live Preview
                    </button>
                    <button 
                      className="btn btn-outline"
                      onClick={() => handlePreviewAction('mobile-view')}
                    >
                      <i className="fas fa-mobile-alt"></i>
                      Mobile View
                    </button>
                  </div>
                </div>
                <div className="preview-notes">
                  <h4>Current Development Status</h4>
                  <p>The homepage is complete and responsive. We're currently working on the menu page and online ordering functionality. The design follows your brand guidelines with the red, white, and black color scheme.</p>
                  <div className="preview-features">
                    {previewFeatures.map((feature) => (
                      <div 
                        key={feature.id}
                        className={getFeatureStatusClass(feature.status)}
                        onClick={() => console.log(`Feature clicked: ${feature.name}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className={getFeatureStatusIcon(feature.status)}></i>
                        <span>{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProjectProgress;