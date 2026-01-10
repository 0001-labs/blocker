import Foundation

/// Scheduling mode for blocking sessions
enum ScheduleMode: String, Codable, CaseIterable {
    case calendarKeyword
    case manualTimer

    var displayName: String {
        switch self {
        case .calendarKeyword:
            return "Calendar keyword"
        case .manualTimer:
            return "Manual timer"
        }
    }
}

/// Fields to match when searching for calendar keyword
enum MatchingField: String, Codable, CaseIterable, Identifiable {
    case title
    case notes
    case location

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .title: return "Title"
        case .notes: return "Notes"
        case .location: return "Location"
        }
    }
}

/// Schedule configuration for blocking sessions
struct Schedule: Codable {
    var mode: ScheduleMode
    var keyword: String
    var calendarIdentifiers: [String]
    var matchingFields: Set<MatchingField>
    var manualEndDate: Date?

    static let `default` = Schedule(
        mode: .calendarKeyword,
        keyword: "blocker",
        calendarIdentifiers: [],
        matchingFields: [.title, .notes],
        manualEndDate: nil
    )

    /// Check if a string contains the keyword (case-insensitive)
    func containsKeyword(_ text: String?) -> Bool {
        guard let text = text, !keyword.isEmpty else { return false }
        return text.localizedCaseInsensitiveContains(keyword)
    }
}

/// Preset durations for manual timer
enum TimerPreset: CaseIterable, Identifiable {
    case twentyFive
    case sixty
    case ninety
    case twoHours

    var id: String { "\(minutes)" }

    var minutes: Int {
        switch self {
        case .twentyFive: return 25
        case .sixty: return 60
        case .ninety: return 90
        case .twoHours: return 120
        }
    }

    var displayName: String {
        switch self {
        case .twentyFive: return "25m"
        case .sixty: return "60m"
        case .ninety: return "90m"
        case .twoHours: return "2h"
        }
    }

    var duration: TimeInterval {
        TimeInterval(minutes * 60)
    }
}
