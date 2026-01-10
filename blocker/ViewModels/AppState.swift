import Foundation
import Combine

/// Main application state coordinator
@MainActor
final class AppState: ObservableObject {

    // MARK: - Services

    let persistence = PersistenceService()
    let blockingEngine = StubBlockingEngine()
    let runtimeState = RuntimeState()

    lazy var scheduler: Scheduler = {
        Scheduler(runtimeState: runtimeState)
    }()

    // MARK: - State

    @Published var schedule: Schedule
    @Published var lockState: LockState

    private var cancellables = Set<AnyCancellable>()

    // MARK: - Initialization

    init() {
        // Load persisted state
        self.schedule = persistence.loadSchedule()
        self.lockState = persistence.loadLockState()

        setupBindings()
        scheduler.schedule = schedule
        scheduler.start()

        // Request notification permission
        Task {
            _ = await NotificationService.shared.requestPermission()
        }
    }

    deinit {
        // Timer uses weak self, so no explicit cleanup needed
        // Scheduler will be deallocated with AppState
    }

    // MARK: - Setup

    private func setupBindings() {
        // Auto-save schedule changes
        $schedule
            .dropFirst()
            .debounce(for: .seconds(0.5), scheduler: RunLoop.main)
            .sink { [weak self] schedule in
                self?.persistence.saveSchedule(schedule)
                self?.scheduler.schedule = schedule
            }
            .store(in: &cancellables)

        // Auto-save lock state changes
        $lockState
            .dropFirst()
            .debounce(for: .seconds(0.5), scheduler: RunLoop.main)
            .sink { [weak self] lockState in
                self?.persistence.saveLockState(lockState)
            }
            .store(in: &cancellables)

        // Sync blocking engine, notifications, and recovery emails with runtime state
        // Note: Blocking rules are configured in macOS Screen Time settings
        runtimeState.$isBlockingActive
            .removeDuplicates()
            .sink { [weak self] isActive in
                guard let self = self else { return }
                Task {
                    if isActive {
                        try? await self.blockingEngine.activate()

                        // Send notification to set up Screen Time
                        if let endDate = self.runtimeState.activeUntil,
                           let reason = self.runtimeState.activeReason {
                            await NotificationService.shared.sendBlockingStartNotification(
                                sessionName: reason.displayDescription,
                                endTime: endDate
                            )
                            // Schedule recovery email for when session ends
                            try? await self.scheduleRecoveryEmail(sendAt: endDate)
                        }
                    } else {
                        try? await self.blockingEngine.deactivate()

                        // Send notification that blocking ended
                        await NotificationService.shared.sendBlockingEndedNotification()

                        // Clear scheduled email ID (it either sent or was cancelled)
                        self.lockState.scheduledEmailId = nil
                    }
                }
            }
            .store(in: &cancellables)
    }

    // MARK: - Recovery Email Scheduling

    /// Schedule recovery email when blocking starts
    func scheduleRecoveryEmail(sendAt: Date) async throws {
        guard lockState.isConfigured,
              let email = lockState.recoveryEmail,
              let password = lockState.screenTimePassword else {
            return
        }

        let emailId = try await RecoveryService.shared.scheduleRecoveryEmail(
            recipientEmail: email,
            password: password,
            sendAt: sendAt
        )

        lockState.scheduledEmailId = emailId
    }

    /// Cancel scheduled recovery email (e.g., if session ends early)
    func cancelScheduledRecoveryEmail() async {
        guard let emailId = lockState.scheduledEmailId else { return }

        try? await RecoveryService.shared.cancelRecoveryEmail(emailId: emailId)
        lockState.scheduledEmailId = nil
    }

    // MARK: - Blocking Control

    /// Stop blocking
    func stopBlocking() {
        scheduler.stopBlocking()

        // Cancel any scheduled recovery email
        Task {
            await cancelScheduledRecoveryEmail()
        }
    }
}
