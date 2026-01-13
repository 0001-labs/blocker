/**
 * Convex client setup for vanilla JS with @convex-dev/auth
 */

import { ConvexClient } from "convex/browser";

// Get the Convex URL from environment
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;

if (!CONVEX_URL) {
  throw new Error("Missing VITE_CONVEX_URL environment variable. Run 'npx convex dev' first.");
}

// Create the Convex client
export const convex = new ConvexClient(CONVEX_URL);

// Auth token storage key
const AUTH_TOKEN_KEY = "blocker_auth_token";

// Auth state
let currentUser = null;
let isAuthenticatedState = false;
let authStateCallbacks = [];

function notifyAuthStateChange() {
  authStateCallbacks.forEach((cb) => cb(currentUser));
}

// Subscribe to auth state changes
export function onAuthStateChange(callback) {
  authStateCallbacks.push(callback);
  callback(currentUser);
  return () => {
    authStateCallbacks = authStateCallbacks.filter((cb) => cb !== callback);
  };
}

// Check if user is authenticated
export function isAuthenticated() {
  return isAuthenticatedState;
}

// Get current user
export function getCurrentUser() {
  return currentUser;
}

// Get the Convex site URL for HTTP actions
function getConvexSiteUrl() {
  // Convert .cloud to .site for HTTP endpoints
  return CONVEX_URL.replace(".cloud", ".site");
}

// Sign in with Google (OAuth redirect)
export function signInWithGoogle() {
  const siteUrl = getConvexSiteUrl();
  const redirectUrl = `${window.location.origin}/app.html`;
  window.location.href = `${siteUrl}/api/auth/signin/google?redirectTo=${encodeURIComponent(redirectUrl)}`;
}

// Sign in with email (magic link via Resend)
export async function signInWithEmail(email) {
  const siteUrl = getConvexSiteUrl();
  const redirectUrl = `${window.location.origin}/app.html`;

  const response = await fetch(`${siteUrl}/api/auth/signin/resend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      redirectTo: redirectUrl,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Magic link error:", text);
    throw new Error("Failed to send magic link");
  }

  return response.json();
}

// Sign out
export async function signOut() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  convex.setAuth(null);
  isAuthenticatedState = false;
  currentUser = null;
  notifyAuthStateChange();
}

// Initialize auth - check URL for callback token
export async function initAuth() {
  // Check URL for auth callback token
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (token) {
    // Store the token
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    // Clean up URL
    window.history.replaceState({}, "", window.location.pathname);
  }

  // Check for stored token
  const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
  if (storedToken) {
    try {
      // Set auth on the Convex client
      convex.setAuth(storedToken);

      // Validate by fetching current user
      const { api } = await import("../convex/_generated/api.js");
      currentUser = await convex.query(api.users.current);

      if (currentUser) {
        isAuthenticatedState = true;
        notifyAuthStateChange();
        return true;
      } else {
        // Token invalid, clear it
        localStorage.removeItem(AUTH_TOKEN_KEY);
        convex.setAuth(null);
      }
    } catch (err) {
      console.error("Auth validation failed:", err);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      convex.setAuth(null);
    }
  }

  return false;
}

// Query helper
export async function query(queryFn, args = {}) {
  return convex.query(queryFn, args);
}

// Mutation helper
export async function mutation(mutationFn, args = {}) {
  return convex.mutation(mutationFn, args);
}

// Subscribe to a query with real-time updates
export function subscribe(queryFn, args, callback) {
  return convex.onUpdate(queryFn, args, callback);
}

export { convex as client };
