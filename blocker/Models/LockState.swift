import Foundation

/// Lock state for PIN protection
struct LockState: Codable {
    var enabled: Bool
    var pinHash: String?        // SHA256 hash of the PIN
    var recoveryEmail: String?

    static let disabled = LockState(enabled: false, pinHash: nil, recoveryEmail: nil)

    /// Check if a PIN is set (hash exists)
    var hasPIN: Bool {
        pinHash != nil && !pinHash!.isEmpty
    }

    /// Minimum PIN length
    static let minPINLength = 4

    /// Maximum PIN length
    static let maxPINLength = 12

    /// Validate PIN format (digits only, correct length)
    static func isValidPIN(_ pin: String) -> Bool {
        guard pin.count >= minPINLength && pin.count <= maxPINLength else {
            return false
        }
        return pin.allSatisfy { $0.isNumber }
    }
}
