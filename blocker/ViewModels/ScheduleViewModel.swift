import Foundation
import EventKit

/// ViewModel for the Schedule tab
@MainActor
final class ScheduleViewModel: ObservableObject {

    @Published var showingCreateEvent = false
    @Published var showingPINPrompt = false
    @Published var pendingTimerDuration: TimeInterval?
    @Published var customDurationMinutes: Int = 60

    // Create event form
    @Published var newEventTitle = ""
    @Published var newEventStartDate = Date()
    @Published var newEventDuration: TimeInterval = 3600 // 1 hour
    @Published var newEventCalendar: String = ""

    weak var appState: AppState?

    var calendarService: CalendarService? {
        appState?.calendarService
    }

    var scheduler: Scheduler? {
        appState?.scheduler
    }

    // MARK: - Calendar Access

    func requestCalendarAccess() async {
        _ = await calendarService?.requestAccess()
    }

    var hasCalendarAccess: Bool {
        guard let status = calendarService?.authorizationStatus else { return false }
        return status == .fullAccess || status == .authorized
    }

    // MARK: - Calendar Selection

    func isCalendarSelected(_ identifier: String) -> Bool {
        appState?.schedule.calendarIdentifiers.contains(identifier) ?? false
    }

    func toggleCalendar(_ identifier: String) {
        guard var schedule = appState?.schedule else { return }

        if schedule.calendarIdentifiers.contains(identifier) {
            schedule.calendarIdentifiers.removeAll { $0 == identifier }
        } else {
            schedule.calendarIdentifiers.append(identifier)
        }

        appState?.schedule = schedule
    }

    // MARK: - Matching Fields

    func isFieldSelected(_ field: MatchingField) -> Bool {
        appState?.schedule.matchingFields.contains(field) ?? false
    }

    func toggleField(_ field: MatchingField) {
        guard var schedule = appState?.schedule else { return }

        if schedule.matchingFields.contains(field) {
            schedule.matchingFields.remove(field)
        } else {
            schedule.matchingFields.insert(field)
        }

        appState?.schedule = schedule
    }

    // MARK: - Timer Control

    func startTimer(preset: TimerPreset) {
        startTimer(duration: preset.duration)
    }

    func startTimer(duration: TimeInterval) {
        guard let appState = appState else { return }

        // Check if PIN is required
        if appState.lockState.enabled && appState.lockState.hasPIN {
            pendingTimerDuration = duration
            showingPINPrompt = true
            return
        }

        _ = appState.startManualTimer(duration: duration)
    }

    func confirmTimerStart(pin: String) {
        guard let appState = appState,
              let duration = pendingTimerDuration else { return }

        if appState.verifyPIN(pin) {
            _ = appState.startManualTimer(duration: duration, pinVerified: true)
        }

        pendingTimerDuration = nil
        showingPINPrompt = false
    }

    func stopBlocking(pin: String? = nil) -> Bool {
        guard let appState = appState else { return false }

        if let pin = pin {
            if appState.verifyPIN(pin) {
                return appState.stopBlocking(pinVerified: true)
            }
            return false
        }

        return appState.stopBlocking()
    }

    // MARK: - Event Creation

    func prepareCreateEvent() {
        guard let appState = appState else { return }

        newEventTitle = "\(appState.schedule.keyword): "
        newEventStartDate = Date()
        newEventDuration = 3600
        newEventCalendar = appState.schedule.calendarIdentifiers.first ?? ""
        showingCreateEvent = true
    }

    func createEvent() async throws {
        guard let calendarService = calendarService else { return }

        let endDate = newEventStartDate.addingTimeInterval(newEventDuration)

        try await calendarService.createBlockerEvent(
            title: newEventTitle,
            startDate: newEventStartDate,
            endDate: endDate,
            calendarIdentifier: newEventCalendar
        )

        showingCreateEvent = false
    }

    // MARK: - Upcoming Events

    var upcomingEvents: [UpcomingEvent] {
        scheduler?.upcomingEvents() ?? []
    }
}
