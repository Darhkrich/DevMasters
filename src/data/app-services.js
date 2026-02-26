// Core app services with pricing
export const APP_SERVICES = [
  {
    id: "web-app",
    type: ["web", "fullstack"],
    icon: "fas fa-globe",
    title: "Modern Web Application",
    description: "Responsive web apps that behave like native applications, perfect for dashboards, customer portals or booking systems.",
    meta: [
      { icon: "fas fa-laptop-code", text: "SPA / dashboard layouts" },
      { icon: "fas fa-bolt", text: "Fast & responsive" },
    ],
    features: [
      "Responsive design for all devices",
      "SPA architecture",
      "Dashboard layouts",
      "API integration",
      "Performance optimization"
    ],
  
    category: 'service'
  },
  {
    id: "mobile-mvp",
    type: ["mobile"],
    icon: "fas fa-mobile-alt",
    title: "Mobile App MVP (iOS & Android)",
    description: "A lean but beautiful first version of your app, ready to test with real users and investors.",
    meta: [
      { icon: "fas fa-apple", text: "iOS-ready UI" },
      { icon: "fas fa-android", text: "Android compatible" },
    ],
    features: [
      "Cross-platform (iOS & Android)",
      "MVP architecture",
      "App store deployment",
      "Basic analytics",
      "User onboarding flows"
    ],
   
    category: 'service'
  },
  {
    id: "cross-platform",
    type: ["mobile", "web"],
    icon: "fas fa-sync-alt",
    title: "Cross-Platform App",
    description: "One codebase for both web and mobile. Ideal for startups that want to launch fast.",
    meta: [
      { icon: "fas fa-infinity", text: "Shared design system" },
      { icon: "fas fa-rocket", text: "Faster releases" },
    ],
    features: [
      "Single codebase for web & mobile",
      "Shared design system",
      "Consistent UX across platforms",
      "Reduced development time",
      "Easier maintenance"
    ],
   
    category: 'service'
  },
  {
    id: "dashboards",
    type: ["web", "fullstack"],
    icon: "fas fa-chart-line",
    title: "Admin & Client Dashboards",
    description: "Visual dashboards for managing users, orders, bookings or any custom data.",
    meta: [
      { icon: "fas fa-table", text: "Data views & filters" },
      { icon: "fas fa-user-cog", text: "Role-based access" },
    ],
    features: [
      "Interactive charts & graphs",
      "Role-based access control",
      "Data filtering & sorting",
      "Real-time updates",
      "Export functionality"
    ],

    category: 'service'
  },
  {
    id: "saas",
    type: ["saas", "fullstack"],
    icon: "fas fa-cloud",
    title: "SaaS Web Platform",
    description: "Subscription-based platforms with accounts, billing logic and multi-tenant setups.",
    meta: [
      { icon: "fas fa-user-friends", text: "Multi-user accounts" },
      { icon: "fas fa-credit-card", text: "Subscription-ready" },
    ],
    features: [
      "Multi-tenant architecture",
      "Subscription management",
      "Payment integration",
      "User authentication",
      "Usage analytics"
    ],
  
    category: 'service'
  },
  {
    id: "booking",
    type: ["web", "mobile"],
    icon: "fas fa-calendar-check",
    title: "Booking & Appointment Systems",
    description: "Custom booking flows with reminders and calendar integrations.",
    meta: [
      { icon: "fas fa-bell", text: "Auto reminders" },
      { icon: "fas fa-calendar-alt", text: "Calendar integration" },
    ],
    features: [
      "Calendar integration",
      "Automated reminders",
      "Time slot management",
      "Booking confirmation",
      "Calendar synchronization"
    ],
   
    category: 'service'
  },
  {
    id: "ecommerce",
    type: ["web", "mobile", "saas"],
    icon: "fas fa-shopping-bag",
    title: "E-commerce Web & App Frontends",
    description: "Product listing, cart and checkout with mobile-first UX.",
    meta: [
      { icon: "fas fa-store", text: "Storefront UI" },
      { icon: "fas fa-sync", text: "Backend integration" },
    ],
    features: [
      "Shopping cart functionality",
      "Secure checkout",
      "Product catalog",
      "Payment gateway integration",
      "Order management"
    ],

    category: 'service'
  },
  {
    id: "maintenance",
    type: ["web", "mobile", "fullstack"],
    icon: "fas fa-tools",
    title: "Ongoing Maintenance & UI Refresh",
    description: "Bug fixes, improvements and UX polishing to keep apps modern.",
    meta: [
      { icon: "fas fa-sync-alt", text: "Monthly updates" },
      { icon: "fas fa-paint-brush", text: "UX polishing" },
    ],
    features: [
      "Monthly updates",
      "Bug fixes",
      "Performance optimization",
      "Security updates",
      "UX/UI improvements"
    ],
   
    category: 'service'
  },
];

// Ready-made blueprints
export const APP_BLUEPRINTS = [
  {
    id: "service-business",
    type: ["web", "mobile"],
    icon: "fas fa-briefcase",
    title: "Service Business App",
    description: "Perfect for agencies, freelancers and service providers.",
    meta: [
      { icon: "fas fa-home", text: "Home + services + about" },
      { icon: "fas fa-calendar", text: "Booking form" },
      { icon: "fas fa-bell", text: "Basic notifications" },
    ],
    features: [
      "Service showcase pages",
      "Booking & scheduling system",
      "Client management dashboard",
      "Invoice generation",
      "Service catalog"
    ],
    tag: "Starter",
   
    category: 'blueprint'
  },
  {
    id: "client-portal",
    type: ["web", "dashboard"],
    icon: "fas fa-user-shield",
    title: "Client Portal Dashboard",
    description: "Give clients a portal to track progress, invoices and files.",
    meta: [
      { icon: "fas fa-project-diagram", text: "Project overview" },
      { icon: "fas fa-file-alt", text: "File & notes section" },
      { icon: "fas fa-history", text: "Activity timeline" },
    ],
    features: [
      "Project progress tracking",
      "File sharing system",
      "Client communication portal",
      "Invoice management",
      "Activity timeline"
    ],
    tag: "Popular",

    category: 'blueprint'
  },
  {
    id: "saas-app",
    type: ["web", "saas"],
    icon: "fas fa-layer-group",
    title: "Subscription Web App",
    description: "Subscription-ready app structure with auth and plans.",
    meta: [
      { icon: "fas fa-user-plus", text: "Signup & login flows" },
      { icon: "fas fa-tags", text: "Pricing screens" },
      { icon: "fas fa-credit-card", text: "Billing UX" },
    ],
    features: [
      "User authentication system",
      "Subscription tier management",
      "Payment processing",
      "Admin dashboard",
      "User profile management"
    ],
    tag: "SaaS",
  
    category: 'blueprint'
  },
];

// Helper functions
export const getAllServices = () => {
  return [...APP_SERVICES, ...APP_BLUEPRINTS];
};

export const getServiceById = (id) => {
  return getAllServices().find(service => service.id === id);
};

export const getServicesByCategory = (category) => {
  return getAllServices().filter(service => service.category === category);
};

export const getServicesByType = (type) => {
  if (type === 'all') return getAllServices();
  return getAllServices().filter(service => service.type.includes(type));
};