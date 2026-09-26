/** Base URL for browser-side requests to the PGLife API. */
export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

/**
 * Base URL for server-side (React Server Component) requests. Falls back to the
 * public URL so a single variable is enough for local development.
 */
export const apiServerUrl =
  process.env.API_INTERNAL_URL?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:4000";

export const config = {
  apiBaseUrl,
  apiServerUrl,
  siteName: "PG Life",
} as const;
