export const ADMIN_MASTER_PASSWORD = process.env.ADMIN_PASSWORD || "yash_purnik_ipolist_final_pass@9182";
export const ADMIN_SECRET_PATH = process.env.ADMIN_SECRET_PATH || "portal-console-x9182-admin-secure";
export const ADMIN_SESSION_COOKIE = "ipolist_admin_session";

// Pre-computed HMAC token using a simple deterministic string that works
// in both Edge Runtime (middleware) and Node.js server contexts.
// We use a simple hash-like value derived from the password to avoid
// Node.js crypto (not available in Edge Runtime).
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || "ipolist_admin_salt_key_9182_secret";

/**
 * Generate a simple, deterministic session token without Node.js crypto.
 * This runs in Edge Runtime (middleware) safely.
 */
export function generateAdminToken(): string {
  // Simple deterministic token from password + secret (no crypto module needed)
  const raw = `${ADMIN_MASTER_PASSWORD}::${TOKEN_SECRET}`;
  // btoa is available in Edge Runtime and browsers
  if (typeof btoa !== "undefined") {
    return btoa(raw).replace(/[^a-zA-Z0-9]/g, "").slice(0, 64);
  }
  // Node.js fallback
  return Buffer.from(raw).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 64);
}

/**
 * Verify if provided token matches valid admin session token.
 */
export function isValidAdminToken(token?: string | null): boolean {
  if (!token) return false;
  const expectedToken = generateAdminToken();
  return token === expectedToken;
}
