import Foundation

/// Service for scheduling recovery emails via the Cloudflare Worker
actor RecoveryService {
    static let shared = RecoveryService()

    private let workerURL = "https://blocker.0001-labs.workers.dev"

    private init() {}

    struct ScheduleResponse: Decodable {
        let success: Bool
        let emailId: String?
        let scheduledFor: String?
        let error: String?
    }

    /// Schedule a recovery email to be sent at the specified time
    /// - Parameters:
    ///   - recipientEmail: Email address to send recovery password to
    ///   - password: The Screen Time Apple ID password
    ///   - sendAt: When to send the email
    /// - Returns: The scheduled email ID
    func scheduleRecoveryEmail(
        recipientEmail: String,
        password: String,
        sendAt: Date
    ) async throws -> String {
        let url = URL(string: "\(workerURL)/schedule")!

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body: [String: Any] = [
            "recipientEmail": recipientEmail,
            "password": password,
            "sendAtTimestamp": Int(sendAt.timeIntervalSince1970 * 1000)
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw RecoveryError.invalidResponse
        }

        guard httpResponse.statusCode == 200 else {
            if let errorResponse = try? JSONDecoder().decode(ScheduleResponse.self, from: data),
               let error = errorResponse.error {
                throw RecoveryError.serverError(error)
            }
            throw RecoveryError.httpError(httpResponse.statusCode)
        }

        let scheduleResponse = try JSONDecoder().decode(ScheduleResponse.self, from: data)

        guard let emailId = scheduleResponse.emailId else {
            throw RecoveryError.missingEmailId
        }

        return emailId
    }

    /// Cancel a previously scheduled recovery email
    /// - Parameter emailId: The ID returned from scheduleRecoveryEmail
    func cancelRecoveryEmail(emailId: String) async throws {
        let url = URL(string: "\(workerURL)/schedule/\(emailId)")!

        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"

        let (_, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw RecoveryError.cancelFailed
        }
    }

    /// Check worker status
    func checkStatus() async throws -> Bool {
        let url = URL(string: "\(workerURL)/status")!

        let (_, response) = try await URLSession.shared.data(from: url)

        guard let httpResponse = response as? HTTPURLResponse else {
            return false
        }

        return httpResponse.statusCode == 200
    }
}

enum RecoveryError: LocalizedError {
    case invalidResponse
    case httpError(Int)
    case serverError(String)
    case missingEmailId
    case cancelFailed

    var errorDescription: String? {
        switch self {
        case .invalidResponse:
            return "Invalid response from server"
        case .httpError(let code):
            return "Server returned error code \(code)"
        case .serverError(let message):
            return "Server error: \(message)"
        case .missingEmailId:
            return "Server did not return email ID"
        case .cancelFailed:
            return "Failed to cancel scheduled email"
        }
    }
}
