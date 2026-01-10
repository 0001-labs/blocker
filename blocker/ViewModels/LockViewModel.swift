import Foundation

/// ViewModel for the Lock tab
@MainActor
final class LockViewModel: ObservableObject {

    @Published var showingSetPIN = false
    @Published var showingChangePIN = false

    // Set PIN form
    @Published var newPIN = ""
    @Published var confirmPIN = ""
    @Published var currentPIN = ""

    // Validation
    @Published var pinError: String?

    weak var appState: AppState?

    // MARK: - PIN Validation

    var isPINValid: Bool {
        LockState.isValidPIN(newPIN) && newPIN == confirmPIN
    }

    var pinMismatch: Bool {
        !confirmPIN.isEmpty && newPIN != confirmPIN
    }

    var pinTooShort: Bool {
        !newPIN.isEmpty && newPIN.count < LockState.minPINLength
    }

    var pinTooLong: Bool {
        newPIN.count > LockState.maxPINLength
    }

    var pinContainsNonDigits: Bool {
        !newPIN.isEmpty && !newPIN.allSatisfy { $0.isNumber }
    }

    // MARK: - Actions

    func startSetPIN() {
        resetForm()
        showingSetPIN = true
    }

    func startChangePIN() {
        resetForm()
        showingChangePIN = true
    }

    func resetForm() {
        newPIN = ""
        confirmPIN = ""
        currentPIN = ""
        pinError = nil
    }

    /// Set a new PIN
    func setPIN() -> Bool {
        guard isPINValid else {
            pinError = "Invalid PIN"
            return false
        }

        appState?.setPIN(newPIN)
        showingSetPIN = false
        resetForm()
        return true
    }

    /// Change the PIN (requires current PIN verification)
    func changePIN() -> Bool {
        guard let appState = appState else { return false }

        // Verify current PIN
        guard appState.verifyPIN(currentPIN) else {
            pinError = "Current PIN is incorrect"
            return false
        }

        // Validate new PIN
        guard isPINValid else {
            pinError = "Invalid new PIN"
            return false
        }

        appState.setPIN(newPIN)
        showingChangePIN = false
        resetForm()
        return true
    }

    /// Disable PIN lock
    func disableLock() {
        appState?.clearPIN()
    }

    /// Compose recovery email
    func composeRecoveryEmail(pin: String) {
        guard let appState = appState,
              let email = appState.lockState.recoveryEmail,
              !email.isEmpty else {
            return
        }

        // Get next scheduled session if available
        let events = appState.scheduler.upcomingEvents(days: 7)
        let nextEvent = events.first

        MailComposer.composeRecoveryEmail(
            pin: pin,
            to: email,
            nextSessionStart: nextEvent?.startDate,
            nextSessionEnd: nextEvent?.endDate
        )
    }
}
