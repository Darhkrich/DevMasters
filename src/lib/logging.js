const isProduction = process.env.NODE_ENV === "production";

export function logAppError(...args) {
  if (!isProduction && typeof console !== "undefined") {
    console.error(...args);
  }
}

export function logAppInfo(...args) {
  if (!isProduction && typeof console !== "undefined") {
    console.info(...args);
  }
}
