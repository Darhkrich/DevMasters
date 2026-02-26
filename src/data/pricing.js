export const pricingData = {
  websites: {
    ready: [
      {
        id: 'web-ready-starter',
        category: 'websites',
        subcategory: 'ready-made',
        tier: 'starter',
        title: 'Launch-ready presence',
        subtitle: 'Perfect for small businesses, personal brands and freelancers who need a clean site fast.',
        billingOneTime: '299',
        billingMonthly: '39',
        features: [
          '1 ready-made template from the gallery',
          'Up to 5 pages (Home, About, Services, Blog list, Contact)',
          'Brand styling (logo, colors, fonts)',
          'Mobile-responsive layout',
          'Domain connection & basic hosting setup',
          'SSL security (HTTPS)',
          'Basic SEO (titles, meta descriptions, image alts)',
          '1 revision round',
          '14 days email support after launch'
        ],
        footnote: 'Need extra pages or features? Add them in the "Build your own" section.'
      },
      {
        id: 'web-ready-pro',
        category: 'websites',
        subcategory: 'ready-made',
        tier: 'pro',
        title: 'Grow your business online',
        subtitle: 'For businesses that need more pages, better conversions and ongoing support.',
        billingOneTime: '549',
        billingMonthly: '59',
        features: [
          'All Starter features',
          'Up to 10 pages (services, FAQ, case studies, etc.)',
          'Conversion-focused layout & CTAs',
          'Testimonials, FAQ and team sections included',
          'Contact forms connected to your email',
          'Google Analytics & Search Console setup',
          'Basic integrations (WhatsApp, Messenger, email capture)',
          '3 revision rounds',
          '30 days priority support'
        ],
        popular: true,
        footnote: 'Perfect if you also plan to add AI automations or a client portal later.'
      },
      {
        id: 'web-ready-ecommerce',
        category: 'websites',
        subcategory: 'ready-made',
        tier: 'ecommerce-plus',
        title: 'Sell online quickly',
        subtitle: 'Ready-made online store built on top of your chosen template with essential e-commerce features.',
        billingOneTime: '799',
        billingMonthly: '89',
        features: [
          'All Pro Business features',
          'Online store setup (up to 20 products)',
          'Categories & product filters',
          'Payment gateway integration',
          'Basic shipping and tax configuration',
          'Cart & checkout customization',
          'E-commerce analytics basics',
          '60 days post-launch support',
          'Short training on managing products & orders'
        ],
        footnote: 'Ideal for small online stores, restaurants and service providers selling packages.'
      }
    ],
    custom: [
      {
        id: 'web-custom-starter',
        category: 'websites',
        subcategory: 'custom',
        tier: 'starter',
        title: 'Custom layout on your brand',
        subtitle: 'Great when you want something different from a basic template but still budget-friendly.',
        billingOneTime: '499',
        billingMonthly: '59',
        features: [
          'Custom homepage layout',
          'Up to 5 pages with custom layout',
          'Brand-focused visuals & sections',
          'Base UX structure for growth',
          'Mobile & tablet optimized',
          'Domain, hosting & SSL setup',
          'Basic analytics integration',
          '2 revision rounds',
          '30 days support'
        ],
        footnote: 'Ideal for early-stage brands who still want a unique feel.'
      },
      {
        id: 'web-custom-pro',
        category: 'websites',
        subcategory: 'custom',
        tier: 'pro',
        title: 'Custom site, built to convert',
        subtitle: 'For brands that need more pages, more storytelling and more control over how they look online.',
        billingOneTime: '899',
        billingMonthly: '99',
        features: [
          'All Custom Starter features',
          'Up to 12 custom-designed pages',
          'Custom components (pricing, timelines, feature grids)',
          'Content structure & copy guidance',
          'Advanced on-page SEO structure',
          'Integrations (CRM, email marketing, chat)',
          'Performance optimization (images, loading)',
          '4 revision rounds',
          '60–90 days priority support'
        ],
        popular: true,
        bestValue: true,
        footnote: 'Great if you plan to add client dashboards or AI automation later.'
      },
      {
        id: 'web-custom-ecommerce',
        category: 'websites',
        subcategory: 'custom',
        tier: 'ecommerce-plus',
        title: 'Custom e-commerce experience',
        subtitle: 'Custom store layout with product filtering, tailored product pages and advanced integrations.',
        billingOneTime: '1299',
        billingMonthly: '129',
        features: [
          'All Custom Pro Business features',
          'Custom product & category layouts',
          'Advanced filters & search',
          'Multiple payment gateways',
          'Upsells & cross-sells sections',
          'Email & automation-ready (abandoned cart, order emails)',
          '60–90 days support & tuning',
          'Training and handover documentation'
        ],
        footnote: 'Best for serious stores and digital product platforms.'
      }
    ]
  },
  apps: [
    {
      id: 'app-starter',
      category: 'apps',
      subcategory: 'apps',
      tier: 'starter',
      title: 'Simple MVP or internal tool',
      subtitle: 'Best for first versions, dashboards or internal tools with a focused feature set.',
      billingOneTime: '999',
      billingMonthly: '149',
      features: [
        '1 main platform (web app or mobile app UI)',
        '4–6 core screens / pages',
        'Auth (login, signup, reset) if needed',
        'Base database & CRUD features',
        'Responsive layout (for web)',
        'Bug fixes at launch',
        '30 days support'
      ]
    },
    {
      id: 'app-pro',
      category: 'apps',
      subcategory: 'apps',
      tier: 'pro',
      title: 'Business-ready application',
      subtitle: 'Multi-screen app for your customers or team, with integrations and analytics.',
      billingOneTime: '1899',
      billingMonthly: '229',
      features: [
        '12–15 screens / pages',
        'Multi-role flows (admin + users)',
        'Payment or subscription integration',
        'Integrations with external APIs (email, CRM, etc.)',
        'Analytics & event tracking',
        'Documentation / handover guide',
        '60–90 days support'
      ],
      popular: true
    },
    {
      id: 'app-plus',
      category: 'apps',
      subcategory: 'apps',
      tier: 'ecommerce-plus',
      title: 'Store or multi-module platform',
      subtitle: 'Full product or marketplace flows, admin dashboards and heavy integrations.',
      billingOneTime: '2699',
      billingMonthly: '299',
      features: [
        'E-commerce or multi-module system',
        'Admin / back-office dashboards',
        'Multiple payment gateways',
        'Notifications (email, SMS, push where possible)',
        'Architecture guidance for scaling',
        'Extended support & maintenance options'
      ]
    }
  ],
  ai: [
    {
      id: 'ai-starter',
      category: 'ai',
      subcategory: 'ai',
      tier: 'starter',
      title: 'Simple automations',
      subtitle: 'Great first step into AI—light automations that remove repetitive tasks from your day.',
      billingOneTime: '399',
      billingMonthly: '49',
      features: [
        '1–2 automation workflows',
        'Connect 2–3 apps (forms, sheets, email, etc.)',
        'AI-assisted replies or summaries',
        'Simple log or dashboard',
        'Short training session or video',
        '14–30 days support'
      ]
    },
    {
      id: 'ai-pro',
      category: 'ai',
      subcategory: 'ai',
      tier: 'pro',
      title: 'Sales & support automations',
      subtitle: 'Lead qualification, content drafts and AI chatbot for your website or messaging app.',
      billingOneTime: '899',
      billingMonthly: '99',
      features: [
        '3–5 workflows (leads, follow-ups, content help)',
        'AI chatbot for website or messaging (FAQ / lead bot)',
        'Data enrichment for leads where possible',
        'Monitoring & error alerts configuration',
        'Documentation & usage guide',
        '30–60 days optimization support'
      ],
      popular: true
    },
    {
      id: 'ai-ecommerce-plus',
      category: 'ai',
      subcategory: 'ai',
      tier: 'ecommerce-plus',
      title: 'AI for online stores',
      subtitle: 'Automations focused on sales, retention and support for e-commerce brands.',
      billingOneTime: '1399',
      billingMonthly: '149',
      features: [
        'AI support bot for order tracking & FAQs',
        'AI product recommendations & upsell messages',
        'AI-generated product descriptions (batch)',
        'Integrations with your store platform & email tools',
        'Simple analytics dashboard for automation performance',
        '60–90 days performance tuning'
      ]
    }
  ]
};