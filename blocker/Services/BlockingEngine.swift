import Foundation

/// Protocol defining the interface for blocking engines
/// The actual blocking rules are configured in macOS Screen Time settings
protocol BlockingEngine {
    /// Activate blocking (triggers Screen Time restrictions)
    func activate() async throws

    /// Deactivate blocking
    func deactivate() async throws

    /// Whether blocking is currently active
    var isActive: Bool { get }
}

/// Errors that can occur during blocking operations
enum BlockingEngineError: LocalizedError {
    case activationFailed(String)
    case deactivationFailed(String)
    case notSupported

    var errorDescription: String? {
        switch self {
        case .activationFailed(let reason):
            return "Failed to activate blocking: \(reason)"
        case .deactivationFailed(let reason):
            return "Failed to deactivate blocking: \(reason)"
        case .notSupported:
            return "Blocking is not supported on this system"
        }
    }
}
