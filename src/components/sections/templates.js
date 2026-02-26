// templates.js

export const templatesData = [
  // --- BUSINESS (10 Items) ---
  {
    id: "tpl-bus-1",
    name: "Corporate Summit",
    shortName: "Corporate",
    category: ["business"],
    type: "ready",
    previewUrl: "https://github.com/SuperSimpleDev/ecommerce-project",
    image: "/car-dealership.png",
    description: "Professional corporate layout with team hierarchy, history timeline, and investor relations sections.",
  
    priceNote: "Corporate ready",
    tags: ["Investor relations", "Team grids"],
    icons: ["fas fa-building", "fas fa-users"],
    badge: "Ready-Made",
    badgeClass: "wc-template-tag--ready"
  },
  {
    id: "tpl-bus-2",
    name: "Modern Agency",
    shortName: "Agency X",
    category: ["business", "landing"],
    type: "custom",
    previewUrl: "https://github.com/SuperSimpleDev/ecommerce-project",
    image: "/menswear.png",
    description: "Bold typography and dark mode aesthetics for modern digital agencies.",

    priceNote: "Premium design",
    tags: ["Dark mode", "Smooth scroll"],
    icons: ["fas fa-moon", "fas fa-mouse"],
    badge: "Customizable",
    badgeClass: "wc-template-tag--custom"
  },
  {
    id: "tpl-bus-3",
    name: "Law Firm Elite",
    shortName: "Legal Pro",
    category: ["business"],
    type: "ready",
    previewUrl: "https://github.com/SuperSimpleDev/ecommerce-project",
    image: "/builder-one.png",
    description: "Trust-building layout for law firms with case study sections and consultation booking.",

    priceNote: "Fast setup",
    tags: ["Case studies", "Booking"],
    icons: ["fas fa-gavel", "fas fa-calendar-check"],
    badge: "Ready-Made",
    badgeClass: "wc-template-tag--ready"
  },
 

];



// Core app services with pricing
export const APP_SERVICES = [

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




// src/data/aiAutomations.js

export const aiAutomations = [
  {
    id: "ai-chat-support",
    title: "AI Chat Support",
    description: "24/7 customer support chatbot for your website.",
    sector: "ecommerce",
    icon: "fas fa-comments",
    features: ["Answers FAQs", "Routes to human agents", "Collects contact info"],

    priceNote: "monthly setup",
    deliveryTime: "2 weeks",
    integration: ["Website", "Facebook", "WhatsApp"],
    useCases: [
      "Reduce customer support workload by 40%",
      "Answer common questions instantly",
      "Qualify leads before human intervention"
    ],
    benefits: [
      "24/7 availability",
      "Multilingual support",
      "Easy integration",
      "Customizable responses"
    ],
    previewUrl: "#",
    image: "/images/ai/chat-support.jpg"
  },
  {
    id: "lead-qualification",
    title: "AI Lead Qualification",
    description: "Automatically score and prioritize incoming leads.",
    sector: "services",
    icon: "fas fa-filter",
    features: ["Score leads 1-10", "Auto-tagging", "CRM integration"],
  
    priceNote: "one-time setup",
    deliveryTime: "1 week",
    integration: ["CRM", "Forms", "Email"],
    useCases: [
      "Prioritize high-value leads",
      "Automate follow-up sequences",
      "Reduce manual sorting time"
    ],
    benefits: [
      "Increased conversion rates",
      "Time savings",
      "Better lead tracking",
      "Custom scoring rules"
    ],
    previewUrl: "#",
    image: "/images/ai/lead-qual.jpg"
  },
  {
    id: "email-automation",
    title: "Smart Email Automation",
    description: "Personalized email sequences based on user behavior.",
    sector: "ecommerce",
    icon: "fas fa-envelope",
    features: ["Behavior triggers", "Personalization", "A/B testing"],
   
    priceNote: "monthly + setup",
    deliveryTime: "3 weeks",
    integration: ["Email platforms", "Website", "CRM"],
    useCases: [
      "Abandoned cart recovery",
      "Welcome sequences",
      "Re-engagement campaigns",
      "Post-purchase follow-ups"
    ],
    benefits: [
      "Higher open rates",
      "Automated personalization",
      "Scalable campaigns",
      "Detailed analytics"
    ],
    previewUrl: "#",
    image: "/images/ai/email-auto.jpg"
  },

];

export const aiBundles = [
  {
    id: "bundle-ecommerce",
    title: "E-commerce Growth Bundle",
    description: "Complete automation for online stores.",
    tag: "Best Seller",
    items: [
      "AI Chat Support",
      "Abandoned Cart Recovery",
      "Product Recommendation Engine",
      "Inventory Management AI",
      "Customer Review Analyzer"
    ],
   
    priceNote: "one-time + $199/month",
    deliveryTime: "4 weeks",
    features: [
      "30% increase in conversions",
      "40% reduction in support tickets",
      "Automated inventory management",
      "Personalized product recommendations"
    ],
    idealFor: ["Online retailers", "Dropshippers", "Product brands"],
    previewUrl: "#",
    image: "/images/ai/bundle-ecommerce.jpg"
  },
 
];

// Sector data for filtering
export const sectors = [
  { id: "all", label: "All Sectors" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "services", label: "Services" },
  { id: "education", label: "Education" },
  { id: "real-estate", label: "Real Estate" },
  { id: "healthcare", label: "Healthcare" }
];