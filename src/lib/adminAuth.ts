import crypto from "crypto";

export const ADMIN_MASTER_PASSWORD = process.env.ADMIN_PASSWORD || "yash_purnik_ipolist_final_pass@9182";
export const ADMIN_SECRET_PATH = process.env.ADMIN_SECRET_PATH || "portal-console-x9182-admin-secure";
export const ADMIN_SESSION_COOKIE = "ipolist_admin_session";

// Secret salt for signing tokens
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || "ipolist_admin_salt_key_9182_secret";

/**
 * Generate session token hash based on password and secret salt
 */
export function generateAdminToken(): string {
  return crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(ADMIN_MASTER_PASSWORD)
    .digest("hex");
}

/**
 * Verify if provided token matches valid admin session token
 */
export function isValidAdminToken(token?: string | null): boolean {
  if (!token) return false;
  const expectedToken = generateAdminToken();
  return token === expectedToken;
}
