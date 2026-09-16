// Base URL of the backend API. Used by both client components (browser fetch
// with credentials) and server components (fetch forwarding the incoming
// request's cookies, since server-to-server requests don't carry them
// automatically).
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/** For use in client components ("use client"). Sends/receives the session cookie. */
export async function apiFetch(path: string, init: RequestInit = {}) {
  return fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
}

/**
 * For use in server components/layouts. Forwards the incoming request's
 * cookies to the backend so protected endpoints (e.g. /api/auth/me) see the
 * visitor's session. Pass the value of `(await cookies()).toString()`.
 */
export async function serverApiFetch(
  path: string,
  cookieHeader: string,
  init: RequestInit = {},
) {
  return fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Cookie: cookieHeader,
      ...init.headers,
    },
  });
}
