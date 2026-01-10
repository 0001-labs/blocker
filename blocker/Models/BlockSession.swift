import Foundation

/// A scheduled blocking session
struct BlockSession: Identifiable, Codable, Equatable {
    let id: UUID
    var dayOfWeek: Int // 1 = Sunday, 2 = Monday, ... 7 = Saturday
    var startHour: Int // 0-23
    var startMinute: Int // 0-59
    var endHour: Int // 0-23
    var endMinute: Int // 0-59

    init(id: UUID = UUID(), dayOfWeek: Int, startHour: Int, startMinute: Int = 0, endHour: Int, endMinute: Int = 0) {
        self.id = id
        self.dayOfWeek = dayOfWeek
        self.startHour = startHour
        self.startMinute = startMinute
        self.endHour = endHour
        self.endMinute = endMinute
    }

    /// Start time as minutes from midnight
    var startMinutes: Int {
        startHour * 60 + startMinute
    }

    /// End time as minutes from midnight
    var endMinutes: Int {
        endHour * 60 + endMinute
    }

    /// Duration in minutes
    var duration: Int {
        endMinutes - startMinutes
    }

    /// Check if a given time falls within this session
    func contains(hour: Int, minute: Int = 0) -> Bool {
        let time = hour * 60 + minute
        return time >= startMinutes && time < endMinutes
    }

    /// Check if this session is currently active
    func isActiveNow() -> Bool {
        let calendar = Calendar.current
        let now = Date()
        let currentDayOfWeek = calendar.component(.weekday, from: now)
        let currentHour = calendar.component(.hour, from: now)
        let currentMinute = calendar.component(.minute, from: now)

        guard currentDayOfWeek == dayOfWeek else { return false }
        return contains(hour: currentHour, minute: currentMinute)
    }

    /// Get the next occurrence of this session
    func nextOccurrence(after date: Date = Date()) -> Date? {
        let calendar = Calendar.current
        var components = calendar.dateComponents([.yearForWeekOfYear, .weekOfYear], from: date)
        components.weekday = dayOfWeek
        components.hour = startHour
        components.minute = startMinute

        guard var sessionDate = calendar.date(from: components) else { return nil }

        // If the session is in the past this week, get next week's
        if sessionDate <= date {
            sessionDate = calendar.date(byAdding: .weekOfYear, value: 1, to: sessionDate) ?? sessionDate
        }

        return sessionDate
    }

    /// Formatted time range string
    var formattedTimeRange: String {
        let startFormatted = String(format: "%02d:%02d", startHour, startMinute)
        let endFormatted = String(format: "%02d:%02d", endHour, endMinute)
        return "\(startFormatted) – \(endFormatted)"
    }

    /// Day name
    var dayName: String {
        let formatter = DateFormatter()
        formatter.locale = Locale.current
        return formatter.weekdaySymbols[dayOfWeek - 1]
    }

    /// Short day name
    var shortDayName: String {
        let formatter = DateFormatter()
        formatter.locale = Locale.current
        return formatter.shortWeekdaySymbols[dayOfWeek - 1]
    }

    /// Check if this session overlaps with another session
    func overlaps(with other: BlockSession) -> Bool {
        // Must be same day to overlap
        guard dayOfWeek == other.dayOfWeek else { return false }

        // Check if time ranges overlap
        // Two ranges [a, b) and [c, d) overlap if a < d AND c < b
        return startMinutes < other.endMinutes && other.startMinutes < endMinutes
    }
}

/// Collection of block sessions with persistence
struct BlockSchedule: Codable {
    var sessions: [BlockSession]

    static let empty = BlockSchedule(sessions: [])

    /// Check if any session is currently active
    func hasActiveSession() -> Bool {
        sessions.contains { $0.isActiveNow() }
    }

    /// Get the currently active session, if any
    func activeSession() -> BlockSession? {
        sessions.first { $0.isActiveNow() }
    }

    /// Get end date of current active session
    func activeSessionEndDate() -> Date? {
        guard let session = activeSession() else { return nil }
        let calendar = Calendar.current
        let now = Date()
        var components = calendar.dateComponents([.year, .month, .day], from: now)
        components.hour = session.endHour
        components.minute = session.endMinute
        return calendar.date(from: components)
    }

    /// Check if a session would overlap with existing sessions
    func hasOverlap(with session: BlockSession) -> Bool {
        sessions.contains { $0.overlaps(with: session) }
    }

    /// Add a new session (only if it doesn't overlap)
    /// Returns true if added, false if rejected due to overlap
    @discardableResult
    mutating func add(_ session: BlockSession) -> Bool {
        guard !hasOverlap(with: session) else { return false }
        sessions.append(session)
        return true
    }

    /// Remove a session by ID
    mutating func remove(id: UUID) {
        sessions.removeAll { $0.id == id }
    }

    /// Get sessions for a specific day
    func sessions(for dayOfWeek: Int) -> [BlockSession] {
        sessions.filter { $0.dayOfWeek == dayOfWeek }
    }
}
