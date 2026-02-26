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
  {
    id: "content-generation",
    title: "AI Content Generation",
    description: "Automated content creation for blogs, social media, and ads.",
    sector: "education",
    icon: "fas fa-pen-nib",
    features: ["SEO optimization", "Brand voice", "Multi-platform"],
  
    priceNote: "monthly package",
    deliveryTime: "1 week",
    integration: ["WordPress", "Social media", "CMS"],
    useCases: [
      "Blog post generation",
      "Social media content",
      "Product descriptions",
      "Email newsletters"
    ],
    benefits: [
      "Consistent content output",
      "SEO optimized",
      "Time savings",
      "Multi-language support"
    ],
    previewUrl: "#",
    image: "/images/ai/content-gen.jpg"
  },
  {
    id: "appointment-scheduling",
    title: "AI Appointment Scheduling",
    description: "Smart scheduling with automated reminders and rescheduling.",
    sector: "healthcare",
    icon: "fas fa-calendar-check",
    features: ["Calendar sync", "Auto-reminders", "Waitlist management"],
  
    priceNote: "monthly subscription",
    deliveryTime: "2 weeks",
    integration: ["Calendars", "SMS", "Payment gateways"],
    useCases: [
      "Doctor appointments",
      "Consultation booking",
      "Service scheduling",
      "Class registrations"
    ],
    benefits: [
      "Reduced no-shows",
      "24/7 booking",
      "Automated reminders",
      "Calendar optimization"
    ],
    previewUrl: "#",
    image: "/images/ai/appointment.jpg"
  },
  {
    id: "data-analysis",
    title: "AI Data Analysis",
    description: "Automated insights from your business data.",
    sector: "real-estate",
    icon: "fas fa-chart-line",
    features: ["Real-time dashboards", "Predictive analytics", "Custom reports"],

    priceNote: "monthly + setup",
    deliveryTime: "4 weeks",
    integration: ["Databases", "APIs", "Business tools"],
    useCases: [
      "Sales forecasting",
      "Customer behavior analysis",
      "Market trends",
      "Performance metrics"
    ],
    benefits: [
      "Actionable insights",
      "Real-time monitoring",
      "Predictive capabilities",
      "Customizable reports"
    ],
    previewUrl: "#",
    image: "/images/ai/data-analysis.jpg"
  },
  {
    id: "social-media-management",
    title: "AI Social Media Management",
    description: "Automated posting, engagement, and analytics.",
    sector: "services",
    icon: "fas fa-hashtag",
    features: ["Auto-posting", "Sentiment analysis", "Performance tracking"],
  
    priceNote: "monthly package",
    deliveryTime: "2 weeks",
    integration: ["All major platforms", "Analytics tools", "Content libraries"],
    useCases: [
      "Content scheduling",
      "Engagement automation",
      "Competitor analysis",
      "ROI tracking"
    ],
    benefits: [
      "Time savings",
      "Improved engagement",
      "Consistent posting",
      "Detailed analytics"
    ],
    previewUrl: "#",
    image: "/images/ai/social-media.jpg"
  },
  {
    id: "inventory-management",
    title: "AI Inventory Management",
    description: "Smart inventory tracking and reordering predictions.",
    sector: "ecommerce",
    icon: "fas fa-boxes",
    features: ["Demand forecasting", "Auto-reordering", "Stock alerts"],

    priceNote: "monthly setup",
    deliveryTime: "3 weeks",
    integration: ["Shopify", "WooCommerce", "Inventory systems"],
    useCases: [
      "Stock level optimization",
      "Reorder predictions",
      "Demand forecasting",
      "Warehouse management"
    ],
    benefits: [
      "Reduced stockouts",
      "Lower inventory costs",
      "Automated ordering",
      "Better cash flow"
    ],
    previewUrl: "#",
    image: "/images/ai/inventory.jpg"
  }
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
  {
    id: "bundle-service-business",
    title: "Service Business Bundle",
    description: "Automation for service-based companies.",
    tag: "Popular",
    items: [
      "AI Appointment Scheduling",
      "Lead Qualification Bot",
      "Client Onboarding Automation",
      "Invoice & Payment Reminders",
      "Feedback Collection System"
    ],
 
    priceNote: "one-time + $149/month",
    deliveryTime: "3 weeks",
    features: [
      "Automated client scheduling",
      "Smart lead prioritization",
      "Streamlined onboarding",
      "Automated payment follow-ups"
    ],
    idealFor: ["Consultants", "Agencies", "Freelancers", "Coaches"],
    previewUrl: "#",
    image: "/images/ai/bundle-service.jpg"
  },
  {
    id: "bundle-content-creator",
    title: "Content Creator Bundle",
    description: "AI-powered content creation and distribution.",
    tag: "New",
    items: [
      "AI Content Generation",
      "Social Media Management",
      "SEO Optimization AI",
      "Content Calendar Automation",
      "Performance Analytics"
    ],

    priceNote: "monthly subscription",
    deliveryTime: "2 weeks",
    features: [
      "10x content output",
      "Automated publishing",
      "SEO optimization",
      "Cross-platform distribution"
    ],
    idealFor: ["Bloggers", "Influencers", "Content teams", "Marketing agencies"],
    previewUrl: "#",
    image: "/images/ai/bundle-content.jpg"
  }
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