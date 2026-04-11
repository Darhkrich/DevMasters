const parsePrice = (price) => {
  if (price === null || price === undefined || price === "") {
    return null;
  }

  if (typeof price === "string") {
    const numericString = price.replace(/[^\d.-]/g, "");
    const parsed = parseFloat(numericString);
    return Number.isNaN(parsed) ? null : parsed;
  }

  if (typeof price === "number") {
    return price;
  }

  return null;
};

const getPrimaryType = (value) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }
  return value || "";
};

export const transformToCartItem = (item, source) => {
  const base = {
    id: item.id,
    source,
    originalData: item,
    title: item.title || item.name || item.shortName || "Untitled item",
    description: item.description || "",
    features: item.features || [],
    requiresDocuments: item.requiresDocuments || false,
    deliveryTime: item.deliveryTime || "To be determined",
    quantity: item.quantity || 1,
  };

  switch (source) {
    case "aiAutomations":
      return {
        ...base,
        category: "ai",
        type: "service",
        priceType: "custom",
        price: parsePrice(item.price),
        priceNote: item.priceNote,
        icon: item.icon,
        sector: item.sector,
        integration: item.integration || [],
        useCases: item.useCases || [],
        previewUrl: item.previewUrl,
        image: item.image,
      };

    case "appServices":
      return {
        ...base,
        category: getPrimaryType(item.type) === "web" ? "web" : "app",
        type: item.category === "blueprint" ? "blueprint" : "service",
        priceType: "custom",
        price: parsePrice(item.price),
        icon: item.icon,
        meta: item.meta || [],
        tag: item.tag,
      };

    case "templates":
      return {
        ...base,
        category: Array.isArray(item.category) ? item.category[0] || "web" : item.category || "web",
        type: "template",
        priceType: "one-time",
        price: parsePrice(item.price),
        priceNote: item.priceNote,
        tags: item.tags || [],
        icons: item.icons || [],
        badge: item.badge,
        badgeClass: item.badgeClass,
        previewUrl: item.previewUrl,
        image: item.image,
      };

    case "pricingData": {
      const categoryMap = {
        websites: "web",
        apps: "app",
        ai: "ai",
      };

      return {
        ...base,
        category: categoryMap[item.category] || item.category,
        type: "plan",
        priceType: item.billingMonthly ? "monthly" : "one-time",
        price: parsePrice(item.billingOneTime ?? item.price),
        priceMonthly: parsePrice(item.billingMonthly),
        tier: item.tier,
        subtitle: item.subtitle,
        features: item.features || [],
        footnote: item.footnote,
      };
    }

    case "builderPackage":
      return {
        ...base,
        category: "custom",
        type: "custom-builder",
        priceType: "estimate",
        price: parsePrice(item.price),
        breakdown: item.breakdown || [],
        selectedTypes: item.types || [],
        priority: item.priority,
      };

    default:
      return {
        ...base,
        price: parsePrice(item.price),
        priceType: item.priceType || "custom",
      };
  }
};

// Analyze cart for auto-fill suggestions
export const analyzeCart = (cartItems) => {
  if (!cartItems || cartItems.length === 0) {
    return {
      serviceCategory: "",
      suggestedBudget: "To be discussed",
      suggestedTimeline: "Flexible (3-6 months)",
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
  let suggestedTimeline = "Flexible (3-6 months)";
  const deliveryTimeArray = Array.from(deliveryTimes);
  
  if (deliveryTimeArray.includes("2 weeks")) {
    suggestedTimeline = "ASAP (1-2 weeks)";
  } else if (deliveryTimeArray.includes("1 week")) {
    suggestedTimeline = "ASAP (1-2 weeks)";
  } else if (deliveryTimeArray.includes("1 month")) {
    suggestedTimeline = "Quick Start (1 month)";
  } else if (deliveryTimeArray.length > 0) {
    suggestedTimeline = "Standard (1-3 months)";
  }

  // Determine service category
  let serviceCategory = "";
  if (categories.size === 1) {
    const category = Array.from(categories)[0];
    serviceCategory = category === "web" ? "Website Development"
      : category === "app" ? "Application Development"
      : category === "ai" ? "AI Automation"
      : category === "custom" ? "Custom Package"
      : "Custom Solution";
  } else if (categories.size > 1) {
    serviceCategory = "Multiple Services";
  }

  return {
    serviceCategory,
    suggestedBudget: "To be discussed",
    suggestedTimeline,
    requiresSetup,
    priceTypes: Array.from(priceTypes),
    categories: Array.from(categories),
  };
};



