// src/lib/dashboardStore.js

const mockUser = {
  id: "user_001",
  name: "John Doe",
  email: "john@example.com",
};

const DASHBOARD_KEY = `dashboard:${mockUser.id}`;

const createEmptyDashboard = () => ({
  userId: mockUser.id,
  status: "draft",
  items: {
    templates: [],
    aiAutomation: [],
    mobileApps: [],
    pricingPlans: [],
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const getDashboard = () => {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(DASHBOARD_KEY);

  if (!raw) {
    const fresh = createEmptyDashboard();
    localStorage.setItem(DASHBOARD_KEY, JSON.stringify(fresh));
    return fresh;
  }

  return JSON.parse(raw);
};

export const addTemplateToDashboard = (template) => {
  if (!template) return;

  const dashboard = getDashboard();

  const exists = dashboard.items.templates.some(
    (t) => t.templateId === template.id
  );

  if (exists) return dashboard;

  dashboard.items.templates.push({
    type: "template",
    templateId: template.id,
    name: template.name,
    price: template.price,
    image: template.image,
    addedAt: new Date().toISOString(),
  });

  dashboard.updatedAt = new Date().toISOString();
  localStorage.setItem(DASHBOARD_KEY, JSON.stringify(dashboard));

  return dashboard;
};

export const removeDashboardItem = (type, id) => {
  const dashboard = getDashboard();

  if (!dashboard.items[type]) return dashboard;

  dashboard.items[type] = dashboard.items[type].filter(
    (item) => item.templateId !== id && item.serviceId !== id
  );

  dashboard.updatedAt = new Date().toISOString();
  localStorage.setItem(DASHBOARD_KEY, JSON.stringify(dashboard));

  return dashboard;
};

export const calculateDashboardTotals = () => {
  const dashboard = getDashboard();

  let oneTimeTotal = 0;
  let monthlyTotal = 0;

  dashboard.items.templates.forEach((t) => {
    oneTimeTotal += Number(t.price.replace(/[^0-9.]/g, ""));
  });

  dashboard.items.aiAutomation.forEach((a) => {
    oneTimeTotal += a.setupCost || 0;
    monthlyTotal += a.monthlyCost || 0;
  });

  dashboard.items.pricingPlans.forEach((p) => {
    monthlyTotal += p.price || 0;
  });

  return { oneTimeTotal, monthlyTotal };
};