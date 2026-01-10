import Foundation
import Combine

/// Reason why blocking is currently active
enum BlockingReason: Equatable {
    case calendarEvent(title: String)
    case manualTimer

    var displayDescription: String {
        switch self {
        case .calendarEvent(let title):
            return "Calendar: \(title)"
        case .manualTimer:
            return "Manual timer"
        }
    }
}

/// Observable runtime state for the application
@MainActor
final class RuntimeState: ObservableObject {
    @Published var isBlockingActive: Bool = false
    @Published var activeReason: BlockingReason?
    @Published var activeUntil: Date?

    /// Formatted time remaining
    var timeRemaining: String? {
        guard let until = activeUntil else { return nil }
        let remaining = until.timeIntervalSinceNow
        guard remaining > 0 else { return nil }

        let hours = Int(remaining) / 3600
        let minutes = (Int(remaining) % 3600) / 60
        let seconds = Int(remaining) % 60

        if hours > 0 {
            return String(format: "%d:%02d:%02d", hours, minutes, seconds)
        } else {
            return String(format: "%d:%02d", minutes, seconds)
        }
    }

    /// Activate blocking with a reason and end time
    func activate(reason: BlockingReason, until: Date) {
        isBlockingActive = true
        activeReason = reason
        activeUntil = until
    }

    /// Deactivate blocking
    func deactivate() {
        isBlockingActive = false
        activeReason = nil
        activeUntil = nil
    }

    /// Check if blocking should still be active
    func checkExpiration() {
        guard let until = activeUntil else { return }
        if Date() >= until {
            deactivate()
        }
    }
}
