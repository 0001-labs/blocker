import Foundation

/// Blocking mode determines how the domain lists are interpreted
enum BlockingMode: String, Codable, CaseIterable {
    case blocklist  // Block restricted domains, allow everything else
    case allowlist  // Allow only allowed domains, block everything else

    var description: String {
        switch self {
        case .blocklist:
            return "Block websites in the Restricted list. All other websites are allowed."
        case .allowlist:
            return "Allow only websites in the Allowed list. All other websites are blocked."
        }
    }
}

/// Contains the domain lists and blocking mode
struct Rules: Codable {
    var mode: BlockingMode
    var allowed: [DomainEntry]
    var restricted: [DomainEntry]

    static let empty = Rules(mode: .blocklist, allowed: [], restricted: [])

    /// Check if a domain exists in the allowed list
    func isInAllowed(_ host: String) -> Bool {
        allowed.contains { $0.host.lowercased() == host.lowercased() }
    }

    /// Check if a domain exists in the restricted list
    func isInRestricted(_ host: String) -> Bool {
        restricted.contains { $0.host.lowercased() == host.lowercased() }
    }

    /// Determine if a domain should be blocked based on current mode
    func shouldBlock(_ host: String) -> Bool {
        let normalizedHost = host.lowercased()
        switch mode {
        case .blocklist:
            return isInRestricted(normalizedHost)
        case .allowlist:
            return !isInAllowed(normalizedHost)
        }
    }
}
