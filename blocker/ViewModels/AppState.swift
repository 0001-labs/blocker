import Foundation
import Combine

/// Main application state coordinator
@MainActor
final class AppState: ObservableObject {

    // MARK: - Services

    let persistence = PersistenceService()
    let calendarService = CalendarService()
    let blockingEngine = StubBlockingEngine()
    let runtimeState = RuntimeState()

    lazy var scheduler: Scheduler = {
        Scheduler(calendarService: calendarService, runtimeState: runtimeState)
    }()

    // MARK: - State

    @Published var rules: Rules
    @Published var schedule: Schedule
    @Published var lockState: LockState

    private var cancellables = Set<AnyCancellable>()

    // MARK: - Initialization

    init() {
        // Load persisted state
        self.rules = persistence.loadRules()
        self.schedule = persistence.loadSchedule()
        self.lockState = persistence.loadLockState()

        setupBindings()
        scheduler.schedule = schedule
        scheduler.start()
    }

    deinit {
        scheduler.stop()
    }

    // MARK: - Setup

    private func setupBindings() {
        // Auto-save rules changes
        $rules
            .dropFirst()
            .debounce(for: .seconds(0.5), scheduler: RunLoop.main)
            .sink { [weak self] rules in
                self?.persistence.saveRules(rules)
            }
            .store(in: &cancellables)

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

        // Sync blocking engine with runtime state
        runtimeState.$isBlockingActive
            .sink { [weak self] isActive in
                guard let self = self else { return }
                Task {
                    if isActive {
                        try? await self.blockingEngine.activate(rules: self.rules)
                    } else {
                        try? await self.blockingEngine.deactivate()
                    }
                }
            }
            .store(in: &cancellables)
    }

    // MARK: - PIN Verification

    /// Check if an action requires PIN verification
    func requiresPINForAction() -> Bool {
        lockState.enabled && lockState.hasPIN && runtimeState.isBlockingActive
    }

    /// Verify a PIN against stored hash
    func verifyPIN(_ pin: String) -> Bool {
        guard let storedHash = lockState.pinHash else { return false }
        return PINHasher.verify(pin, against: storedHash)
    }

    /// Set a new PIN
    func setPIN(_ pin: String) {
        lockState.pinHash = PINHasher.hash(pin)
        lockState.enabled = true
    }

    /// Clear the PIN and disable lock
    func clearPIN() {
        lockState.pinHash = nil
        lockState.enabled = false
    }

    // MARK: - Blocking Control

    /// Start manual timer blocking
    func startManualTimer(duration: TimeInterval, pinVerified: Bool = false) -> Bool {
        if requiresPINForAction() && !pinVerified {
            return false
        }
        scheduler.startManualTimer(duration: duration)
        return true
    }

    /// Stop blocking
    func stopBlocking(pinVerified: Bool = false) -> Bool {
        if requiresPINForAction() && !pinVerified {
            return false
        }
        scheduler.stopBlocking()
        return true
    }
}
