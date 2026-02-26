// utils/dataTransform.js


// src/utils/dataTransform.js

// Helper function to safely parse price
const parsePrice = (price) => {
  if (price === null || price === undefined) return null;
  
  if (typeof price === 'string') {
    // Remove any non-digit characters except decimal point
    const numericString = price.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(numericString);
    return isNaN(parsed) ? null : parsed;
  } else if (typeof price === 'number') {
    return price;
  }
  return null;
};


export const transformToCartItem = (item, source) => {
  const base = {
    id: item.id,
    source,
    originalData: item,
    title: item.title || item.name || item.shortName,
    description: item.description,
    features: item.features || [],
    requiresDocuments: item.requiresDocuments || false,
    deliveryTime: item.deliveryTime || 'To be determined',
  };

  // Handle different data sources
  switch (source) {
    case 'aiAutomations':
      return {
        ...base,
        category: 'ai',
        type: 'service',
        priceType: 'monthly',
        price: parseFloat(item.price?.replace('$', '')) || null,
        priceNote: item.priceNote,
        icon: item.icon,
        sector: item.sector,
        integration: item.integration,
        useCases: item.useCases,
        previewUrl: item.previewUrl,
        image: item.image,
      };

    case 'appServices':
      return {
        ...base,
        category: item.type?.[0] === 'web' ? 'web' : 'app',
        type: 'service',

        priceType: 'one-time',
        price: item.price || null,
        icon: item.icon,
        meta: item.meta,
      };

    case 'appBlueprints':
      return {
        ...base,
        category: 'app',
        type: 'blueprint',
        priceType: 'custom',
        price: null,
        tag: item.tag,
        tagAccent: item.tagAccent,
        cta: item.cta,
      };

    case 'templates':
      return {
        ...base,
        category: item.category?.[0] || 'web',
        type: 'template',
        priceType: 'one-time',

        priceNote: item.priceNote,
        tags: item.tags,
        icons: item.icons,
        badge: item.badge,
        badgeClass: item.badgeClass,
        previewUrl: item.previewUrl,
        image: item.image,
      };

    case 'pricingData':
      // Handle pricing data based on category
      const categoryMap = {
        websites: 'web',
        apps: 'app',
        ai: 'ai',
      };
      
      return {
        ...base,
        category: categoryMap[item.category] || item.category,
        type: 'plan',
        priceType: item.billingMonthly ? 'monthly' : 'one-time',
        price: parseFloat(item.billingOneTime) || null,
        priceMonthly: item.billingMonthly ? parseFloat(item.billingMonthly) : null,
        tier: item.tier,
        subtitle: item.subtitle,
        features: item.features,
        footnote: item.footnote,
      };

    default:
      return base;
  }
};

// Analyze cart for auto-fill suggestions
export const analyzeCart = (cartItems) => {
  if (!cartItems || cartItems.length === 0) {
    return {
      serviceCategory: '',
      suggestedBudget: 'To be discussed',
      suggestedTimeline: 'Flexible',
      requiresSetup: false,
      priceTypes: [],
    };
  }

  const categories = new Set();
  const priceTypes = new Set();
  let requiresSetup = false;
  let deliveryTimes = new Set();

  cartItems.forEach(item => {
    categories.add(item.category);
    priceTypes.add(item.priceType);
    if (item.requiresDocuments || item.deliveryTime !== 'Instant') {
      requiresSetup = true;
    }
    if (item.deliveryTime && item.deliveryTime !== 'Instant') {
      deliveryTimes.add(item.deliveryTime);
    }
  });

  // Determine timeline based on delivery times
  let suggestedTimeline = 'Flexible';
  const deliveryTimeArray = Array.from(deliveryTimes);
  
  if (deliveryTimeArray.includes('2 weeks')) {
    suggestedTimeline = 'ASAP (1-2 weeks)';
  } else if (deliveryTimeArray.includes('1 month')) {
    suggestedTimeline = 'Quick Start (1 month)';
  } else if (deliveryTimeArray.length > 0) {
    suggestedTimeline = 'Standard (1-3 months)';
  }

  // Determine service category
  let serviceCategory = '';
  if (categories.size === 1) {
    const category = Array.from(categories)[0];
    serviceCategory = category === 'web' ? 'Website Development'
      : category === 'app' ? 'Mobile App Development'
      : category === 'ai' ? 'AI Automation'
      : 'Custom Solution';
  } else if (categories.size > 1) {
    serviceCategory = 'Multiple Services';
  }

  return {
    serviceCategory,
    suggestedBudget: 'To be discussed', // As per requirement Q4
    suggestedTimeline,
    requiresSetup,
    priceTypes: Array.from(priceTypes),
    categories: Array.from(categories),
  };
};




