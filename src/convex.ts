/**
 * Convex client setup for vanilla JS with @convex-dev/auth
 */

import { ConvexClient } from "convex/browser";

// Get the Convex URL from environment
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string;

if (!CONVEX_URL) {
  throw new Error("Missing VITE_CONVEX_URL environment variable. Run 'npx convex dev' first.");
}

// Create the Convex client
export const convex = new ConvexClient(CONVEX_URL);

// Auth token storage key
const AUTH_TOKEN_KEY = "blocker_auth_token";

// Auth state
let currentUser: unknown = null;

// Get the Convex site URL for HTTP actions
function getConvexSiteUrl(): string {
  // Convert .cloud to .site for HTTP endpoints
  return CONVEX_URL.replace(".cloud", ".site");
}

// Sign in with email (magic link via Resend)
export async function signInWithEmail(email: string): Promise<unknown> {
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
export async function signOut(): Promise<void> {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  convex.setAuth(async () => null);
  currentUser = null;
}

// Initialize auth - check URL for callback token
export async function initAuth(): Promise<boolean> {
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
      // Set auth on the Convex client (must be a function that returns the token)
      convex.setAuth(async () => storedToken);

      // Validate by fetching current user
      const { api } = await import("../convex/_generated/api.js");
      currentUser = await convex.query(api.users.current, {});

      if (currentUser) {
        return true;
      } else {
        // Token invalid, clear it
        localStorage.removeItem(AUTH_TOKEN_KEY);
        convex.setAuth(async () => null);
      }
    } catch (err) {
      console.error("Auth validation failed:", err);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      convex.setAuth(async () => null);
    }
  }

  return false;
}
