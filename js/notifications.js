/**
 * Web notifications for Blocker
 */

let notificationPermission = Notification.permission;
let scheduledNotifications = [];

export function isSupported() {
  return "Notification" in window;
}

export function getPermission() {
  return notificationPermission;
}

export async function requestPermission() {
  if (!isSupported()) return "denied";

  const permission = await Notification.requestPermission();
  notificationPermission = permission;
  return permission;
}

export function showNotification(title, options = {}) {
  if (notificationPermission !== "granted") return null;

  return new Notification(title, {
    icon: "/icon.png",
    badge: "/icon.png",
    ...options,
  });
}

export function scheduleNotification(id, title, body, triggerAt) {
  // Cancel existing notification with same ID
  cancelNotification(id);

  const now = Date.now();
  const delay = triggerAt - now;

  if (delay <= 0) {
    // Already past, show immediately
    showNotification(title, { body });
    return;
  }

  const timeoutId = setTimeout(() => {
    showNotification(title, { body });
    // Remove from scheduled list
    scheduledNotifications = scheduledNotifications.filter((n) => n.id !== id);
  }, delay);

  scheduledNotifications.push({ id, timeoutId, triggerAt });
}

export function cancelNotification(id) {
  const existing = scheduledNotifications.find((n) => n.id === id);
  if (existing) {
    clearTimeout(existing.timeoutId);
    scheduledNotifications = scheduledNotifications.filter((n) => n.id !== id);
  }
}

export function cancelAllNotifications() {
  for (const notification of scheduledNotifications) {
    clearTimeout(notification.timeoutId);
  }
  scheduledNotifications = [];
}

/**
 * Schedule notifications for blocking sessions
 */
export function scheduleBlockingNotifications(sessions) {
  cancelAllNotifications();

  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const session of sessions) {
    const startMinutes = session.startHour * 60 + session.startMinute;
    const endMinutes = session.endHour * 60 + session.endMinute;

    // Calculate days until session start
    let daysUntilStart = session.day - currentDay;
    if (
      daysUntilStart < 0 ||
      (daysUntilStart === 0 && startMinutes <= currentMinutes)
    ) {
      daysUntilStart += 7;
    }

    // Schedule start notification
    const startTime = new Date(now);
    startTime.setDate(startTime.getDate() + daysUntilStart);
    startTime.setHours(session.startHour, session.startMinute, 0, 0);

    scheduleNotification(
      `start-${session.id}`,
      "Blocking started",
      "Time to set up Screen Time. Mash random keys for the PIN!",
      startTime.getTime()
    );

    // Schedule end notification
    let daysUntilEnd = session.day - currentDay;
    if (
      daysUntilEnd < 0 ||
      (daysUntilEnd === 0 && endMinutes <= currentMinutes)
    ) {
      daysUntilEnd += 7;
    }

    const endTime = new Date(now);
    endTime.setDate(endTime.getDate() + daysUntilEnd);
    endTime.setHours(session.endHour, session.endMinute, 0, 0);

    scheduleNotification(
      `end-${session.id}`,
      "Blocking ended",
      "Your recovery password is now available.",
      endTime.getTime()
    );
  }
}
