// app/(user)/utils/dashboard.js
export const dashboardUtils = {
  // Format progress percentage with color coding
  getProgressColor(percentage) {
    if (percentage >= 80) return '#10b981'; // Success green
    if (percentage >= 50) return '#f59e0b'; // Warning yellow
    if (percentage >= 20) return '#3b82f6'; // Info blue
    return '#ef4444'; // Danger red
  },

  // Calculate days until deadline
  getDaysUntilDeadline(deadlineDate) {
    if (!deadlineDate) return 'No deadline set';
    
    const today = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    return `${diffDays} days until delivery`;
  },

  // Format currency
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  // Get greeting based on time
  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  },

  // Mock data for development
  getMockStats() {
    return {
      activeProjects: 2,
      completedProjects: 5,
      pendingProjects: 1,
      unreadMessages: 3,
      totalRevenue: 2495,
      activeSubscriptions: 1
    };
  },

  // Mock project data
  getMockProject() {
    return {
      name: 'Business Website - Restaurant',
      type: 'E-commerce Package',
      progress: 60,
      status: 'in-progress',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      template: 'Template A',
      milestones: [
        { name: 'Planning', completed: true, current: false },
        { name: 'Design', completed: true, current: false },
        { name: 'Development', completed: false, current: true },
        { name: 'Review', completed: false, current: false },
        { name: 'Delivery', completed: false, current: false }
      ]
    };
  }
};