import { rateLimit } from "./rateLimit";
import sanitizeHtml from "sanitize-html";

export function clean(input) {
  if (typeof input !== "string") return input;

  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

export function deepClean(obj) {
  if (!obj) return obj;

  if (typeof obj === "string") return clean(obj);

  if (Array.isArray(obj)) return obj.map(deepClean);

  if (typeof obj === "object") {
    const cleaned = {};
    for (const key in obj) {
      cleaned[key] = deepClean(obj[key]);
    }
    return cleaned;
  }

  return obj;
}

export function checkRateLimit(req, limit = 10) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  return rateLimit(ip, limit, 60000);
}

export function checkPayloadSize(req, max = 10000) {
  const size = req.headers.get("content-length");
  return !(size && parseInt(size) > max);
}

export function requireAdmin(req) {
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${process.env.ADMIN_SECRET}`;
}