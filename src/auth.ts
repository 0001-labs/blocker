/**
 * Vanilla JS auth helper for @convex-dev/auth
 * Reads JWT token from localStorage to check auth state
 */

interface JwtPayload {
  email?: string;
  sub?: string;
  exp?: number;
  [key: string]: unknown;
}

interface AuthState {
  isAuthenticated: boolean;
  payload: JwtPayload | null;
}

interface CurrentUser {
  email: string | null;
  id: string | null;
}

const JWT_STORAGE_KEY = "__convexAuthJWT";
const REFRESH_STORAGE_KEY = "__convexAuthRefreshToken";

let currentState: AuthState = { isAuthenticated: false, payload: null };

function getNamespace(): string | null {
  const url = import.meta.env.VITE_CONVEX_URL as string | undefined;
  if (!url) return null;
  return url.replace(/[^a-zA-Z0-9]/g, "");
}

function storageKey(base: string): string | null {
  const ns = getNamespace();
  if (!ns) return null;
  return `${base}_${ns}`;
}

function readLocalStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn("Unable to access localStorage:", error);
    return null;
  }
}

function decodeBase64Url(str: string): string | null {
  try {
    const padded = str.padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
    const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
  } catch {
    return null;
  }
}

function parseJwt(token: string | null): JwtPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const payloadJson = decodeBase64Url(parts[1]);
  if (!payloadJson) return null;
  try {
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

function tokenIsFresh(payload: JwtPayload | null): boolean {
  if (!payload || typeof payload !== "object") return false;
  if (!payload.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
}

export function getCurrentJwt(): string | null {
  const key = storageKey(JWT_STORAGE_KEY);
  if (!key) return null;
  return readLocalStorage(key);
}

function evaluateAuthState(): AuthState {
  const token = getCurrentJwt();
  const payload = parseJwt(token);
  const isAuthenticated = token ? tokenIsFresh(payload) : false;
  return { isAuthenticated, payload: isAuthenticated ? payload : null };
}

export function refreshAuthState(): AuthState {
  if (typeof window === "undefined") {
    currentState = { isAuthenticated: false, payload: null };
    return currentState;
  }

  currentState = evaluateAuthState();
  return currentState;
}

export function isAuthenticated(): boolean {
  return refreshAuthState().isAuthenticated;
}

export function getCurrentUser(): CurrentUser | null {
  const state = refreshAuthState();
  if (!state.isAuthenticated || !state.payload) return null;
  const { email, sub } = state.payload;
  return { email: email ?? null, id: sub ?? null };
}

export function clearAuth(): void {
  const jwtKey = storageKey(JWT_STORAGE_KEY);
  const refreshKey = storageKey(REFRESH_STORAGE_KEY);
  try {
    if (jwtKey) window.localStorage.removeItem(jwtKey);
    if (refreshKey) window.localStorage.removeItem(refreshKey);
  } catch {
    /* ignore */
  }
  currentState = { isAuthenticated: false, payload: null };
}

export function initAuth(): void {
  refreshAuthState();

  // Listen for storage changes (e.g., logout in another tab)
  window.addEventListener("storage", (event: StorageEvent) => {
    if (!event.key) return;
    const jwtKey = storageKey(JWT_STORAGE_KEY);
    if (event.key === jwtKey) {
      refreshAuthState();
    }
  });

  // Refresh on focus
  window.addEventListener("focus", () => {
    refreshAuthState();
  });
}
