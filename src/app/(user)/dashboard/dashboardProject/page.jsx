'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const DashboardProject = () => {
  const router = useRouter();

  /* ---------------- EXISTING STATES (UNCHANGED) ---------------- */
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [unreadMessages, setUnreadMessages] = useState(5);

  const [projectData, setProjectData] = useState({
    title: 'Business Website - Restaurant',
    type: 'E-commerce Package',
    startDate: 'March 15, 2024',
    status: 'in-progress',
    deadline: '3 days until delivery',
    progress: 60
  });

  const [timelineItems, setTimelineItems] = useState([
    { id: 1, title: 'Project Planning', description: 'Requirements gathering and initial setup', status: 'completed', date: 'Mar 15 - Mar 17, 2024', progress: 100 },
    { id: 2, title: 'Design Phase', description: 'UI/UX design and client approval', status: 'completed', date: 'Mar 18 - Mar 22, 2024', progress: 100 },
    { id: 3, title: 'Development', description: 'Website development and functionality implementation', status: 'current', date: 'Mar 23 - Apr 2, 2024', progress: 60 },
    { id: 4, title: 'Client Review', description: 'Client testing and feedback collection', status: 'pending', date: 'Apr 3 - Apr 5, 2024', progress: 0 },
    { id: 5, title: 'Final Delivery', description: 'Website launch and handover', status: 'pending', date: 'Apr 6, 2024', progress: 0 }
  ]);

  const [teamMessages, setTeamMessages] = useState([
    { id: 1, sender: 'Design Team', avatar: 'https://ui-avatars.com/api/?name=Design+Team&background=6366f1&color=fff', message: "We've completed the initial design mockups for your review.", time: '2 hours ago', unread: true },
    { id: 2, sender: 'Project Manager', avatar: 'https://ui-avatars.com/api/?name=Project+Manager&background=10b981&color=fff', message: 'Could you please provide the restaurant menu prices?', time: '1 day ago', unread: false }
  ]);

  const [files, setFiles] = useState([
    { id: 1, name: 'restaurant-logo.png', size: '2.4 MB', date: 'Uploaded Mar 16, 2024', icon: 'fas fa-image' }
  ]);

  const fileInputRef = useRef(null);

  /* ---------------- NEW: PROJECT SERVICES (FRONTEND ONLY) ---------------- */
  const [projectServices] = useState({
    template: {
      name: 'Restaurant Pro Template',
      price: 250,
      type: 'One-time'
    },
    aiAutomation: [
      { name: 'AI Chatbot', setup: 150, monthly: 30 }
    ],
    mobileApps: [],
    pricingPlan: {
      name: 'Maintenance Plan',
      monthly: 50
    }
  });

  /* ---------------- CALCULATIONS ---------------- */
  const oneTimeTotal =
    projectServices.template.price +
    projectServices.aiAutomation.reduce((sum, a) => sum + a.setup, 0);

  const monthlyTotal =
    projectServices.aiAutomation.reduce((sum, a) => sum + a.monthly, 0) +
    projectServices.pricingPlan.monthly;

  /* ---------------- UI ---------------- */
  return (
    <div className="dashboard-container">
      <main className="main-content">

        {/* CONTENT */}
        <div className="content-area">
          <div className="content-columns">

            {/* ================= LEFT COLUMN ================= */}
            <div className="column">

              {/* 🔹 SELECTED SERVICES */}
              <section className="card">
                <div className="card-header">
                  <h3>Selected Services</h3>
                </div>
                <div className="card-body">

                  <div className="service-item">
                    <strong>Template</strong>
                    <span>{projectServices.template.name}</span>
                    <span>${projectServices.template.price} (One-time)</span>
                  </div>

                  <div className="service-group">
                    <strong>AI Automation</strong>
                    {projectServices.aiAutomation.map((ai, i) => (
                      <div key={i} className="service-item">
                        <span>{ai.name}</span>
                        <span>${ai.setup} setup / ${ai.monthly} monthly</span>
                      </div>
                    ))}
                  </div>

                  <div className="service-group">
                    <strong>Mobile Apps</strong>
                    {projectServices.mobileApps.length === 0 && (
                      <span className="muted">No mobile apps selected</span>
                    )}
                  </div>

                </div>
              </section>

            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="column">

              {/* 🔹 PRICING SUMMARY */}
              <section className="card">
                <div className="card-header">
                  <h3>Pricing Summary</h3>
                </div>
                <div className="card-body">

                  <div className="price-row">
                    <span>One-time Cost</span>
                    <strong>${oneTimeTotal}</strong>
                  </div>

                  <div className="price-row">
                    <span>Monthly Cost</span>
                    <strong>${monthlyTotal} / month</strong>
                  </div>

                  <hr />

                  <div className="price-total">
                    <span>Total First Payment</span>
                    <strong>${oneTimeTotal + monthlyTotal}</strong>
                  </div>

                </div>
              </section>

            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default DashboardProject;