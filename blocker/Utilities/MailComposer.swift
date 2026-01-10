import Foundation
import AppKit

/// Utility for composing and sending recovery emails
enum MailComposer {

    /// Compose a recovery email with the PIN and session information
    /// - Parameters:
    ///   - pin: The plain text PIN (will be included in email body)
    ///   - email: The recipient email address
    ///   - nextSessionStart: Optional start time of the next scheduled session
    ///   - nextSessionEnd: Optional end time of the next scheduled session
    static func composeRecoveryEmail(
        pin: String,
        to email: String,
        nextSessionStart: Date? = nil,
        nextSessionEnd: Date? = nil
    ) {
        let subject = "blocker PIN"
        var body = """
        Your blocker PIN recovery information.

        PIN: \(pin)

        Date created: \(formatDate(Date()))
        """

        if let start = nextSessionStart, let end = nextSessionEnd {
            body += """


        Next scheduled session:
        Start: \(formatDate(start))
        End: \(formatDate(end))
        """
        }

        body += """


        ---
        Store this safely. There is no reset.
        """

        openMailComposer(to: email, subject: subject, body: body)
    }

    /// Open the default mail client with a composed email
    private static func openMailComposer(to email: String, subject: String, body: String) {
        guard let encodedSubject = subject.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let encodedBody = body.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) else {
            return
        }

        let urlString = "mailto:\(email)?subject=\(encodedSubject)&body=\(encodedBody)"

        guard let url = URL(string: urlString) else { return }

        NSWorkspace.shared.open(url)
    }

    /// Format a date for display
    private static func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
}
