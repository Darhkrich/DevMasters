'use client';
import './upload.css';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const UploadFiles = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [storageUsage, setStorageUsage] = useState({
    used: 4.2, // GB
    total: 5, // GB
    percentage: 84
  });
  const [files, setFiles] = useState([
    { 
      id: 1, 
      name: 'company-logo.png', 
      type: 'image', 
      size: 2.4, 
      sizeUnit: 'MB', 
      date: 'Mar 16, 2024',
      folder: 'Logos',
      url: 'https://via.placeholder.com/300x200/6366f1/ffffff?text=Logo',
      selected: false,
      dimensions: '1200 × 800 px',
      uploadDate: 'Mar 16, 2024 at 10:30 AM',
      fileType: 'PNG Image'
    },
    { 
      id: 2, 
      name: 'business-plan.pdf', 
      type: 'pdf', 
      size: 1.8, 
      sizeUnit: 'MB', 
      date: 'Mar 15, 2024',
      folder: 'Documents',
      selected: false,
      dimensions: 'N/A',
      uploadDate: 'Mar 15, 2024 at 2:15 PM',
      fileType: 'PDF Document'
    },
    { 
      id: 3, 
      name: 'content-guide.docx', 
      type: 'doc', 
      size: 0.8, 
      sizeUnit: 'MB', 
      date: 'Mar 14, 2024',
      folder: 'Documents',
      selected: false,
      dimensions: 'N/A',
      uploadDate: 'Mar 14, 2024 at 9:45 AM',
      fileType: 'Word Document'
    },
    { 
      id: 4, 
      name: 'project-assets.zip', 
      type: 'zip', 
      size: 15.2, 
      sizeUnit: 'MB', 
      date: 'Mar 13, 2024',
      folder: 'Archives',
      selected: false,
      dimensions: 'N/A',
      uploadDate: 'Mar 13, 2024 at 4:20 PM',
      fileType: 'ZIP Archive'
    },
    { 
      id: 5, 
      name: 'product-shot.jpg', 
      type: 'image', 
      size: 3.1, 
      sizeUnit: 'MB', 
      date: 'Mar 12, 2024',
      folder: 'Images',
      url: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Product',
      selected: false,
      dimensions: '1920 × 1080 px',
      uploadDate: 'Mar 12, 2024 at 11:10 AM',
      fileType: 'JPEG Image'
    },
    { 
      id: 6, 
      name: 'price-list.xlsx', 
      type: 'xls', 
      size: 0.6, 
      sizeUnit: 'MB', 
      date: 'Mar 11, 2024',
      folder: 'Documents',
      selected: false,
      dimensions: 'N/A',
      uploadDate: 'Mar 11, 2024 at 3:30 PM',
      fileType: 'Excel Spreadsheet'
    }
  ]);
  const [folders, setFolders] = useState([
    { id: 1, name: 'Logos', fileCount: 12, color: '#6366f1' },
    { id: 2, name: 'Images', fileCount: 45, color: '#10b981' },
    { id: 3, name: 'Documents', fileCount: 8, color: '#f59e0b' }
  ]);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [fileTypeFilter, setFileTypeFilter] = useState('All File Types');
  const [sortBy, setSortBy] = useState('Sort by Date');
  const [selectedFileDetails, setSelectedFileDetails] = useState(null);
  const [isFileDetailsOpen, setIsFileDetailsOpen] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedFilesCount, setSelectedFilesCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);
  const uploadZoneRef = useRef(null);

  // Calculate selected files count
  useEffect(() => {
    const count = files.filter(file => file.selected).length;
    setSelectedFilesCount(count);
    setShowBulkActions(count > 0);
  }, [files]);

  // Update storage usage when files change
  useEffect(() => {
    const totalSize = files.reduce((sum, file) => {
      const sizeInGB = file.sizeUnit === 'GB' ? file.size : file.size / 1024;
      return sum + sizeInGB;
    }, 0);
    
    const percentage = Math.min((totalSize / storageUsage.total) * 100, 100);
    setStorageUsage(prev => ({
      ...prev,
      used: parseFloat(totalSize.toFixed(1)),
      percentage: parseFloat(percentage.toFixed(1))
    }));
  }, [files]);

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = () => {
    router.push('/dashboard');
  };

  // Handle menu toggle
  const handleMenuToggle = () => {
    console.log('Menu toggled');
  };

  // Handle file selection
  const handleFileSelect = (fileId) => {
    setFiles(prev => 
      prev.map(file => 
        file.id === fileId ? { ...file, selected: !file.selected } : file
      )
    );
  };

  // Handle select all files
  const handleSelectAll = () => {
    const allSelected = files.every(file => file.selected);
    setFiles(prev => 
      prev.map(file => ({ ...file, selected: !allSelected }))
    );
  };

  // Handle drag and drop
  useEffect(() => {
    const uploadZone = uploadZoneRef.current;
    if (!uploadZone) return;

    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
      uploadZone.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragging(false);
      uploadZone.classList.remove('drag-over');
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      uploadZone.classList.remove('drag-over');
      
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    };

    uploadZone.addEventListener('dragover', handleDragOver);
    uploadZone.addEventListener('dragleave', handleDragLeave);
    uploadZone.addEventListener('drop', handleDrop);

    return () => {
      uploadZone.removeEventListener('dragover', handleDragOver);
      uploadZone.removeEventListener('dragleave', handleDragLeave);
      uploadZone.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Handle file input click
  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  // Process files for upload
  const handleFiles = (fileList) => {
    if (fileList.length === 0) return;

    const newUploads = fileList.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1), // Convert to MB
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(newUploads);
    setIsUploading(true);
    simulateUpload(newUploads);
  };

  // Simulate file upload progress
  const simulateUpload = (uploads) => {
    let currentProgress = 0;
    const totalFiles = uploads.length;
    
    const interval = setInterval(() => {
      currentProgress += 5;
      setUploadProgress(currentProgress);
      
      // Update individual file progress
      setUploadingFiles(prev => 
        prev.map(file => ({
          ...file,
          progress: Math.min(currentProgress + Math.random() * 20, 100)
        }))
      );
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Add uploaded files to file list
          const newFiles = uploads.map((upload, index) => ({
            id: files.length + index + 1,
            name: upload.name,
            type: getFileType(upload.name),
            size: parseFloat(upload.size),
            sizeUnit: 'MB',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            folder: 'Uploads',
            selected: false,
            dimensions: 'N/A',
            uploadDate: new Date().toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true 
            }),
            fileType: getFileTypeName(upload.name)
          }));
          
          setFiles(prev => [...newFiles, ...prev]);
          setUploadingFiles([]);
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      }
    }, 100);
  };

  // Get file type from filename
  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'doc';
    if (['xls', 'xlsx'].includes(ext)) return 'xls';
    if (['zip', 'rar', '7z'].includes(ext)) return 'zip';
    return 'other';
  };

  // Get file type name
  const getFileTypeName = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg'].includes(ext)) return 'JPEG Image';
    if (ext === 'png') return 'PNG Image';
    if (ext === 'pdf') return 'PDF Document';
    if (['doc', 'docx'].includes(ext)) return 'Word Document';
    if (['xls', 'xlsx'].includes(ext)) return 'Excel Spreadsheet';
    if (['zip', 'rar', '7z'].includes(ext)) return 'Archive';
    return 'File';
  };

  // Handle quick upload buttons
  const handleQuickUpload = (type) => {
    switch(type) {
      case 'images':
        // Simulate image file selection
        console.log('Uploading images...');
        const imageFiles = [
          new File([''], 'photo1.jpg', { type: 'image/jpeg' }),
          new File([''], 'photo2.png', { type: 'image/png' })
        ];
        handleFiles(imageFiles);
        break;
      case 'documents':
        console.log('Uploading documents...');
        break;
      case 'create-folder':
        const folderName = prompt('Enter folder name:');
        if (folderName) {
          const newFolder = {
            id: folders.length + 1,
            name: folderName,
            fileCount: 0,
            color: getRandomColor()
          };
          setFolders(prev => [...prev, newFolder]);
        }
        break;
      default:
        break;
    }
  };

  // Generate random color for new folder
  const getRandomColor = () => {
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Handle file actions
  const handleFileAction = (fileId, action) => {
    const file = files.find(f => f.id === fileId);
    
    switch(action) {
      case 'preview':
        setSelectedFileDetails(file);
        setIsFileDetailsOpen(true);
        console.log('Previewing file:', file.name);
        break;
      case 'download':
        console.log('Downloading file:', file.name);
        // In a real app, trigger file download
        const link = document.createElement('a');
        link.href = file.url || '#';
        link.download = file.name;
        link.click();
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
          setFiles(prev => prev.filter(f => f.id !== fileId));
          console.log('File deleted:', file.name);
        }
        break;
      default:
        break;
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    const selectedFiles = files.filter(file => file.selected);
    
    switch(action) {
      case 'download':
        console.log('Downloading selected files:', selectedFiles.map(f => f.name));
        // Implement bulk download
        break;
      case 'move':
        console.log('Moving selected files...');
        // Open move to folder dialog
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) {
          setFiles(prev => prev.filter(file => !file.selected));
          console.log('Files deleted');
        }
        break;
      default:
        break;
    }
  };

  // Handle file details sidebar actions
  const handleFileDetailsAction = (action) => {
    if (!selectedFileDetails) return;
    
    switch(action) {
      case 'download':
        console.log('Downloading file from sidebar:', selectedFileDetails.name);
        break;
      case 'share':
        console.log('Sharing file link');
        // Generate shareable link
        break;
      case 'rename':
        const newName = prompt('Enter new file name:', selectedFileDetails.name);
        if (newName) {
          setFiles(prev => 
            prev.map(file => 
              file.id === selectedFileDetails.id ? { ...file, name: newName } : file
            )
          );
          setSelectedFileDetails(prev => ({ ...prev, name: newName }));
        }
        break;
      case 'delete':
        if (window.confirm(`Delete "${selectedFileDetails.name}"?`)) {
          setFiles(prev => prev.filter(f => f.id !== selectedFileDetails.id));
          setIsFileDetailsOpen(false);
        }
        break;
      default:
        break;
    }
  };

  // Filter and sort files
  const filteredAndSortedFiles = () => {
    let filtered = [...files];
    
    // Apply type filter
    if (fileTypeFilter !== 'All File Types') {
      const typeMap = {
        'Images': 'image',
        'Documents': ['pdf', 'doc', 'xls'],
        'Archives': 'zip'
      };
      
      const filterType = typeMap[fileTypeFilter];
      if (Array.isArray(filterType)) {
        filtered = filtered.filter(file => filterType.includes(file.type));
      } else {
        filtered = filtered.filter(file => file.type === filterType);
      }
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    switch(sortBy) {
      case 'Sort by Name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Sort by Size':
        filtered.sort((a, b) => b.size - a.size);
        break;
      case 'Sort by Date':
      default:
        // Sort by date (most recent first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
    }
    
    return filtered;
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    switch(type) {
      case 'image': return 'fas fa-image';
      case 'pdf': return 'fas fa-file-pdf';
      case 'doc': return 'fas fa-file-word';
      case 'xls': return 'fas fa-file-excel';
      case 'zip': return 'fas fa-file-archive';
      default: return 'fas fa-file';
    }
  };

  // Get file preview placeholder class
  const getFilePlaceholderClass = (type) => {
    switch(type) {
      case 'pdf': return 'pdf';
      case 'doc': return 'doc';
      case 'xls': return 'xls';
      case 'zip': return 'zip';
      default: return '';
    }
  };

  // Close file details sidebar
  const closeFileDetails = () => {
    setIsFileDetailsOpen(false);
    setSelectedFileDetails(null);
  };

  // Format file size with unit
  const formatFileSize = (size, unit) => {
    return `${size} ${unit}`;
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
                  handleBreadcrumbClick();
                }}
              >
                Dashboard
              </a>
              <i className="fas fa-chevron-right"></i>
              <span>File Manager</span>
            </div>
          </div>
          <div className="header-right">
            <div className="storage-indicator">
              <div className="storage-info">
                <span>{storageUsage.used.toFixed(1)} GB of {storageUsage.total} GB used</span>
                <div className="storage-bar">
                  <div 
                    className="storage-fill" 
                    style={{ width: `${storageUsage.percentage}%` }}
                    role="progressbar"
                    aria-valuenow={storageUsage.percentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </div>
            <div className="header-actions">
              <button 
                className="icon-btn"
                onClick={() => console.log('Notifications clicked')}
                aria-label="Notifications"
              >
                <i className="fas fa-bell"></i>
              </button>
            </div>
          </div>
        </header>

        {/* File Manager Content */}
        <div className="content-area">
          {/* Upload Section */}
          <section className="card">
            <div className="card-header">
              <h3>Upload Files</h3>
              <p>Add files to your project. Maximum file size: 50MB</p>
            </div>
            <div className="card-body">
              <div className="upload-container">
                {/* Drag & Drop Zone */}
                <div 
                  className="upload-zone" 
                  id="uploadZone"
                  ref={uploadZoneRef}
                  style={{ 
                    borderColor: isDragging ? '#6366f1' : '',
                    backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.1)' : ''
                  }}
                >
                  <div className="upload-placeholder">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <h4>Drag & Drop Files Here</h4>
                    <p>Supported formats: JPG, PNG, PDF, DOC, ZIP, and more</p>
                    <button 
                      className="btn btn-primary"
                      onClick={handleBrowseFiles}
                    >
                      <i className="fas fa-folder-open"></i>
                      Browse Files
                    </button>
                    <input 
                      type="file" 
                      id="fileInput" 
                      ref={fileInputRef}
                      multiple 
                      style={{ display: 'none' }}
                      onChange={handleFileInputChange}
                    />
                  </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div 
                    className="upload-progress" 
                    id="uploadProgress"
                  >
                    <div className="progress-header">
                      <h4>Uploading Files</h4>
                      <span className="progress-text">{uploadProgress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <div className="file-list-progress">
                      {uploadingFiles.map(file => (
                        <div key={file.id} className="file-progress-item">
                          <span className="file-name">{file.name}</span>
                          <span className="file-progress">{file.progress.toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Upload Buttons */}
                <div className="quick-upload-options">
                  <button 
                    className="quick-upload-btn"
                    onClick={() => handleQuickUpload('images')}
                  >
                    <i className="fas fa-images"></i>
                    Upload Images
                  </button>
                  <button 
                    className="quick-upload-btn"
                    onClick={() => handleQuickUpload('documents')}
                  >
                    <i className="fas fa-file-pdf"></i>
                    Upload Documents
                  </button>
                  <button 
                    className="quick-upload-btn"
                    onClick={() => handleQuickUpload('create-folder')}
                  >
                    <i className="fas fa-folder-plus"></i>
                    Create Folder
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* File Library */}
          <section className="card">
            <div className="card-header">
              <h3>File Library</h3>
              <div className="library-controls">
                <div className="view-toggle">
                  <button 
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                  >
                    <i className="fas fa-th"></i>
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                  >
                    <i className="fas fa-list"></i>
                  </button>
                </div>
                <div className="filter-sort">
                  <select 
                    className="filter-select"
                    value={fileTypeFilter}
                    onChange={(e) => setFileTypeFilter(e.target.value)}
                  >
                    <option>All File Types</option>
                    <option>Images</option>
                    <option>Documents</option>
                    <option>Archives</option>
                  </select>
                  <select 
                    className="filter-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option>Sort by Date</option>
                    <option>Sort by Name</option>
                    <option>Sort by Size</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="card-body">
              {/* Search Bar */}
              <div className="search-section">
                <div className="search-box with-icon">
                  <i className="fas fa-search"></i>
                  <input 
                    type="text" 
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="folder-breadcrumb">
                  <a href="#" className="breadcrumb-item">All Files</a>
                  <i className="fas fa-chevron-right"></i>
                  <span className="breadcrumb-item active">Project Assets</span>
                </div>
              </div>

              {/* Folders Grid */}
              <div className="folders-section">
                <h4>Folders</h4>
                <div className="folders-grid">
                  {folders.map(folder => (
                    <div key={folder.id} className="folder-card">
                      <div className="folder-icon" style={{ color: folder.color }}>
                        <i className="fas fa-folder"></i>
                      </div>
                      <div className="folder-info">
                        <span className="folder-name">{folder.name}</span>
                        <span className="folder-count">{folder.fileCount} files</span>
                      </div>
                      <div className="folder-actions">
                        <button className="icon-btn small">
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                  <div 
                    className="folder-card new-folder"
                    onClick={() => handleQuickUpload('create-folder')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="folder-icon">
                      <i className="fas fa-plus"></i>
                    </div>
                    <div className="folder-info">
                      <span className="folder-name">New Folder</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Files Grid View */}
              <div className="files-section">
                <div className="files-header">
                  <h4>Recent Files ({filteredAndSortedFiles().length})</h4>
                  {files.length > 0 && (
                    <button 
                      className="btn-text select-all-btn"
                      onClick={handleSelectAll}
                    >
                      {files.every(file => file.selected) ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                </div>
                <div 
                  className={`files-${viewMode}`} 
                  id="filesGrid"
                >
                  {filteredAndSortedFiles().map(file => (
                    <div key={file.id} className="file-card">
                      <div className="file-preview">
                        {file.type === 'image' && file.url ? (
                          <img src={file.url} alt={file.name} />
                        ) : (
                          <div className={`file-placeholder ${getFilePlaceholderClass(file.type)}`}>
                            <i className={getFileIcon(file.type)}></i>
                          </div>
                        )}
                        <div className="file-overlay">
                          <button 
                            className="btn-icon" 
                            title="Preview"
                            onClick={() => handleFileAction(file.id, 'preview')}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="btn-icon" 
                            title="Download"
                            onClick={() => handleFileAction(file.id, 'download')}
                          >
                            <i className="fas fa-download"></i>
                          </button>
                          <button 
                            className="btn-icon" 
                            title="Delete"
                            onClick={() => handleFileAction(file.id, 'delete')}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                        <div className="file-type-badge">
                          <i className={getFileIcon(file.type)}></i>
                        </div>
                      </div>
                      <div className="file-info">
                        <span className="file-name">{file.name}</span>
                        <span className="file-meta">
                          {formatFileSize(file.size, file.sizeUnit)} • {file.date}
                        </span>
                      </div>
                      <div className="file-checkbox">
                        <input 
                          type="checkbox" 
                          checked={file.selected}
                          onChange={() => handleFileSelect(file.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bulk Actions */}
              {showBulkActions && (
                <div 
                  className="bulk-actions" 
                  id="bulkActions"
                >
                  <div className="bulk-actions-bar">
                    <span className="selected-count">{selectedFilesCount} files selected</span>
                    <div className="bulk-buttons">
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => handleBulkAction('download')}
                      >
                        <i className="fas fa-download"></i>
                        Download
                      </button>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => handleBulkAction('move')}
                      >
                        <i className="fas fa-folder"></i>
                        Move
                      </button>
                      <button 
                        className="btn btn-outline btn-sm error"
                        onClick={() => handleBulkAction('delete')}
                      >
                        <i className="fas fa-trash"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* File Details Sidebar */}
          {isFileDetailsOpen && selectedFileDetails && (
            <div 
              className="file-details-sidebar" 
              id="fileDetails"
              style={{ display: 'block' }}
            >
              <div className="sidebar-header">
                <h4>File Details</h4>
                <button 
                  className="icon-btn" 
                  id="closeDetails"
                  onClick={closeFileDetails}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="sidebar-content">
                <div className="file-preview-large">
                  {selectedFileDetails.type === 'image' && selectedFileDetails.url ? (
                    <img 
                      src={selectedFileDetails.url} 
                      alt="File Preview" 
                      id="detailPreview" 
                    />
                  ) : (
                    <div className="file-placeholder-large">
                      <i className={getFileIcon(selectedFileDetails.type)}></i>
                      <span>{selectedFileDetails.fileType}</span>
                    </div>
                  )}
                </div>
                <div className="file-details-info">
                  <div className="detail-item">
                    <span className="detail-label">File Name</span>
                    <span className="detail-value" id="detailName">
                      {selectedFileDetails.name}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">File Type</span>
                    <span className="detail-value" id="detailType">
                      {selectedFileDetails.fileType}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">File Size</span>
                    <span className="detail-value" id="detailSize">
                      {formatFileSize(selectedFileDetails.size, selectedFileDetails.sizeUnit)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Dimensions</span>
                    <span className="detail-value" id="detailDimensions">
                      {selectedFileDetails.dimensions}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Uploaded</span>
                    <span className="detail-value" id="detailDate">
                      {selectedFileDetails.uploadDate}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Folder</span>
                    <span className="detail-value" id="detailFolder">
                      {selectedFileDetails.folder}
                    </span>
                  </div>
                </div>
                <div className="file-actions-sidebar">
                  <button 
                    className="btn btn-primary full-width"
                    onClick={() => handleFileDetailsAction('download')}
                  >
                    <i className="fas fa-download"></i>
                    Download File
                  </button>
                  <button 
                    className="btn btn-outline full-width"
                    onClick={() => handleFileDetailsAction('share')}
                  >
                    <i className="fas fa-share"></i>
                    Share Link
                  </button>
                  <button 
                    className="btn btn-outline full-width"
                    onClick={() => handleFileDetailsAction('rename')}
                  >
                    <i className="fas fa-edit"></i>
                    Rename
                  </button>
                  <button 
                    className="btn btn-outline error full-width"
                    onClick={() => handleFileDetailsAction('delete')}
                  >
                    <i className="fas fa-trash"></i>
                    Delete File
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UploadFiles;