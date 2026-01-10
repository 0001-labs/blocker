import Foundation

/// Represents a single domain entry in the allowed or restricted list
struct DomainEntry: Identifiable, Codable, Hashable {
    let id: UUID
    var host: String        // Normalized domain (e.g., "youtube.com")
    var title: String?      // Optional friendly name

    init(id: UUID = UUID(), host: String, title: String? = nil) {
        self.id = id
        self.host = host
        self.title = title
    }

    /// Display name: title if available, otherwise the host
    var displayName: String {
        title ?? host
    }
}
