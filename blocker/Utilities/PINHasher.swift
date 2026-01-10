import Foundation
import CryptoKit

/// Utility for hashing and verifying PINs
enum PINHasher {

    /// Hash a PIN using SHA256
    /// - Parameter pin: The plain text PIN
    /// - Returns: Hex-encoded SHA256 hash
    static func hash(_ pin: String) -> String {
        let data = Data(pin.utf8)
        let digest = SHA256.hash(data: data)
        return digest.map { String(format: "%02x", $0) }.joined()
    }

    /// Verify a PIN against a stored hash
    /// - Parameters:
    ///   - pin: The plain text PIN to verify
    ///   - storedHash: The stored hash to compare against
    /// - Returns: True if the PIN matches the hash
    static func verify(_ pin: String, against storedHash: String) -> Bool {
        let inputHash = hash(pin)
        return inputHash == storedHash
    }
}
