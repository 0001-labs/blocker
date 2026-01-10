import Foundation

/// Protocol defining the interface for website blocking engines
protocol BlockingEngine {
    /// Activate blocking with the given rules
    func activate(rules: Rules) async throws

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
