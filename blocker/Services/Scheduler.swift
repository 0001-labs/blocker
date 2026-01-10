import Foundation
import Combine

/// Service for evaluating and managing blocking schedules
@MainActor
final class Scheduler: ObservableObject {

    private var timer: Timer?
    private var cancellables = Set<AnyCancellable>()

    let calendarService: CalendarService
    let runtimeState: RuntimeState

    @Published var schedule: Schedule = .default

    init(calendarService: CalendarService, runtimeState: RuntimeState) {
        self.calendarService = calendarService
        self.runtimeState = runtimeState
    }

    /// Start the scheduler
    func start() {
        // Evaluate immediately
        evaluate()

        // Set up timer to evaluate every 60 seconds
        timer = Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { [weak self] _ in
            Task { @MainActor in
                self?.evaluate()
            }
        }
    }

    /// Stop the scheduler
    func stop() {
        timer?.invalidate()
        timer = nil
    }

    /// Evaluate the current schedule state
    func evaluate() {
        // Check if manual timer has expired
        runtimeState.checkExpiration()

        // If manual timer is active, don't override with calendar
        if runtimeState.isBlockingActive,
           case .manualTimer = runtimeState.activeReason {
            return
        }

        // Check calendar events
        if schedule.mode == .calendarKeyword {
            evaluateCalendarSchedule()
        }
    }

    /// Evaluate calendar-based scheduling
    private func evaluateCalendarSchedule() {
        let result = calendarService.isWithinKeywordEvent(
            keyword: schedule.keyword,
            in: schedule.calendarIdentifiers,
            matchingFields: schedule.matchingFields
        )

        if result.active, let event = result.event, let endDate = result.endDate {
            // Activate blocking
            runtimeState.activate(
                reason: .calendarEvent(title: event.title ?? "Scheduled event"),
                until: endDate
            )
        } else if case .calendarEvent = runtimeState.activeReason {
            // Deactivate if was calendar-based and no longer active
            runtimeState.deactivate()
        }
    }

    /// Start a manual timer
    func startManualTimer(duration: TimeInterval) {
        let endDate = Date().addingTimeInterval(duration)
        runtimeState.activate(reason: .manualTimer, until: endDate)
        schedule.manualEndDate = endDate
    }

    /// Stop blocking (requires PIN verification if locked)
    func stopBlocking() {
        runtimeState.deactivate()
        schedule.manualEndDate = nil
    }

    /// Get upcoming keyword events
    func upcomingEvents(days: Int = 7) -> [UpcomingEvent] {
        let events = calendarService.findKeywordEvents(
            keyword: schedule.keyword,
            in: schedule.calendarIdentifiers,
            matchingFields: schedule.matchingFields,
            days: days
        )

        return events.map { event in
            UpcomingEvent(
                id: event.eventIdentifier ?? UUID().uuidString,
                title: event.title ?? "Untitled",
                startDate: event.startDate,
                endDate: event.endDate,
                calendarName: event.calendar?.title ?? "Unknown"
            )
        }
    }
}

/// Simplified event representation for UI
struct UpcomingEvent: Identifiable {
    let id: String
    let title: String
    let startDate: Date
    let endDate: Date
    let calendarName: String

    var isActive: Bool {
        let now = Date()
        return startDate <= now && endDate > now
    }

    var formattedDateRange: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        formatter.timeStyle = .short

        let start = formatter.string(from: startDate)
        formatter.dateStyle = .none
        let end = formatter.string(from: endDate)

        return "\(start) – \(end)"
    }
}
