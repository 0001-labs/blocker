import Foundation

/// Recovery settings for Screen Time bypass prevention
struct LockState: Codable {
    /// Email address where recovery credentials will be sent (user's regular email)
    var recoveryEmail: String?

    /// Apple ID email for the dedicated Screen Time account
    var screenTimeAppleId: String?

    /// Password for the dedicated Screen Time Apple ID
    var screenTimePassword: String?

    /// ID of the currently scheduled recovery email (if blocking is active)
    var scheduledEmailId: String?

    static let empty = LockState(
        recoveryEmail: nil,
        screenTimeAppleId: nil,
        screenTimePassword: nil,
        scheduledEmailId: nil
    )

    /// Check if recovery is fully configured
    var isConfigured: Bool {
        guard let email = recoveryEmail, !email.isEmpty,
              let appleId = screenTimeAppleId, !appleId.isEmpty,
              let password = screenTimePassword, !password.isEmpty else {
            return false
        }
        return isValidEmail(email) && isValidEmail(appleId)
    }

    /// Validate email format
    private func isValidEmail(_ email: String) -> Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }
}
