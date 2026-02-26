export const builderOptions = {
  web: {
    base: [
      { value: 'none', label: 'Just landing page (will use category base)', price: 0 },
      { value: 'ready-starter', label: 'Ready-made Starter website', price: 299 },
      { value: 'ready-pro', label: 'Ready-made Pro Business website', price: 549 },
      { value: 'custom-pro', label: 'Custom Pro Business website', price: 899 }
    ],
    extras: [
      { value: 'extra-pages', label: 'Extra pages (up to +5)', price: 80 },
      { value: 'seo', label: 'Advanced SEO setup', price: 120 },
      { value: 'content-writing', label: 'Copywriting for core pages', price: 150 },
      { value: 'multi-language', label: 'Multi-language support', price: 200 },
      { value: 'blog-setup', label: 'Blog setup & design', price: 180 }
    ]
  },
  app: {
    base: [
      { value: 'none', label: 'Just basic MVP module', price: 0 },
      { value: 'starter', label: 'Starter MVP / internal tool', price: 999 },
      { value: 'pro', label: 'Business-ready app', price: 1899 },
      { value: 'scale', label: 'Full platform / store', price: 2699 }
    ],
    extras: [
      { value: 'extra-screens', label: 'Extra screens / modules', price: 250 },
      { value: 'payments', label: 'Additional payment gateways', price: 220 },
      { value: 'integrations', label: '3rd party API integrations', price: 200 },
      { value: 'analytics', label: 'Advanced analytics & events', price: 180 }
    ]
  },
  ai: {
    base: [
      { value: 'none', label: 'Basic AI assistance only', price: 0 },
      { value: 'starter', label: '1–2 AI workflows', price: 399 },
      { value: 'pro', label: 'Lead & content automations', price: 899 },
      { value: 'ecom', label: 'E-commerce AI package', price: 1399 }
    ],
    extras: [
      { value: 'more-workflows', label: 'Extra workflows (+2)', price: 170 },
      { value: 'chatbot', label: 'Additional chatbot channel', price: 200 },
      { value: 'ai-training', label: 'Team training session', price: 160 }
    ]
  },
  priority: [
    { value: 'speed', label: 'Launch fast' },
    { value: 'budget', label: 'Stay on budget' },
    { value: 'scale', label: 'Scale & automation' }
  ]
};