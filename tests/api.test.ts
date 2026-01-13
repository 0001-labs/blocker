import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

// Import after mocking
import {
  getToken,
  setToken,
  generateVaultToken,
} from "../js/api.js";

describe("Token Management", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("should return null when no token is set", () => {
    expect(getToken()).toBeNull();
  });

  it("should store and retrieve token", () => {
    setToken("test-token-123");
    expect(getToken()).toBe("test-token-123");
  });

  it("should overwrite existing token", () => {
    setToken("token-1");
    setToken("token-2");
    expect(getToken()).toBe("token-2");
  });
});

describe("Vault Token Generation", () => {
  it("should generate a 32-character token", () => {
    const token = generateVaultToken();
    expect(token).toHaveLength(32);
  });

  it("should only use lowercase letters and numbers", () => {
    const token = generateVaultToken();
    expect(token).toMatch(/^[a-z0-9]+$/);
  });

  it("should generate unique tokens", () => {
    const tokens = new Set<string>();
    for (let i = 0; i < 100; i++) {
      tokens.add(generateVaultToken());
    }
    // All tokens should be unique
    expect(tokens.size).toBe(100);
  });
});

describe("API Client - getVault", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    localStorageMock.clear();
    globalThis.fetch = mockFetch;
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return null when no token provided", async () => {
    const { getVault } = await import("../js/api.js");
    const result = await getVault(undefined);
    expect(result).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should call API with token", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          screenTimeAppleId: "test@icloud.com",
          sessions: [],
          isBlocking: false,
        }),
    });

    const { getVault } = await import("../js/api.js");
    const result = await getVault("test-token");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/vault?token=test-token")
    );
    expect(result).toEqual({
      screenTimeAppleId: "test@icloud.com",
      sessions: [],
      isBlocking: false,
    });
  });

  it("should return null for 404 response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { getVault } = await import("../js/api.js");
    const result = await getVault("nonexistent-token");
    expect(result).toBeNull();
  });
});

describe("API Client - saveCredentials", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    globalThis.fetch = mockFetch;
    mockFetch.mockReset();
  });

  it("should send credentials to API", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });

    const { saveCredentials } = await import("../js/api.js");
    await saveCredentials("test-token", {
      screenTimeAppleId: "test@icloud.com",
      screenTimePassword: "secret123",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/vault"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.stringContaining("screenTimeAppleId"),
      })
    );
  });

  it("should throw on API error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: () => Promise.resolve({ error: "Cannot modify during blocking" }),
    });

    const { saveCredentials } = await import("../js/api.js");
    await expect(
      saveCredentials("test-token", {
        screenTimeAppleId: "test@icloud.com",
      })
    ).rejects.toThrow("Cannot modify during blocking");
  });
});

describe("API Client - getPassword", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    localStorageMock.clear();
    globalThis.fetch = mockFetch;
    mockFetch.mockReset();
  });

  it("should return password when not blocking", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ password: "my-secret-password" }),
    });

    const { getPassword } = await import("../js/api.js");
    const result = await getPassword("test-token");

    expect(result).toEqual({
      blocked: false,
      password: "my-secret-password",
    });
  });

  it("should return blocked state when blocking", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: () =>
        Promise.resolve({
          error: "blocked",
          activeUntil: "2024-01-09T12:00:00Z",
          timeRemaining: "1:30:00",
        }),
    });

    const { getPassword } = await import("../js/api.js");
    const result = await getPassword("test-token");

    expect(result).toEqual({
      blocked: true,
      error: "blocked",
      activeUntil: "2024-01-09T12:00:00Z",
      timeRemaining: "1:30:00",
    });
  });

  it("should throw when no token provided", async () => {
    const { getPassword } = await import("../js/api.js");
    await expect(getPassword(undefined)).rejects.toThrow("No token");
  });
});

describe("API Client - syncScheduleToWorker", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    globalThis.fetch = mockFetch;
    mockFetch.mockReset();
  });

  it("should sync sessions to Worker", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });

    const { syncScheduleToWorker } = await import("../js/api.js");
    const sessions = [
      {
        id: "1",
        day: 1,
        startHour: 9,
        startMinute: 0,
        endHour: 12,
        endMinute: 0,
        recurring: true,
      },
    ];

    await syncScheduleToWorker("test-token", sessions);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/vault"),
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("sessions"),
      })
    );

    // Verify the body contains the sessions
    const callArgs = mockFetch.mock.calls[0];
    const body = JSON.parse(callArgs[1].body);
    expect(body.token).toBe("test-token");
    expect(body.sessions).toEqual(sessions);
  });
});
