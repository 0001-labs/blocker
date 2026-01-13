/**
 * Blocker Vault Worker
 *
 * Credential escrow system for Screen Time blocking.
 * Stores recovery passwords and only releases them after blocking ends.
 */

export interface Env {
  VAULTS: KVNamespace;
}

interface BlockSession {
  id: string;
  day: number; // 0 = Sunday, 1 = Monday, etc.
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

interface Vault {
  token: string;
  screenTimeAppleId: string;
  screenTimePassword: string;
  sessions: BlockSession[];
  createdAt: string;
  updatedAt: string;
}

interface VaultRequest {
  token: string;
  screenTimeAppleId?: string;
  screenTimePassword?: string;
  sessions?: BlockSession[];
}

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function errorResponse(error: string, status: number): Response {
  return jsonResponse({ error }, status);
}

/**
 * Check if currently in a blocking session
 */
function getBlockingState(sessions: BlockSession[]): {
  isBlocking: boolean;
  activeSession: BlockSession | null;
  activeUntil: Date | null;
  timeRemaining: string | null;
} {
  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const session of sessions) {
    if (session.day !== currentDay) continue;

    const startMinutes = session.startHour * 60 + session.startMinute;
    const endMinutes = session.endHour * 60 + session.endMinute;

    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
      // Currently blocking
      const activeUntil = new Date(now);
      activeUntil.setHours(session.endHour, session.endMinute, 0, 0);

      const remainingMs = activeUntil.getTime() - now.getTime();
      const remainingSeconds = Math.floor(remainingMs / 1000);
      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);
      const seconds = remainingSeconds % 60;

      const timeRemaining =
        hours > 0
          ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
          : `${minutes}:${seconds.toString().padStart(2, "0")}`;

      return {
        isBlocking: true,
        activeSession: session,
        activeUntil,
        timeRemaining,
      };
    }
  }

  return {
    isBlocking: false,
    activeSession: null,
    activeUntil: null,
    timeRemaining: null,
  };
}

/**
 * Find the next blocking session
 */
function getNextSession(sessions: BlockSession[]): {
  session: BlockSession;
  startsAt: Date;
} | null {
  if (sessions.length === 0) return null;

  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let closestSession: BlockSession | null = null;
  let closestDate: Date | null = null;

  for (const session of sessions) {
    const startMinutes = session.startHour * 60 + session.startMinute;

    // Calculate days until this session
    let daysUntil = session.day - currentDay;
    if (daysUntil < 0 || (daysUntil === 0 && startMinutes <= currentMinutes)) {
      daysUntil += 7;
    }

    const startsAt = new Date(now);
    startsAt.setDate(startsAt.getDate() + daysUntil);
    startsAt.setHours(session.startHour, session.startMinute, 0, 0);

    if (!closestDate || startsAt < closestDate) {
      closestSession = session;
      closestDate = startsAt;
    }
  }

  if (closestSession && closestDate) {
    return { session: closestSession, startsAt: closestDate };
  }

  return null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // POST /vault - Create or update vault
      if (url.pathname === "/vault" && request.method === "POST") {
        const body = (await request.json()) as VaultRequest;

        if (!body.token) {
          return errorResponse("Missing token", 400);
        }

        // Check for existing vault
        const existingData = await env.VAULTS.get(`vault:${body.token}`);
        const existing: Vault | null = existingData
          ? JSON.parse(existingData)
          : null;

        // If vault exists and is blocking, reject updates
        if (existing) {
          const { isBlocking } = getBlockingState(existing.sessions);
          if (isBlocking) {
            return errorResponse(
              "Cannot modify vault during blocking",
              403
            );
          }
        }

        // Create or update vault
        const vault: Vault = {
          token: body.token,
          screenTimeAppleId:
            body.screenTimeAppleId ?? existing?.screenTimeAppleId ?? "",
          screenTimePassword:
            body.screenTimePassword ?? existing?.screenTimePassword ?? "",
          sessions: body.sessions ?? existing?.sessions ?? [],
          createdAt: existing?.createdAt ?? new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await env.VAULTS.put(`vault:${body.token}`, JSON.stringify(vault));

        return jsonResponse({ ok: true });
      }

      // GET /vault?token=xxx - Get vault state (password always hidden)
      if (url.pathname === "/vault" && request.method === "GET") {
        const token = url.searchParams.get("token");
        if (!token) {
          return errorResponse("Missing token", 400);
        }

        const vaultData = await env.VAULTS.get(`vault:${token}`);
        if (!vaultData) {
          return errorResponse("Vault not found", 404);
        }

        const vault: Vault = JSON.parse(vaultData);
        const blockingState = getBlockingState(vault.sessions);
        const nextSession = blockingState.isBlocking
          ? null
          : getNextSession(vault.sessions);

        return jsonResponse({
          screenTimeAppleId: vault.screenTimeAppleId,
          sessions: vault.sessions,
          isBlocking: blockingState.isBlocking,
          activeUntil: blockingState.activeUntil?.toISOString() ?? null,
          timeRemaining: blockingState.timeRemaining,
          nextSession: nextSession
            ? {
                startsAt: nextSession.startsAt.toISOString(),
                day: nextSession.session.day,
                startHour: nextSession.session.startHour,
                startMinute: nextSession.session.startMinute,
              }
            : null,
        });
      }

      // GET /password?token=xxx - Get password (only if not blocking)
      if (url.pathname === "/password" && request.method === "GET") {
        const token = url.searchParams.get("token");
        if (!token) {
          return errorResponse("Missing token", 400);
        }

        const vaultData = await env.VAULTS.get(`vault:${token}`);
        if (!vaultData) {
          return errorResponse("Vault not found", 404);
        }

        const vault: Vault = JSON.parse(vaultData);
        const { isBlocking, activeUntil, timeRemaining } = getBlockingState(
          vault.sessions
        );

        if (isBlocking) {
          return jsonResponse(
            {
              error: "blocked",
              activeUntil: activeUntil?.toISOString(),
              timeRemaining,
            },
            403
          );
        }

        return jsonResponse({
          password: vault.screenTimePassword,
        });
      }

      // DELETE /vault?token=xxx - Delete vault (only if not blocking)
      if (url.pathname === "/vault" && request.method === "DELETE") {
        const token = url.searchParams.get("token");
        if (!token) {
          return errorResponse("Missing token", 400);
        }

        const vaultData = await env.VAULTS.get(`vault:${token}`);
        if (!vaultData) {
          return errorResponse("Vault not found", 404);
        }

        const vault: Vault = JSON.parse(vaultData);
        const { isBlocking } = getBlockingState(vault.sessions);

        if (isBlocking) {
          return errorResponse("Cannot delete vault during blocking", 403);
        }

        await env.VAULTS.delete(`vault:${vault.token}`);

        return jsonResponse({ ok: true });
      }

      // GET /status - Health check
      if (url.pathname === "/status" && request.method === "GET") {
        return jsonResponse({
          status: "ok",
          timestamp: new Date().toISOString(),
        });
      }

      return errorResponse("Not found", 404);
    } catch (error) {
      console.error("Error handling request:", error);
      return errorResponse("Internal server error", 500);
    }
  },
};
