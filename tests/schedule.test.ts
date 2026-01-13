import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

interface BlockSession {
  id: string;
  day: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  recurring: boolean;
}

// Helper functions from Worker - replicated here for testing
function getBlockingState(sessions: BlockSession[]) {
  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const session of sessions) {
    // For recurring sessions, check if it matches today
    // For non-recurring, check exact day match
    const matchesDay = session.recurring
      ? session.day === currentDay
      : session.day === currentDay;

    if (!matchesDay) continue;

    const startMinutes = session.startHour * 60 + session.startMinute;
    const endMinutes = session.endHour * 60 + session.endMinute;

    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
      const activeUntil = new Date(now);
      activeUntil.setHours(session.endHour, session.endMinute, 0, 0);

      return {
        isBlocking: true,
        activeSession: session,
        activeUntil,
      };
    }
  }

  return {
    isBlocking: false,
    activeSession: null,
    activeUntil: null,
  };
}

function getNextSession(sessions: BlockSession[]) {
  if (sessions.length === 0) return null;

  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let closestSession: BlockSession | null = null;
  let closestDate: Date | null = null;

  for (const session of sessions) {
    // Only consider recurring sessions for "next session"
    if (!session.recurring) continue;

    const startMinutes = session.startHour * 60 + session.startMinute;

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

describe("Schedule Blocking Logic", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should detect active blocking session", () => {
    // Set time to Tuesday 10:30 AM
    vi.setSystemTime(new Date("2024-01-09T10:30:00"));

    const sessions: BlockSession[] = [
      {
        id: "1",
        day: 2, // Tuesday
        startHour: 9,
        startMinute: 0,
        endHour: 12,
        endMinute: 0,
        recurring: true,
      },
    ];

    const result = getBlockingState(sessions);
    expect(result.isBlocking).toBe(true);
    expect(result.activeSession?.id).toBe("1");
  });

  it("should not block outside session time", () => {
    // Set time to Tuesday 14:30 PM (after blocking ends)
    vi.setSystemTime(new Date("2024-01-09T14:30:00"));

    const sessions: BlockSession[] = [
      {
        id: "1",
        day: 2, // Tuesday
        startHour: 9,
        startMinute: 0,
        endHour: 12,
        endMinute: 0,
        recurring: true,
      },
    ];

    const result = getBlockingState(sessions);
    expect(result.isBlocking).toBe(false);
    expect(result.activeSession).toBeNull();
  });

  it("should not block on different day", () => {
    // Set time to Monday 10:30 AM
    vi.setSystemTime(new Date("2024-01-08T10:30:00"));

    const sessions: BlockSession[] = [
      {
        id: "1",
        day: 2, // Tuesday
        startHour: 9,
        startMinute: 0,
        endHour: 12,
        endMinute: 0,
        recurring: true,
      },
    ];

    const result = getBlockingState(sessions);
    expect(result.isBlocking).toBe(false);
  });

  it("should calculate activeUntil correctly", () => {
    // Set time to Tuesday 10:30 AM
    vi.setSystemTime(new Date("2024-01-09T10:30:00"));

    const sessions: BlockSession[] = [
      {
        id: "1",
        day: 2,
        startHour: 9,
        startMinute: 0,
        endHour: 12,
        endMinute: 30,
        recurring: true,
      },
    ];

    const result = getBlockingState(sessions);
    expect(result.isBlocking).toBe(true);
    expect(result.activeUntil?.getHours()).toBe(12);
    expect(result.activeUntil?.getMinutes()).toBe(30);
  });

  it("should handle multiple sessions", () => {
    // Set time to Tuesday 15:30 PM
    vi.setSystemTime(new Date("2024-01-09T15:30:00"));

    const sessions: BlockSession[] = [
      {
        id: "morning",
        day: 2,
        startHour: 9,
        startMinute: 0,
        endHour: 12,
        endMinute: 0,
        recurring: true,
      },
      {
        id: "afternoon",
        day: 2,
        startHour: 14,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
        recurring: true,
      },
    ];

    const result = getBlockingState(sessions);
    expect(result.isBlocking).toBe(true);
    expect(result.activeSession?.id).toBe("afternoon");
  });

  it("should handle edge case at session start", () => {
    // Set time to exactly 9:00 AM
    vi.setSystemTime(new Date("2024-01-09T09:00:00"));

    const sessions: BlockSession[] = [
      {
        id: "1",
        day: 2,
        startHour: 9,
        startMinute: 0,
        endHour: 12,
        endMinute: 0,
        recurring: true,
      },
    ];

    const result = getBlockingState(sessions);
    expect(result.isBlocking).toBe(true);
  });

  it("should handle edge case at session end", () => {
    // Set time to exactly 12:00 PM (should NOT be blocking)
    vi.setSystemTime(new Date("2024-01-09T12:00:00"));

    const sessions: BlockSession[] = [
      {
        id: "1",
        day: 2,
        startHour: 9,
        startMinute: 0,
        endHour: 12,
        endMinute: 0,
        recurring: true,
      },
    ];

    const result = getBlockingState(sessions);
    expect(result.isBlocking).toBe(false);
  });
});

describe("Next Session Calculation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should find next session later today", () => {
    // Monday 8:00 AM
    vi.setSystemTime(new Date("2024-01-08T08:00:00"));

    const sessions: BlockSession[] = [
      {
        id: "1",
        day: 1, // Monday
        startHour: 10,
        startMinute: 0,
        endHour: 12,
        endMinute: 0,
        recurring: true,
      },
    ];

    const result = getNextSession(sessions);
    expect(result).not.toBeNull();
    expect(result?.startsAt.getHours()).toBe(10);
  });

  it("should find next session on different day", () => {
    // Monday 14:00 PM (after Monday session)
    vi.setSystemTime(new Date("2024-01-08T14:00:00"));

    const sessions: BlockSession[] = [
      {
        id: "1",
        day: 1, // Monday
        startHour: 10,
        startMinute: 0,
        endHour: 12,
        endMinute: 0,
        recurring: true,
      },
    ];

    const result = getNextSession(sessions);
    expect(result).not.toBeNull();
    // Should be next Monday
    expect(result?.startsAt.getDate()).toBe(15);
  });

  it("should return null for empty sessions", () => {
    vi.setSystemTime(new Date("2024-01-08T10:00:00"));
    const result = getNextSession([]);
    expect(result).toBeNull();
  });

  it("should ignore non-recurring sessions", () => {
    vi.setSystemTime(new Date("2024-01-08T08:00:00"));

    const sessions: BlockSession[] = [
      {
        id: "1",
        day: 1,
        startHour: 10,
        startMinute: 0,
        endHour: 12,
        endMinute: 0,
        recurring: false, // One-time session
      },
    ];

    const result = getNextSession(sessions);
    expect(result).toBeNull();
  });
});

describe("Recurring vs One-time Sessions", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should block on recurring session matching today", () => {
    // Tuesday 10:30 AM
    vi.setSystemTime(new Date("2024-01-09T10:30:00"));

    const sessions: BlockSession[] = [
      {
        id: "1",
        day: 2,
        startHour: 9,
        startMinute: 0,
        endHour: 12,
        endMinute: 0,
        recurring: true,
      },
    ];

    const result = getBlockingState(sessions);
    expect(result.isBlocking).toBe(true);
  });

  it("should block on one-time session matching today", () => {
    // Tuesday 10:30 AM
    vi.setSystemTime(new Date("2024-01-09T10:30:00"));

    const sessions: BlockSession[] = [
      {
        id: "1",
        day: 2,
        startHour: 9,
        startMinute: 0,
        endHour: 12,
        endMinute: 0,
        recurring: false,
      },
    ];

    const result = getBlockingState(sessions);
    expect(result.isBlocking).toBe(true);
  });
});
