import Foundation
import UserNotifications
import AppKit

/// Service for managing local notifications
actor NotificationService {
    static let shared = NotificationService()

    private init() {}

    /// Request notification permissions
    func requestPermission() async -> Bool {
        let center = UNUserNotificationCenter.current()

        do {
            let granted = try await center.requestAuthorization(options: [.alert, .sound, .badge])
            return granted
        } catch {
            print("Failed to request notification permission: \(error)")
            return false
        }
    }

    /// Send notification that blocking session is starting
    func sendBlockingStartNotification(sessionName: String, endTime: Date) async {
        let center = UNUserNotificationCenter.current()

        // Check permission
        let settings = await center.notificationSettings()
        guard settings.authorizationStatus == .authorized else {
            print("Notifications not authorized")
            return
        }

        let content = UNMutableNotificationContent()
        content.title = "Blocking Session Starting"
        content.body = "Time to set up Screen Time. Mash random keys for the PIN!"
        content.sound = .default
        content.categoryIdentifier = "BLOCKING_START"

        // Add action buttons
        let setupAction = UNNotificationAction(
            identifier: "OPEN_SCREEN_TIME",
            title: "Open Screen Time",
            options: .foreground
        )

        let dismissAction = UNNotificationAction(
            identifier: "DISMISS",
            title: "Dismiss",
            options: []
        )

        let category = UNNotificationCategory(
            identifier: "BLOCKING_START",
            actions: [setupAction, dismissAction],
            intentIdentifiers: [],
            options: []
        )

        center.setNotificationCategories([category])

        // Create request (immediate delivery)
        let request = UNNotificationRequest(
            identifier: "blocking-start-\(UUID().uuidString)",
            content: content,
            trigger: nil // Deliver immediately
        )

        do {
            try await center.add(request)
            print("Blocking start notification sent")
        } catch {
            print("Failed to send notification: \(error)")
        }
    }

    /// Send notification that blocking session is ending soon
    func sendBlockingEndingSoonNotification(minutesRemaining: Int) async {
        let center = UNUserNotificationCenter.current()

        let settings = await center.notificationSettings()
        guard settings.authorizationStatus == .authorized else { return }

        let content = UNMutableNotificationContent()
        content.title = "Blocking Ending Soon"
        content.body = "\(minutesRemaining) minutes remaining. Recovery email will be sent when session ends."
        content.sound = .default

        let request = UNNotificationRequest(
            identifier: "blocking-ending-\(UUID().uuidString)",
            content: content,
            trigger: nil
        )

        try? await center.add(request)
    }

    /// Send notification that blocking session has ended
    func sendBlockingEndedNotification() async {
        let center = UNUserNotificationCenter.current()

        let settings = await center.notificationSettings()
        guard settings.authorizationStatus == .authorized else { return }

        let content = UNMutableNotificationContent()
        content.title = "Blocking Session Ended"
        content.body = "Check your email for the recovery password. Remember to DELETE the email after use!"
        content.sound = .default
        content.categoryIdentifier = "BLOCKING_END"

        // Add reminder action
        let deleteReminderAction = UNNotificationAction(
            identifier: "DELETE_REMINDER",
            title: "I deleted the email",
            options: []
        )

        let category = UNNotificationCategory(
            identifier: "BLOCKING_END",
            actions: [deleteReminderAction],
            intentIdentifiers: [],
            options: []
        )

        center.setNotificationCategories([category])

        let request = UNNotificationRequest(
            identifier: "blocking-end-\(UUID().uuidString)",
            content: content,
            trigger: nil
        )

        try? await center.add(request)
    }

    /// Open System Settings > Screen Time
    @MainActor
    func openScreenTimeSettings() {
        if let url = URL(string: "x-apple.systempreferences:com.apple.preference.screentime") {
            NSWorkspace.shared.open(url)
        }
    }
}
