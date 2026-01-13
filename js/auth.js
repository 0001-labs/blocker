/**
 * Vanilla JS auth helper for @convex-dev/auth
 * Reads JWT token from localStorage to check auth state
 */

const JWT_STORAGE_KEY = "__convexAuthJWT";
const REFRESH_STORAGE_KEY = "__convexAuthRefreshToken";

let currentState = { isAuthenticated: false, payload: null };

function getNamespace() {
  const url = import.meta.env.VITE_CONVEX_URL;
  if (!url) return null;
  return url.replace(/[^a-zA-Z0-9]/g, "");
}

function storageKey(base) {
  const ns = getNamespace();
  if (!ns) return null;
  return `${base}_${ns}`;
}

function readLocalStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn("Unable to access localStorage:", error);
    return null;
  }
}

function decodeBase64Url(str) {
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

function parseJwt(token) {
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

function tokenIsFresh(payload) {
  if (!payload || typeof payload !== "object") return false;
  if (!payload.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
}

function getCurrentJwt() {
  const key = storageKey(JWT_STORAGE_KEY);
  if (!key) return null;
  return readLocalStorage(key);
}

function evaluateAuthState() {
  const token = getCurrentJwt();
  const payload = parseJwt(token);
  const isAuthenticated = token ? tokenIsFresh(payload) : false;
  return { isAuthenticated, payload: isAuthenticated ? payload : null };
}

export function refreshAuthState() {
  if (typeof window === "undefined") {
    currentState = { isAuthenticated: false, payload: null };
    return currentState;
  }

  currentState = evaluateAuthState();
  return currentState;
}

export function isAuthenticated() {
  return refreshAuthState().isAuthenticated;
}

export function getCurrentUser() {
  const state = refreshAuthState();
  if (!state.isAuthenticated || !state.payload) return null;
  const { email, sub } = state.payload;
  return { email: email ?? null, id: sub ?? null };
}

export function clearAuth() {
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

export function initAuth() {
  refreshAuthState();

  // Listen for storage changes (e.g., logout in another tab)
  window.addEventListener("storage", (event) => {
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
