// boemApi.js
const DEFAULT_API_BASE_URL = "https://backend-devmasters.onrender.com/api/v1";
const STORAGE_KEYS = {
  access: "DevMasters_access_token",
  refresh: "DevMasters_refresh_token",
  user: "Devmasters_user",
  sessionType: "DevMasters_session_type",
};

const SESSION_TYPES = {
  persistent: "persistent",
  session: "session",
};

function isBrowser() {
  return typeof window !== "undefined";
}

function getStorage(type) {
  if (!isBrowser()) return null;
  return type === SESSION_TYPES.session ? window.sessionStorage : window.localStorage;
}

function readStorage(key, type = SESSION_TYPES.persistent) {
  const storage = getStorage(type);
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch (error) {
    console.error(`Unable to read ${key} from storage`, error);
    return null;
  }
}

function writeStorage(key, value, type = SESSION_TYPES.persistent) {
  const storage = getStorage(type);
  if (!storage) return;
  try {
    if (value === null || value === undefined) {
      storage.removeItem(key);
      return;
    }
    storage.setItem(key, value);
  } catch (error) {
    console.error(`Unable to write ${key} to storage`, error);
  }
}

function clearStorageBucket(type) {
  const storage = getStorage(type);
  if (!storage) return;
  Object.values(STORAGE_KEYS).forEach((key) => writeStorage(key, null, type));
}

function getStoredSessionType() {
  return (
    readStorage(STORAGE_KEYS.sessionType, SESSION_TYPES.session) ||
    readStorage(STORAGE_KEYS.sessionType, SESSION_TYPES.persistent) ||
    SESSION_TYPES.persistent
  );
}

function readSessionValue(key) {
  return (
    readStorage(key, SESSION_TYPES.session) ||
    readStorage(key, SESSION_TYPES.persistent)
  );
}

function shouldUseSessionStorage(session = {}) {
  return Boolean(session.user?.is_staff);
}

function buildCookie(name, value, { maxAge } = {}) {
  const secure = isBrowser() && window.location.protocol === "https:" ? "; Secure" : "";
  const maxAgePart = Number.isFinite(maxAge) ? `; max-age=${maxAge}` : "";
  document.cookie = `${name}=${value}; path=/; SameSite=Lax${maxAgePart}${secure}`;
}

function clearCookie(name) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

function readCookie(name) {
  if (!isBrowser()) return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function getCsrfToken() {
  return readCookie("csrftoken");
}

function isUnsafeMethod(method = "GET") {
  return !["GET", "HEAD", "OPTIONS", "TRACE"].includes(String(method).toUpperCase());
}

function shouldIncludeCredentials(path, method, auth) {
  if (auth) return true;
  if (String(path || "").startsWith("/auth/")) return true;
  return false;
}

function toQueryString(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, value);
  });
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function ensureArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return [];
  return [value];
}

function getBackendOrigin() {
  try {
    return new URL(DEFAULT_API_BASE_URL).origin;
  } catch (error) {
    return "http://localhost:8000";
  }
}

export function buildMediaUrl(value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${getBackendOrigin()}${value.startsWith("/") ? value : `/${value}`}`;
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();
  const text = await response.text();
  return text ? { detail: text } : {};
}

function getErrorMessage(payload) {
  if (!payload) return "Request failed";
  if (typeof payload === "string") return payload;
  if (payload.error) return payload.error;
  if (payload.detail) return payload.detail;
  if (payload.message) return payload.message;
  const firstValue = Object.values(payload)[0];
  if (Array.isArray(firstValue) && firstValue.length > 0) return firstValue[0];
  return "Request failed";
}

// ----- Session management (unchanged) -----
export function getStoredUser() {
  const raw = readSessionValue(STORAGE_KEYS.user);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Unable to parse stored user", error);
    return null;
  }
}

export function getAccessToken() {
  return null;
}

export function getRefreshToken() {
  return null;
}

export function saveSession(session = {}) {
  if (!isBrowser()) return;

  const existingUser = session.user || getStoredUser();
  const storageType = shouldUseSessionStorage({ user: existingUser })
    ? SESSION_TYPES.session
    : SESSION_TYPES.persistent;
  const maxAge = storageType === SESSION_TYPES.persistent ? 30 * 24 * 60 * 60 : undefined;

  clearStorageBucket(SESSION_TYPES.session);
  clearStorageBucket(SESSION_TYPES.persistent);

  if (existingUser) writeStorage(STORAGE_KEYS.user, JSON.stringify(existingUser), storageType);
  writeStorage(STORAGE_KEYS.sessionType, storageType, storageType);

  buildCookie("boem_session", "1", { maxAge });
  buildCookie("boem_role", existingUser?.is_staff ? "admin" : "user", { maxAge });
}

export function clearSession() {
  clearStorageBucket(SESSION_TYPES.session);
  clearStorageBucket(SESSION_TYPES.persistent);
  if (isBrowser()) {
    clearCookie("boem_session");
    clearCookie("boem_role");
  }
}

async function refreshAccessToken() {
  const headers = {};
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    headers["X-CSRFToken"] = csrfToken;
  }

  const response = await fetch(`${DEFAULT_API_BASE_URL}/auth/token/refresh/`, {
    method: "POST",
    headers,
    credentials: "include",
  });

  const payload = await parseResponse(response);
  if (!response.ok) {
    clearSession();
    return null;
  }

  return payload;
}

export async function apiRequest(
  path,
  { auth = false, retryOnUnauthorized = true, headers = {}, body, method = "GET", ...options } = {}
) {
  const requestHeaders = new Headers(headers);
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const includeCredentials = shouldIncludeCredentials(path, method, auth);

  if (!isFormData && body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (isUnsafeMethod(method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      requestHeaders.set("X-CSRFToken", csrfToken);
    }
  }

  const response = await fetch(`${DEFAULT_API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: isFormData || body === undefined ? body : JSON.stringify(body),
    credentials: includeCredentials ? "include" : "omit",
    ...options,
  });

  if (response.status === 401 && auth && retryOnUnauthorized) {
    const refreshPayload = await refreshAccessToken();
    if (refreshPayload) {
      return apiRequest(path, {
        auth,
        retryOnUnauthorized: false,
        headers,
        body,
        method,
        ...options,
      });
    }
  }

  const payload = await parseResponse(response);
  if (!response.ok) {
    const error = new Error(getErrorMessage(payload));
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}

// ----- Data mappers (unchanged) -----
export function mapTemplate(record) {
  const price = toNumber(record.price);
  const category = ensureArray(record.category);
  return {
    id: String(record.id),
    name: record.name,
    title: record.name,
    shortName: record.short_name || record.name,
    category,
    categories: category,
    type: record.type || "ready",
    previewUrl: record.preview_url || "#",
    image: buildMediaUrl(record.image),
    description: record.description || "",
    price,
    priceLabel: price !== null ? `$${price.toLocaleString()}` : "Custom Quote",
    priceNote: record.price_note || (record.type === "custom" ? "Customizable website" : "Ready-made website"),
    badge: record.badge || (record.type === "custom" ? "Customizable" : "Ready-Made"),
    badgeClass: record.badge_class || (record.type === "custom" ? "wc-template-tag--custom" : "wc-template-tag--ready"),
    tags: [],
    icons: [],
    isActive: Boolean(record.is_active && !record.is_draft),
    pages: "5-10",
  };
}

export function mapAppService(record) {
  return {
    id: String(record.id),
    type: ensureArray(record.type),
    icon: record.icon || "fas fa-laptop-code",
    title: record.title,
    description: record.description || "",
    longDescription: record.description || "",
    meta: ensureArray(record.meta),
    features: ensureArray(record.features),
    category: record.category || "service",
    tag: record.tag || "",
  };
}

export function mapAIAutomation(record) {
  return {
    id: String(record.id),
    title: record.title,
    description: record.description || "",
    sector: record.sector || "all",
    icon: record.icon || "fas fa-robot",
    features: ensureArray(record.features),
    integration: ensureArray(record.integration),
    useCases: ensureArray(record.use_cases),
    benefits: ensureArray(record.benefits),
    price: "Custom Quote",
    priceNote: record.price_note || "Request a custom quote",
    deliveryTime: record.delivery_time || "Flexible",
    previewUrl: record.preview_url || "#",
    image: buildMediaUrl(record.image),
  };
}

export function mapAIBundle(record) {
  return {
    id: String(record.id),
    title: record.title,
    description: record.description || "",
    tag: record.tag || "Bundle",
    items: ensureArray(record.items),
    features: ensureArray(record.features),
    idealFor: ensureArray(record.ideal_for),
    price: "Custom Quote",
    priceNote: record.price_note || "Request a custom quote",
    deliveryTime: record.delivery_time || "Flexible",
    previewUrl: record.preview_url || "#",
    image: buildMediaUrl(record.image),
  };
}

export function mapPackage(record) {
  return {
    id: String(record.id),
    category: record.category,
    subcategory: record.subcategory,
    tier: record.tier,
    title: record.title,
    subtitle: record.subtitle || "",
    billingOneTime: String(toNumber(record.billing_one_time) ?? ""),
    billingMonthly: String(toNumber(record.billing_monthly) ?? ""),
    features: ensureArray(record.features),
    popular: Boolean(record.popular),
    bestValue: Boolean(record.best_value),
    footnote: record.footnote || "",
  };
}

export function mapBuilderOptions(groupedData) {
  const transformOptions = (options) =>
    ensureArray(options).map((option) => ({
      ...option,
      price: toNumber(option.price) || 0,
    }));

  return {
    web: {
      base: transformOptions(groupedData?.web?.base),
      extras: transformOptions(groupedData?.web?.extras),
    },
    app: {
      base: transformOptions(groupedData?.app?.base),
      extras: transformOptions(groupedData?.app?.extras),
    },
    ai: {
      base: transformOptions(groupedData?.ai?.base),
      extras: transformOptions(groupedData?.ai?.extras),
    },
    priority: ensureArray(groupedData?.priority).map((priority) => ({
      ...priority,
      multiplier: toNumber(priority.multiplier) || 1,
    })),
  };
}

// ----- Authentication & User -----


export async function register(account) {
  return apiRequest("/auth/register/", {
    method: "POST",
    body: account,
  });
}

export async function requestPasswordReset(email) {
  return apiRequest("/auth/forgot-password/", {
    method: "POST",
    body: { email },
  });
}

export async function resetPassword(payload) {
  return apiRequest("/auth/reset-password/", {
    method: "POST",
    body: payload,
  });
}

export async function fetchCurrentUser() {
  return apiRequest("/auth/me/", { auth: true });
}

// ----- Templates -----
export async function fetchTemplates(params = {}) {
  const payload = await apiRequest(`/templates/public/${toQueryString(params)}`);
  return ensureArray(payload).map(mapTemplate);
}

export async function fetchTemplate(id) {
  const payload = await apiRequest(`/templates/public/${id}/`);
  return mapTemplate(payload);
}

export async function createTemplate(formData) {
  return apiRequest("/templates/admin/", {
    method: "POST",
    auth: true,
    body: formData,
  });
}

// ----- Services (Web & Mobile Apps) -----
export async function fetchAppServices(params = {}) {
  const payload = await apiRequest(`/services/${toQueryString(params)}`);
  return ensureArray(payload).map(mapAppService);
}

export async function fetchAppService(id) {
  const payload = await apiRequest(`/services/${id}/`);
  return mapAppService(payload);
}

// ----- AI Automations (updated endpoints) -----
export async function fetchAIAutomations(params = {}) {
  const payload = await apiRequest(`/automation/automations/${toQueryString(params)}`);
  return ensureArray(payload).map(mapAIAutomation);
}

export async function fetchAIAutomation(id) {
  const payload = await apiRequest(`/automation/automations/${id}/`);
  return mapAIAutomation(payload);
}

export async function fetchAIBundles() {
  const payload = await apiRequest("/automation/bundles/");
  return ensureArray(payload).map(mapAIBundle);
}

export async function fetchAIBundle(id) {
  const payload = await apiRequest(`/automation/bundles/${id}/`);
  return mapAIBundle(payload);
}

// ----- Pricing -----
// Public grouped pricing (matches the structure of the frontend mockup)
export async function fetchPricingData() {
  // GET /api/v1/pricing/  -> returns { websites: { ready, custom }, apps, ai }
  return apiRequest('/pricing/');
}

// Builder options (public)
export async function fetchBuilderOptions() {
  // GET /api/v1/pricing/builder/grouped/
  const payload = await apiRequest("/pricing/builder/grouped/");
  return mapBuilderOptions(payload);
}

// ----- Inquiries & Orders (auth) -----
export async function createInquiry(payload) {
  return apiRequest("/inquiries/", {
    method: "POST",
    body: payload,
  });
}

// ----- Clients -----
export async function fetchClients(params = {}) {
  return apiRequest(`/clients/${toQueryString(params)}`, { auth: true });
}



export async function createThread(payload) {
  return apiRequest("/messages/threads/", {
    method: "POST",
    auth: true,
    body: payload,
  });
}



export async function replyToThread(id, payload) {
  return apiRequest(`/messages/threads/${id}/reply/`, {
    method: "POST",
    auth: true,
    body: payload,
  });
}



// ----- Support -----
export async function fetchSupportTickets(params = {}) {
  return apiRequest(`/support/tickets/${toQueryString(params)}`, { auth: true });
}

export async function createSupportTicket(payload) {
  return apiRequest("/support/tickets/", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function fetchSupportTicket(id) {
  return apiRequest(`/support/tickets/${id}/`, { auth: true });
}

export async function updateSupportTicket(id, payload) {
  return apiRequest(`/support/tickets/${id}/`, {
    method: "PATCH",
    auth: true,
    body: payload,
  });
}

export async function replyToSupportTicket(id, payload) {
  return apiRequest(`/support/tickets/${id}/reply/`, {
    method: "POST",
    auth: true,
    body: payload,
  });
}

// ----- Files -----
export async function fetchProjectFiles(params = {}) {
  return apiRequest(`/files/${toQueryString(params)}`, { auth: true });
}







// ----- Admin CRUD for App Services -----
export async function fetchAppServicesAdmin() {
  return apiRequest('/services/admin/', { auth: true });
}

export async function createAppServiceAdmin(data) {
  return apiRequest('/services/admin/', {
    method: 'POST',
    body: data,
    auth: true,
  });
}

export async function updateAppServiceAdmin(id, data) {
  return apiRequest(`/services/admin/${id}/`, {
    method: 'PUT',
    body: data,
    auth: true,
  });
}

export async function deleteAppServiceAdmin(id) {
  return apiRequest(`/services/admin/${id}/`, {
    method: 'DELETE',
    auth: true,
  });
}

// ----- Admin CRUD for AI Automations -----
export async function fetchAutomationsAdmin() {
  return apiRequest('/automation/admin/automations/', { auth: true });
}

export async function createAutomationAdmin(data) {
  return apiRequest('/automation/admin/automations/', {
    method: 'POST',
    body: data,
    auth: true,
  });
}

export async function updateAutomationAdmin(id, data) {
  return apiRequest(`/automation/admin/automations/${id}/`, {
    method: 'PUT',
    body: data,
    auth: true,
  });
}

export async function deleteAutomationAdmin(id) {
  return apiRequest(`/automation/admin/automations/${id}/`, {
    method: 'DELETE',
    auth: true,
  });
}

// ----- Admin CRUD for AI Bundles -----
export async function fetchBundlesAdmin() {
  return apiRequest('/automation/admin/bundles/', { auth: true });
}

export async function createBundleAdmin(data) {
  return apiRequest('/automation/admin/bundles/', {
    method: 'POST',
    body: data,
    auth: true,
  });
}

export async function updateBundleAdmin(id, data) {
  return apiRequest(`/automation/admin/bundles/${id}/`, {
    method: 'PUT',
    body: data,
    auth: true,
  });
}

export async function deleteBundleAdmin(id) {
  return apiRequest(`/automation/admin/bundles/${id}/`, {
    method: 'DELETE',
    auth: true,
  });
}

// ----- Admin CRUD for Templates -----
export async function fetchTemplatesAdmin() {
  return apiRequest('/templates/admin/', { auth: true });
}

export async function fetchTemplateAdmin(id) {
  return apiRequest(`/templates/admin/${id}/`, { auth: true });
}

export async function createTemplateAdmin(data) {
  return apiRequest('/templates/admin/', {
    method: 'POST',
    body: data,
    auth: true,
  });
}

export async function updateTemplateAdmin(id, data) {
  return apiRequest(`/templates/admin/${id}/`, {
    method: 'PUT',
    body: data,
    auth: true,
  });
}

export async function deleteTemplateAdmin(id) {
  return apiRequest(`/templates/admin/${id}/`, {
    method: 'DELETE',
    auth: true,
  });
}

// ----- Orders -----
export async function createOrder(data) {
  return apiRequest('/orders/', {
    method: 'POST',
    body: data,
    auth: Boolean(getStoredUser()),
  });
}



export async function fetchOrder(id) {
  return apiRequest(`/orders/${id}/`, { auth: true });
}

export async function fetchOrdersAdmin(params = {}) {
  return apiRequest(`/orders/${toQueryString(params)}`, { auth: true });
}




// ... (all previous code up to the Orders section)

// ----- Orders -----


export async function fetchMyOrders(params = {}) {
  return apiRequest(`/orders/${toQueryString(params)}`, { auth: true });
}



export async function fetchOrders(params = {}) {
  // Used by admin dashboard; returns all orders (admin only)
  return apiRequest(`/orders/${toQueryString(params)}`, { auth: true });
}


export async function fetchOrderStats() {
  return apiRequest("/orders/stats/", { auth: true });
}

// ----- Workforce / Internal Staff Operations -----
export async function fetchWorkforceDashboard() {
  return apiRequest("/workforce/dashboard/", { auth: true });
}

export async function fetchTeamMembers(params = {}) {
  return apiRequest(`/workforce/team-members/${toQueryString(params)}`, { auth: true });
}

export async function updateTeamMember(id, data) {
  return apiRequest(`/workforce/team-members/${id}/`, {
    method: "PATCH",
    body: data,
    auth: true,
  });
}

export async function fetchStaffTasks(params = {}) {
  return apiRequest(`/workforce/tasks/${toQueryString(params)}`, { auth: true });
}

export async function createStaffTask(data) {
  return apiRequest("/workforce/tasks/", {
    method: "POST",
    body: data,
    auth: true,
  });
}

export async function updateStaffTask(id, data) {
  return apiRequest(`/workforce/tasks/${id}/`, {
    method: "PATCH",
    body: data,
    auth: true,
  });
}

export async function deleteStaffTask(id) {
  return apiRequest(`/workforce/tasks/${id}/`, {
    method: "DELETE",
    auth: true,
  });
}

export async function updateOrderAdmin(id, data) {
  return apiRequest(`/orders/${id}/`, {
    method: 'PATCH',
    body: data,
    auth: true,
  });
}

export async function deleteOrderAdmin(id) {
  return apiRequest(`/orders/${id}/`, {
    method: 'DELETE',
    auth: true,
  });
}



// ----- Inquiries (Admin) -----
export async function fetchInquiries(params = {}) {
  return apiRequest(`/inquiries/${toQueryString(params)}`, { auth: true });
}

export async function fetchInquiry(id) {
  return apiRequest(`/inquiries/${id}/`, { auth: true });
}

export async function updateInquiryAdmin(id, data) {
  return apiRequest(`/inquiries/${id}/`, {
    method: 'PATCH',
    body: data,
    auth: true,
  });
}

export async function deleteInquiryAdmin(id) {
  return apiRequest(`/inquiries/${id}/`, {
    method: 'DELETE',
    auth: true,
  });
}


// Admin files
export async function fetchAllFilesAdmin(params = {}) {
  return apiRequest(`/files/${toQueryString(params)}`, { auth: true });
}

export async function updateFileAdmin(id, data) {
  return apiRequest(`/files/${id}/`, {
    method: 'PATCH',
    body: data,
    auth: true,
  });
}


// ----- Files (User & Admin) -----
export async function uploadProjectFile(formData) {
  return apiRequest("/files/", {
    method: "POST",
    auth: true,
    body: formData,
  });
}

// Admin aliases (for clarity)


export const deleteFileAdmin = deleteProjectFile



export async function deleteProjectFile(id) {
  return apiRequest(`/files/${id}/`, {
    method: "DELETE",
    auth: true,
  });
}

export async function updateProjectFile(id, data) {
  return apiRequest(`/files/${id}/`, {
    method: "PATCH",
    body: data,
    auth: true,
  });
}


// Admin aliases (for clarity)



// Mark messages as read in a thread
export async function markThreadRead(id, data) {
  return apiRequest(`/messages/threads/${id}/read/`, {
    method: 'PATCH',
    body: data,
    auth: true,
  });
}





// Update a thread (e.g., archive/unarchive)
export async function updateThread(id, data) {
  return apiRequest(`/messages/threads/${id}/`, {
    method: 'PATCH',
    body: data,
    auth: true,
  });
}



// Delete a thread
export async function deleteThread(id) {
  return apiRequest(`/messages/threads/${id}/`, {
    method: 'DELETE',
    auth: true,
  });
}

// Also ensure fetchThread accepts viewerRole (if not already)
export async function fetchThread(id, viewerRole = "admin") {
  return apiRequest(`/messages/threads/${id}/?viewer_role=${viewerRole}`, { auth: true });
}


// ----- Messaging (Threads) -----
export async function fetchThreads(params = {}) {
  return apiRequest(`/messages/threads/${toQueryString(params)}`, { auth: true });
}





// Notifications
export async function fetchNotifications(params = {}) {
  return apiRequest(`/notifications/${toQueryString(params)}`, { auth: true });
}

export async function markNotificationRead(id) {
  return apiRequest(`/notifications/${id}/mark_read/`, { method: 'POST', auth: true });
}

export async function markAllNotificationsRead() {
  return apiRequest(`/notifications/mark_all_read/`, { method: 'POST', auth: true });

}


// ----- User Profile -----
export async function fetchUserProfile() {
  return apiRequest('/users/profile/', { auth: true });
}

export async function updateUserProfile(data) {
  return apiRequest('/users/profile/', {
    method: 'PATCH',
    body: data,
    auth: true,
  });
}

export async function deleteUserAccount() {
  const response = await apiRequest('/users/profile/', {
    method: 'DELETE',
    auth: true,
    retryOnUnauthorized: false,
  });
  clearSession();
  return response;
}

export async function changePassword(data) {
  return apiRequest('/users/change-password/', {
    method: 'POST',
    body: data,
    auth: true,
  });
}

export async function changeEmail(data) {
  return apiRequest('/users/change-email/', {
    method: 'POST',
    body: data,
    auth: true,
  });
}



// ----- Admin CRUD for Pricing Packages -----
export async function fetchPricingPackagesAdmin() {
  return apiRequest('/pricing/packages/admin/', { auth: true });
}

export async function createPricingPackageAdmin(data) {
  return apiRequest('/pricing/packages/admin/', {
    method: 'POST',
    body: data,
    auth: true,
  });
}

export async function updatePricingPackageAdmin(id, data) {
  return apiRequest(`/pricing/packages/admin/${id}/`, {
    method: 'PUT',
    body: data,
    auth: true,
  });
}

export async function deletePricingPackageAdmin(id) {
  return apiRequest(`/pricing/packages/admin/${id}/`, {
    method: 'DELETE',
    auth: true,
  });
}

// ----- Admin CRUD for Builder Options -----
export async function fetchBuilderOptionsAdmin() {
  return apiRequest('/pricing/builder/admin/options/', { auth: true });
}

export async function createBuilderOptionAdmin(data) {
  return apiRequest('/pricing/builder/admin/options/', {
    method: 'POST',
    body: data,
    auth: true,
  });
}

export async function updateBuilderOptionAdmin(id, data) {
  return apiRequest(`/pricing/builder/admin/options/${id}/`, {
    method: 'PUT',
    body: data,
    auth: true,
  });
}

export async function deleteBuilderOptionAdmin(id) {
  return apiRequest(`/pricing/builder/admin/options/${id}/`, {
    method: 'DELETE',
    auth: true,
  });
}

// ----- Admin CRUD for Builder Priorities -----
export async function fetchPrioritiesAdmin() {
  return apiRequest('/pricing/builder/admin/priorities/', { auth: true });
}

export async function createPriorityAdmin(data) {
  return apiRequest('/pricing/builder/admin/priorities/', {
    method: 'POST',
    body: data,
    auth: true,
  });
}

export async function updatePriorityAdmin(id, data) {
  return apiRequest(`/pricing/builder/admin/priorities/${id}/`, {
    method: 'PUT',
    body: data,
    auth: true,
  });
}

export async function deletePriorityAdmin(id) {
  return apiRequest(`/pricing/builder/admin/priorities/${id}/`, {
    method: 'DELETE',
    auth: true,
  });
}

async function persistAuthenticatedUser(payload) {
  if (payload.user) {
    saveSession({ user: payload.user });
    return payload;
  }

  if (payload.user_id) {
    return payload;
  }

  try {
    const user = await fetchCurrentUser();
    if (user) {
      saveSession({ user });
      payload.user = user;
    }
  } catch (err) {
    console.error("Failed to fetch current user after authentication", err);
  }

  return payload;
}

export async function login(credentials) {
  const payload = await apiRequest("/auth/login/", {
    method: "POST",
    body: credentials,
  });
  return persistAuthenticatedUser(payload);
}

export async function setupTwoFactor() {
  return apiRequest("/auth/2fa/setup/", {
    method: "POST",
    auth: true,
  });
}

export async function verifyTwoFactorSetup(data) {
  return apiRequest("/auth/2fa/verify/", {
    method: "POST",
    body: data,
    auth: true,
  });
}

export async function verifyTwoFactorLogin(data) {
  const payload = await apiRequest("/auth/2fa/login/", {
    method: "POST",
    body: data,
  });
  return persistAuthenticatedUser(payload);
}

export async function logout() {
  try {
    await apiRequest("/auth/logout/", {
      method: "POST",
      auth: true,
      retryOnUnauthorized: false,
    });
  } catch (error) {
    console.error("Logout request failed", error);
  } finally {
    clearSession();
  }
}
