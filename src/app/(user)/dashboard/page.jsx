'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Overview.module.css';

// Mock data – replace with real API calls
const mockClient = {
  name: 'Alex Johnson',
  plan: 'Professional',
  nextBilling: '2025-05-15',
  credits: 150,
  activeProjects: 3,
};

const mockServices = [
  {
    id: 1,
    type: 'Website Template',
    name: 'Modern Business Pro',
    status: 'active',
    image: '/templates/business.jpg',
    purchasedOn: '2025-02-10',
  },
  {
    id: 2,
    type: 'AI Automation',
    name: 'LeadGen Bot',
    status: 'active',
    image: '/automations/leadgen.jpg',
    purchasedOn: '2025-03-22',
  },
  {
    id: 3,
    type: 'Application',
    name: 'Custom CRM',
    status: 'in-progress',
    image: '/apps/crm.jpg',
    purchasedOn: '2025-04-01',
  },
];

const mockRecentActivity = [
  { id: 1, action: 'Package upgraded to Professional', date: '2025-04-10' },
  { id: 2, action: 'New template purchased: Modern Business Pro', date: '2025-04-09' },
  { id: 3, action: 'Support ticket #1234 resolved', date: '2025-04-08' },
];

const mockMessages = [
  { id: 1, from: 'Support Team', subject: 'Your AI bot is ready', date: '2025-04-11', unread: true },
  { id: 2, from: 'Billing', subject: 'Invoice for April', date: '2025-04-05', unread: false },
];

export default function OverviewPage() {
  const [client, setClient] = useState(mockClient);
  const [services, setServices] = useState(mockServices);
  const [activity, setActivity] = useState(mockRecentActivity);
  const [messages, setMessages] = useState(mockMessages);

  return (
    <div className={styles.overview}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.greeting}>Welcome back, {client.name}!</h1>
        <p className={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Active Projects</span>
          <span className={styles.metricValue}>{client.activeProjects}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Credits Remaining</span>
          <span className={styles.metricValue}>{client.credits}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Current Plan</span>
          <span className={styles.metricValue}>{client.plan}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Next Billing</span>
          <span className={styles.metricValue}>{new Date(client.nextBilling).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Current Services / Products */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Your Services & Products</h2>
          <Link href="/dashboard/project" className={styles.viewAllLink}>View All →</Link>
        </div>
        <div className={styles.servicesGrid}>
          {services.map(service => (
            <div key={service.id} className={styles.serviceCard}>
              <div className={styles.serviceImage}>
                <Image
                  src={service.image}
                  alt={service.name}
                  width={80}
                  height={80}
                  className={styles.image}
                />
              </div>
              <div className={styles.serviceInfo}>
                <span className={styles.serviceType}>{service.type}</span>
                <h3 className={styles.serviceName}>{service.name}</h3>
                <span className={`${styles.serviceStatus} ${styles[service.status]}`}>
                  {service.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Package Plan Details */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Your Package: {client.plan}</h2>
          <Link href="/dashboard/package" className={styles.viewAllLink}>Manage →</Link>
        </div>
        <div className={styles.packageCard}>
          <div className={styles.packageFeatures}>
            <ul className={styles.featureList}>
              <li>✔ 5 Website Templates</li>
              <li>✔ 3 AI Automation Templates</li>
              <li>✔ 1 Custom Application Request</li>
              <li>✔ Priority Support</li>
              <li>✔ 200 Credits/month</li>
            </ul>
          </div>
          <div className={styles.packageProgress}>
            <div className={styles.progressItem}>
              <span>Templates Used: 2/5</span>
              <div className={styles.progressBar}><div style={{ width: '40%' }}></div></div>
            </div>
            <div className={styles.progressItem}>
              <span>Automations Used: 1/3</span>
              <div className={styles.progressBar}><div style={{ width: '33%' }}></div></div>
            </div>
            <div className={styles.progressItem}>
              <span>Credits Used: 50/200</span>
              <div className={styles.progressBar}><div style={{ width: '25%' }}></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity & Messages (Two-column) */}
      <div className={styles.twoColumn}>
        {/* Recent Activity */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <ul className={styles.activityList}>
            {activity.map(item => (
              <li key={item.id} className={styles.activityItem}>
                <span className={styles.activityAction}>{item.action}</span>
                <span className={styles.activityDate}>{new Date(item.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent Messages */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Messages</h2>
            <Link href="/dashboard/messages" className={styles.viewAllLink}>View All →</Link>
          </div>
          <ul className={styles.messageList}>
            {messages.map(msg => (
              <li key={msg.id} className={`${styles.messageItem} ${msg.unread ? styles.unread : ''}`}>
                <div className={styles.messageHeader}>
                  <span className={styles.messageFrom}>{msg.from}</span>
                  <span className={styles.messageDate}>{new Date(msg.date).toLocaleDateString()}</span>
                </div>
                <p className={styles.messageSubject}>{msg.subject}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}