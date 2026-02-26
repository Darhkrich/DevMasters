'use client';

import { useState, useEffect, useRef } from 'react';
import './upload.css';

const AdminFileDashboard = () => {
  const [receivedFiles, setReceivedFiles] = useState([
    {
      id: 1,
      name: 'website_design_final.pdf',
      type: 'document',
      size: '2.4 MB',
      uploadedBy: 'Sarah Smith',
      userEmail: 'sarah@ecommerce.com',
      uploadedAt: '2024-01-15 10:30:45',
      status: 'pending',
      priority: 'high',
      category: 'Design',
      project: 'E-commerce Store',
      downloadUrl: '#',
      previewUrl: '#',
      notes: 'Final design approval needed'
    },
    {
      id: 2,
      name: 'logo_variations.zip',
      type: 'archive',
      size: '15.2 MB',
      uploadedBy: 'Mike Johnson',
      userEmail: 'mike@portfolio.com',
      uploadedAt: '2024-01-15 09:15:22',
      status: 'reviewed',
      priority: 'medium',
      category: 'Branding',
      project: 'Portfolio Website',
      downloadUrl: '#',
      previewUrl: '#',
      notes: 'Logo package for all variations'
    },
    {
      id: 3,
      name: 'product_video_demo.mp4',
      type: 'video',
      size: '85.7 MB',
      uploadedBy: 'Emily Davis',
      userEmail: 'emily@restaurant.com',
      uploadedAt: '2024-01-14 14:45:10',
      status: 'approved',
      priority: 'low',
      category: 'Marketing',
      project: 'Restaurant Website',
      downloadUrl: '#',
      previewUrl: '#',
      notes: 'Product demonstration video'
    },
    {
      id: 4,
      name: 'bug_report_screenshot.png',
      type: 'image',
      size: '3.1 MB',
      uploadedBy: 'Robert Brown',
      userEmail: 'robert@techstartup.com',
      uploadedAt: '2024-01-14 11:20:33',
      status: 'urgent',
      priority: 'critical',
      category: 'Support',
      project: 'Tech Startup Platform',
      downloadUrl: '#',
      previewUrl: '#',
      notes: 'Bug found on checkout page'
    },
    {
      id: 5,
      name: 'contract_agreement.docx',
      type: 'document',
      size: '1.8 MB',
      uploadedBy: 'Jennifer Wilson',
      userEmail: 'jennifer@consulting.com',
      uploadedAt: '2024-01-13 16:10:55',
      status: 'pending',
      priority: 'high',
      category: 'Legal',
      project: 'Consulting Portal',
      downloadUrl: '#',
      previewUrl: '#',
      notes: 'Contract for signature'
    },
    {
      id: 6,
      name: 'invoice_january.pdf',
      type: 'document',
      size: '850 KB',
      uploadedBy: 'David Miller',
      userEmail: 'david@fashion.com',
      uploadedAt: '2024-01-13 08:45:12',
      status: 'processed',
      priority: 'medium',
      category: 'Billing',
      project: 'Fashion E-commerce',
      downloadUrl: '#',
      previewUrl: '#',
      notes: 'Monthly invoice'
    },
    {
      id: 7,
      name: 'design_feedback.mp3',
      type: 'audio',
      size: '12.3 MB',
      uploadedBy: 'Alex Turner',
      userEmail: 'alex@creative.com',
      uploadedAt: '2024-01-12 15:30:18',
      status: 'reviewed',
      priority: 'low',
      category: 'Feedback',
      project: 'Creative Agency',
      downloadUrl: '#',
      previewUrl: '#',
      notes: 'Voice feedback on designs'
    },
    {
      id: 8,
      name: 'database_backup.sql',
      type: 'database',
      size: '210.5 MB',
      uploadedBy: 'System Admin',
      userEmail: 'admin@system.com',
      uploadedAt: '2024-01-12 03:00:00',
      status: 'archived',
      priority: 'medium',
      category: 'Backup',
      project: 'System Maintenance',
      downloadUrl: '#',
      previewUrl: '#',
      notes: 'Nightly database backup'
    }
  ]);

  const [dashboardStats, setDashboardStats] = useState({
    totalReceived: 156,
    pendingReview: 12,
    todayUploads: 8,
    storageUsed: '3.2 GB',
    urgentFiles: 3,
    processedToday: 5
  });

  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    dateRange: 'today'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeView, setActiveView] = useState('grid'); // 'grid' or 'list'
  const [newFilesCount, setNewFilesCount] = useState(3);

  // Simulate new files arriving
  useEffect(() => {
    const interval = setInterval(() => {
      // In real app, you would fetch from API
      // For demo, we'll simulate occasional new files
      if (Math.random() > 0.7 && newFilesCount > 0) {
        setNewFilesCount(prev => prev - 1);
        setDashboardStats(prev => ({
          ...prev,
          todayUploads: prev.todayUploads + 1,
          totalReceived: prev.totalReceived + 1,
          pendingReview: prev.pendingReview + 1
        }));
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [newFilesCount]);

  const handleStatusUpdate = (fileId, newStatus) => {
    setReceivedFiles(files => 
      files.map(file => 
        file.id === fileId ? { ...file, status: newStatus } : file
      )
    );

    // Update stats
    setDashboardStats(prev => {
      const stats = { ...prev };
      if (newStatus === 'approved' || newStatus === 'processed') {
        stats.pendingReview = Math.max(0, stats.pendingReview - 1);
        stats.processedToday += 1;
      }
      return stats;
    });
  };

  const handlePriorityUpdate = (fileId, newPriority) => {
    setReceivedFiles(files => 
      files.map(file => 
        file.id === fileId ? { ...file, priority: newPriority } : file
      )
    );
  };

  const handleBulkAction = (action) => {
    if (selectedFiles.length === 0) {
      alert('Please select files first');
      return;
    }

    switch(action) {
      case 'approve':
        selectedFiles.forEach(id => handleStatusUpdate(id, 'approved'));
        break;
      case 'reject':
        selectedFiles.forEach(id => handleStatusUpdate(id, 'rejected'));
        break;
      case 'download':
        alert(`Downloading ${selectedFiles.length} files...`);
        break;
      case 'archive':
        selectedFiles.forEach(id => handleStatusUpdate(id, 'archived'));
        break;
      case 'delete':
        if (window.confirm(`Delete ${selectedFiles.length} selected files?`)) {
          setReceivedFiles(files => files.filter(file => !selectedFiles.includes(file.id)));
          setSelectedFiles([]);
          setDashboardStats(prev => ({
            ...prev,
            totalReceived: prev.totalReceived - selectedFiles.length
          }));
        }
        break;
      default:
        break;
    }
  };

  const handleFileSelect = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id));
    }
  };

  const handleFilterChange = (filter, value) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(order => order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f59e0b';
      case 'reviewed': return '#3b82f6';
      case 'approved': return '#10b981';
      case 'processed': return '#8b5cf6';
      case 'urgent': return '#ef4444';
      case 'archived': return '#6b7280';
      case 'rejected': return '#dc2626';
      default: return '#9ca3af';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getFileIcon = (type) => {
    switch(type) {
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'document': return '📄';
      case 'audio': return '🎵';
      case 'archive': return '📦';
      case 'database': return '🗄️';
      default: return '📁';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return '⏳';
      case 'reviewed': return '👁️';
      case 'approved': return '✅';
      case 'processed': return '📥';
      case 'urgent': return '🚨';
      case 'archived': return '🗄️';
      case 'rejected': return '❌';
      default: return '📄';
    }
  };

  const filteredFiles = receivedFiles.filter(file => {
    const matchesStatus = filters.status === 'all' || file.status === filters.status;
    const matchesPriority = filters.priority === 'all' || file.priority === filters.priority;
    const matchesCategory = filters.category === 'all' || file.category === filters.category;
    const matchesSearch = searchQuery === '' || 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.project.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
  }).sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    
    if (sortBy === 'date') {
      return multiplier * (new Date(b.uploadedAt) - new Date(a.uploadedAt));
    }
    if (sortBy === 'size') {
      const sizeA = parseFloat(a.size);
      const sizeB = parseFloat(b.size);
      return multiplier * (sizeB - sizeA);
    }
    if (sortBy === 'name') {
      return multiplier * a.name.localeCompare(b.name);
    }
    if (sortBy === 'priority') {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return multiplier * (priorityOrder[b.priority] - priorityOrder[a.priority]);
    }
    return 0;
  });

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeAgo = (datetime) => {
    const now = new Date();
    const past = new Date(datetime);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="admin-container">
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Received Files</h1>
            <p className="welcome-text">
              Monitor and manage all files sent by users
              {newFilesCount > 0 && (
                <span className="new-files-alert">
                  🚨 {newFilesCount} new file{newFilesCount !== 1 ? 's' : ''} waiting
                </span>
              )}
            </p>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search received files..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button>🔍</button>
            </div>
            <div className="view-toggle">
              <button 
                className={`view-btn ${activeView === 'grid' ? 'active' : ''}`}
                onClick={() => setActiveView('grid')}
                title="Grid View"
              >
                ⏹️
              </button>
              <button 
                className={`view-btn ${activeView === 'list' ? 'active' : ''}`}
                onClick={() => setActiveView('list')}
                title="List View"
              >
                📋
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <span>📥</span>
            </div>
            <div className="stat-info">
              <h3>{dashboardStats.totalReceived}</h3>
              <p>Total Received</p>
              <span className="stat-trend">+8 this week</span>
            </div>
          </div>
          <div className="stat-card urgent">
            <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <span>⚠️</span>
            </div>
            <div className="stat-info">
              <h3>{dashboardStats.pendingReview}</h3>
              <p>Pending Review</p>
              <span className="stat-trend">{dashboardStats.urgentFiles} urgent</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <span>📈</span>
            </div>
            <div className="stat-info">
              <h3>{dashboardStats.todayUploads}</h3>
              <p>Today's Uploads</p>
              <span className="stat-trend positive">Active</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              <span>💾</span>
            </div>
            <div className="stat-info">
              <h3>{dashboardStats.storageUsed}</h3>
              <p>Storage Used</p>
              <span className="stat-trend">65% of capacity</span>
            </div>
          </div>
        </div>

        {/* Filters and Bulk Actions */}
        <div className="filters-bar">
          <div className="filter-section">
            <div className="filter-group">
              <label>Status:</label>
              <select 
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="approved">Approved</option>
                <option value="processed">Processed</option>
                <option value="urgent">Urgent</option>
                <option value="archived">Archived</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Priority:</label>
              <select 
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Category:</label>
              <select 
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Design">Design</option>
                <option value="Branding">Branding</option>
                <option value="Marketing">Marketing</option>
                <option value="Support">Support</option>
                <option value="Legal">Legal</option>
                <option value="Billing">Billing</option>
                <option value="Feedback">Feedback</option>
                <option value="Backup">Backup</option>
              </select>
            </div>
          </div>

          <div className="sort-section">
            <div className="sort-buttons">
              <button 
                className={`sort-btn ${sortBy === 'date' ? 'active' : ''}`}
                onClick={() => handleSortChange('date')}
              >
                Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={`sort-btn ${sortBy === 'priority' ? 'active' : ''}`}
                onClick={() => handleSortChange('priority')}
              >
                Priority {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={`sort-btn ${sortBy === 'size' ? 'active' : ''}`}
                onClick={() => handleSortChange('size')}
              >
                Size {sortBy === 'size' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">
                {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
              </span>
              <button 
                className="bulk-action-btn approve"
                onClick={() => handleBulkAction('approve')}
              >
                ✅ Approve
              </button>
              <button 
                className="bulk-action-btn reject"
                onClick={() => handleBulkAction('reject')}
              >
                ❌ Reject
              </button>
              <button 
                className="bulk-action-btn download"
                onClick={() => handleBulkAction('download')}
              >
                📥 Download
              </button>
              <button 
                className="bulk-action-btn archive"
                onClick={() => handleBulkAction('archive')}
              >
                🗄️ Archive
              </button>
              <button 
                className="bulk-action-btn delete"
                onClick={() => handleBulkAction('delete')}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>

        {/* Files Container */}
        <div className="content-card">
          <div className="card-header">
            <h2>Received Files ({filteredFiles.length})</h2>
            <div className="header-actions">
              <button 
                className="select-all-btn"
                onClick={handleSelectAll}
              >
                {selectedFiles.length === filteredFiles.length && filteredFiles.length > 0 
                  ? 'Deselect All' 
                  : 'Select All'}
              </button>
              <button className="refresh-btn">⟳ Refresh</button>
            </div>
          </div>

          {filteredFiles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>No files found</h3>
              <p>Try adjusting your filters or wait for new uploads</p>
            </div>
          ) : activeView === 'grid' ? (
            <div className="files-grid">
              {filteredFiles.map(file => (
                <div 
                  key={file.id} 
                  className={`file-card ${file.priority} ${selectedFiles.includes(file.id) ? 'selected' : ''}`}
                  onClick={() => handleFileSelect(file.id)}
                >
                  <div className="file-checkbox">
                    <input 
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleFileSelect(file.id);
                      }}
                    />
                  </div>
                  
                  <div className="file-header">
                    <div className="file-icon">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="file-title">
                      <h4 title={file.name}>{file.name}</h4>
                      <div className="file-meta">
                        <span className="file-size">{file.size}</span>
                        <span className="file-type">{file.type}</span>
                        <span className="file-category">{file.category}</span>
                      </div>
                    </div>
                    <div 
                      className="file-status"
                      style={{ 
                        backgroundColor: getStatusColor(file.status) + '20',
                        color: getStatusColor(file.status),
                        borderColor: getStatusColor(file.status) + '40'
                      }}
                    >
                      {getStatusIcon(file.status)} {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                    </div>
                  </div>

                  <div className="file-details">
                    <div className="uploader-info">
                      <div className="uploader-avatar">
                        {file.uploadedBy.charAt(0)}
                      </div>
                      <div className="uploader-details">
                        <strong>{file.uploadedBy}</strong>
                        <small>{file.userEmail}</small>
                      </div>
                    </div>
                    <div className="project-info">
                      <span className="project-label">Project:</span>
                      <span className="project-name">{file.project}</span>
                    </div>
                    <div className="time-info">
                      <span className="time-label">Received:</span>
                      <span className="time-ago">{getTimeAgo(file.uploadedAt)}</span>
                      <small className="exact-time">{formatDateTime(file.uploadedAt)}</small>
                    </div>
                  </div>

                  <div className="file-notes">
                    <p>{file.notes}</p>
                  </div>

                  <div className="file-actions">
                    <button 
                      className="action-btn preview"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Previewing ${file.name}`);
                      }}
                    >
                      👁️ Preview
                    </button>
                    <button 
                      className="action-btn download"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Downloading ${file.name}`);
                      }}
                    >
                      ⬇️ Download
                    </button>
                    <div className="priority-selector">
                      <select 
                        value={file.priority}
                        onChange={(e) => {
                          e.stopPropagation();
                          handlePriorityUpdate(file.id, e.target.value);
                        }}
                        style={{ 
                          backgroundColor: getPriorityColor(file.priority) + '20',
                          color: getPriorityColor(file.priority),
                          borderColor: getPriorityColor(file.priority) + '40'
                        }}
                      >
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div className="status-selector">
                      <select 
                        value={file.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(file.id, e.target.value);
                        }}
                        style={{ 
                          backgroundColor: getStatusColor(file.status) + '20',
                          color: getStatusColor(file.status),
                          borderColor: getStatusColor(file.status) + '40'
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="approved">Approved</option>
                        <option value="processed">Processed</option>
                        <option value="urgent">Urgent</option>
                        <option value="archived">Archived</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="files-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input 
                        type="checkbox"
                        checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>File Name</th>
                    <th>Uploaded By</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Received</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map(file => (
                    <tr 
                      key={file.id} 
                      className={`${file.priority} ${selectedFiles.includes(file.id) ? 'selected' : ''}`}
                      onClick={() => handleFileSelect(file.id)}
                    >
                      <td>
                        <input 
                          type="checkbox"
                          checked={selectedFiles.includes(file.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleFileSelect(file.id);
                          }}
                        />
                      </td>
                      <td>
                        <div className="file-cell">
                          <span className="file-icon-small">{getFileIcon(file.type)}</span>
                          <div className="file-info-cell">
                            <strong>{file.name}</strong>
                            <small>{file.project} • {file.category}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="uploader-cell">
                          <strong>{file.uploadedBy}</strong>
                          <small>{file.userEmail}</small>
                        </div>
                      </td>
                      <td>
                        <span className="type-badge">{file.type}</span>
                      </td>
                      <td>{file.size}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ 
                            backgroundColor: getStatusColor(file.status) + '20',
                            color: getStatusColor(file.status)
                          }}
                        >
                          {getStatusIcon(file.status)} {file.status}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="priority-badge"
                          style={{ 
                            backgroundColor: getPriorityColor(file.priority) + '20',
                            color: getPriorityColor(file.priority)
                          }}
                        >
                          {file.priority}
                        </span>
                      </td>
                      <td>
                        <span className="time-cell">{getTimeAgo(file.uploadedAt)}</span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="table-btn preview"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Previewing ${file.name}`);
                            }}
                          >
                            👁️
                          </button>
                          <button 
                            className="table-btn download"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Downloading ${file.name}`);
                            }}
                          >
                            ⬇️
                          </button>
                          <select 
                            value={file.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(file.id, e.target.value);
                            }}
                            className="status-select"
                            style={{ 
                              backgroundColor: getStatusColor(file.status) + '20',
                              color: getStatusColor(file.status)
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="approved">Approved</option>
                            <option value="processed">Processed</option>
                            <option value="urgent">Urgent</option>
                            <option value="archived">Archived</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="content-card">
          <div className="card-header">
            <h2>Recent Activity</h2>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon new">📥</div>
              <div className="activity-content">
                <p><strong>Sarah Smith</strong> uploaded "website_design_final.pdf"</p>
                <small>2 minutes ago • E-commerce Store</small>
              </div>
              <span className="activity-status pending">Pending Review</span>
            </div>
            <div className="activity-item">
              <div className="activity-icon processed">✅</div>
              <div className="activity-content">
                <p><strong>You</strong> approved "logo_variations.zip"</p>
                <small>15 minutes ago • Portfolio Website</small>
              </div>
              <span className="activity-status approved">Approved</span>
            </div>
            <div className="activity-item">
              <div className="activity-icon updated">🔄</div>
              <div className="activity-content">
                <p><strong>System</strong> marked "bug_report_screenshot.png" as urgent</p>
                <small>1 hour ago • Tech Startup Platform</small>
              </div>
              <span className="activity-status urgent">Urgent</span>
            </div>
            <div className="activity-item">
              <div className="activity-icon new">📥</div>
              <div className="activity-content">
                <p><strong>Emily Davis</strong> uploaded "product_video_demo.mp4"</p>
                <small>2 hours ago • Restaurant Website</small>
              </div>
              <span className="activity-status reviewed">Reviewed</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminFileDashboard;