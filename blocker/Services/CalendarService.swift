import Foundation
import EventKit

/// Service for interacting with calendars via EventKit
@MainActor
final class CalendarService: ObservableObject {

    private let eventStore = EKEventStore()

    @Published var authorizationStatus: EKAuthorizationStatus = .notDetermined
    @Published var availableCalendars: [EKCalendar] = []

    init() {
        updateAuthorizationStatus()
    }

    /// Update the current authorization status
    func updateAuthorizationStatus() {
        if #available(macOS 14.0, *) {
            authorizationStatus = EKEventStore.authorizationStatus(for: .event)
        } else {
            authorizationStatus = EKEventStore.authorizationStatus(for: .event)
        }

        if authorizationStatus == .fullAccess || authorizationStatus == .authorized {
            loadCalendars()
        }
    }

    /// Request calendar access
    func requestAccess() async -> Bool {
        do {
            if #available(macOS 14.0, *) {
                let granted = try await eventStore.requestFullAccessToEvents()
                await MainActor.run {
                    updateAuthorizationStatus()
                }
                return granted
            } else {
                let granted = try await eventStore.requestAccess(to: .event)
                await MainActor.run {
                    updateAuthorizationStatus()
                }
                return granted
            }
        } catch {
            print("Calendar access request failed: \(error)")
            return false
        }
    }

    /// Load available calendars
    private func loadCalendars() {
        availableCalendars = eventStore.calendars(for: .event)
    }

    /// Find events containing the keyword in the next N days
    func findKeywordEvents(
        keyword: String,
        in calendarIdentifiers: [String],
        matchingFields: Set<MatchingField>,
        days: Int = 7
    ) -> [EKEvent] {
        guard authorizationStatus == .fullAccess || authorizationStatus == .authorized else {
            return []
        }

        let calendars = availableCalendars.filter { calendarIdentifiers.contains($0.calendarIdentifier) }
        guard !calendars.isEmpty else { return [] }

        let startDate = Date()
        let endDate = Calendar.current.date(byAdding: .day, value: days, to: startDate) ?? startDate

        let predicate = eventStore.predicateForEvents(
            withStart: startDate,
            end: endDate,
            calendars: calendars
        )

        let events = eventStore.events(matching: predicate)

        return events.filter { event in
            matchesKeyword(event: event, keyword: keyword, fields: matchingFields)
        }.sorted { $0.startDate < $1.startDate }
    }

    /// Check if an event matches the keyword in specified fields
    private func matchesKeyword(event: EKEvent, keyword: String, fields: Set<MatchingField>) -> Bool {
        for field in fields {
            switch field {
            case .title:
                if event.title?.localizedCaseInsensitiveContains(keyword) == true {
                    return true
                }
            case .notes:
                if event.notes?.localizedCaseInsensitiveContains(keyword) == true {
                    return true
                }
            case .location:
                if event.location?.localizedCaseInsensitiveContains(keyword) == true {
                    return true
                }
            }
        }
        return false
    }

    /// Check if currently within any keyword event
    func isWithinKeywordEvent(
        keyword: String,
        in calendarIdentifiers: [String],
        matchingFields: Set<MatchingField>
    ) -> (active: Bool, event: EKEvent?, endDate: Date?) {
        let now = Date()
        let events = findKeywordEvents(
            keyword: keyword,
            in: calendarIdentifiers,
            matchingFields: matchingFields,
            days: 1
        )

        // Find events that are currently active
        let activeEvents = events.filter { event in
            event.startDate <= now && event.endDate > now
        }

        guard !activeEvents.isEmpty else {
            return (false, nil, nil)
        }

        // Find the latest end date among overlapping events
        let latestEnd = activeEvents.map { $0.endDate }.max()

        return (true, activeEvents.first, latestEnd)
    }

    /// Create a new blocker event
    func createBlockerEvent(
        title: String,
        startDate: Date,
        endDate: Date,
        calendarIdentifier: String
    ) async throws {
        guard let calendar = availableCalendars.first(where: { $0.calendarIdentifier == calendarIdentifier }) else {
            throw CalendarError.calendarNotFound
        }

        let event = EKEvent(eventStore: eventStore)
        event.title = title
        event.startDate = startDate
        event.endDate = endDate
        event.calendar = calendar

        try eventStore.save(event, span: .thisEvent)
    }

    enum CalendarError: LocalizedError {
        case calendarNotFound
        case saveFailed

        var errorDescription: String? {
            switch self {
            case .calendarNotFound:
                return "Calendar not found"
            case .saveFailed:
                return "Failed to save event"
            }
        }
    }
}
