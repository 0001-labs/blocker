/**
 * Blocker API client
 *
 * Hybrid architecture:
 * - Convex: Auth, schedule storage (primary), vault token
 * - Worker: Password vault, schedule copy (for independent blocking check)
 */

const API_BASE = "https://blocker.0001-labs.workers.dev";

export interface BlockSession {
  id: string;
  day: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  recurring?: boolean;
  title?: string;
}

export interface VaultResponse {
  screenTimeAppleId: string;
  hasStoredPassword: boolean;
  sessions: BlockSession[];
  isBlocking: boolean;
  activeSessionId: string | null;
  activeUntil: string | null;
  timeRemaining: string | null;
  nextSession: {
    startsAt: string;
    day: number;
    startHour: number;
    startMinute: number;
  } | null;
}

export interface PasswordResponse {
  blocked: boolean;
  password?: string;
  activeUntil?: string;
  timeRemaining?: string;
}

export interface CredentialsData {
  screenTimeAppleId?: string;
  screenTimePassword?: string;
}

// Token management - for legacy support and Worker API calls
export function getToken(): string | null {
  return localStorage.getItem("blocker_token");
}

export function setToken(token: string): void {
  localStorage.setItem("blocker_token", token);
}

// Generate a random vault token
export function generateVaultToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

// Get vault from Worker (for blocking state and password access)
export async function getVault(token?: string | null): Promise<VaultResponse | null> {
  const vaultToken = token || getToken();
  if (!vaultToken) return null;

  const response = await fetch(`${API_BASE}/vault?token=${vaultToken}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to get vault: ${response.status}`);
  }

  return response.json();
}

// Save credentials to Worker (password vault only)
export async function saveCredentials(
  token: string,
  data: CredentialsData
): Promise<{ ok: boolean }> {
  const response = await fetch(`${API_BASE}/vault`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, ...data }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Failed to save credentials: ${response.status}`);
  }

  return response.json();
}

// Sync schedule to Worker (for independent blocking verification)
export async function syncScheduleToWorker(
  token: string,
  sessions: BlockSession[]
): Promise<{ ok: boolean }> {
  const response = await fetch(`${API_BASE}/vault`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, sessions }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Failed to sync schedule: ${response.status}`);
  }

  return response.json();
}

// Get password from Worker (blocked during active session)
export async function getPassword(token?: string | null): Promise<PasswordResponse> {
  const vaultToken = token || getToken();
  if (!vaultToken) throw new Error("No token");

  const response = await fetch(`${API_BASE}/password?token=${vaultToken}`);

  if (response.status === 403) {
    const data = await response.json();
    return { blocked: true, ...data };
  }

  if (!response.ok) {
    throw new Error(`Failed to get password: ${response.status}`);
  }

  const data = await response.json();
  return { blocked: false, password: data.password };
}

// Delete vault from Worker
export async function deleteVault(token?: string | null): Promise<{ ok: boolean }> {
  const vaultToken = token || getToken();
  if (!vaultToken) throw new Error("No token");

  const response = await fetch(`${API_BASE}/vault?token=${vaultToken}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error || `Failed to delete vault: ${response.status}`
    );
  }

  return response.json();
}
