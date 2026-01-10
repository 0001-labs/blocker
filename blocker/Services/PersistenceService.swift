import Foundation

/// Service for persisting app data to disk
@MainActor
final class PersistenceService: ObservableObject {

    private let fileManager = FileManager.default
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()

    /// Directory for storing app data
    private var appSupportDirectory: URL {
        let paths = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask)
        let appSupport = paths[0].appendingPathComponent("blocker", isDirectory: true)

        // Create directory if it doesn't exist
        if !fileManager.fileExists(atPath: appSupport.path) {
            try? fileManager.createDirectory(at: appSupport, withIntermediateDirectories: true)
        }

        return appSupport
    }

    private var scheduleFile: URL {
        appSupportDirectory.appendingPathComponent("schedule.json")
    }

    private var lockFile: URL {
        appSupportDirectory.appendingPathComponent("lock.json")
    }

    // MARK: - Schedule

    func loadSchedule() -> Schedule {
        load(from: scheduleFile) ?? .default
    }

    func saveSchedule(_ schedule: Schedule) {
        save(schedule, to: scheduleFile)
    }

    // MARK: - Lock State

    func loadLockState() -> LockState {
        load(from: lockFile) ?? .empty
    }

    func saveLockState(_ lockState: LockState) {
        save(lockState, to: lockFile)
    }

    // MARK: - Private Helpers

    private func load<T: Decodable>(from url: URL) -> T? {
        guard let data = try? Data(contentsOf: url) else { return nil }
        return try? decoder.decode(T.self, from: data)
    }

    private func save<T: Encodable>(_ value: T, to url: URL) {
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        guard let data = try? encoder.encode(value) else { return }
        try? data.write(to: url, options: .atomic)
    }
}
