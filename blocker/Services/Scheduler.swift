import Foundation
import Combine

/// Service for evaluating and managing blocking schedules
@MainActor
final class Scheduler: ObservableObject {

    private var timer: Timer?
    private var cancellables = Set<AnyCancellable>()

    let runtimeState: RuntimeState

    @Published var schedule: Schedule = .default

    init(runtimeState: RuntimeState) {
        self.runtimeState = runtimeState
    }

    /// Start the scheduler
    func start() {
        // Evaluate immediately
        evaluate()

        // Set up timer to evaluate every 30 seconds
        timer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { [weak self] _ in
            Task { @MainActor in
                self?.evaluate()
            }
        }
    }

    /// Stop the scheduler
    nonisolated func stop() {
        // Timer will be cleaned up when Scheduler is deallocated
    }

    /// Evaluate the current schedule state
    func evaluate() {
        // Check if blocking has expired
        runtimeState.checkExpiration()

        // Evaluate block schedule
        evaluateBlockSchedule()
    }

    /// Evaluate block schedule
    private func evaluateBlockSchedule() {
        if let activeSession = schedule.blockSchedule.activeSession(),
           let endDate = schedule.blockSchedule.activeSessionEndDate() {
            // Activate blocking if not already active for this session
            if !runtimeState.isBlockingActive {
                runtimeState.activate(
                    reason: .scheduledSession(name: activeSession.formattedTimeRange),
                    until: endDate
                )
            }
        } else if runtimeState.isBlockingActive {
            // Deactivate when no active session
            runtimeState.deactivate()
        }
    }

    /// Stop blocking (requires PIN verification if locked)
    func stopBlocking() {
        runtimeState.deactivate()
    }
}
