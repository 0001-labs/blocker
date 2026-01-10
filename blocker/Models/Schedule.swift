import Foundation

/// Schedule configuration for blocking sessions
struct Schedule: Codable {
    var blockSchedule: BlockSchedule

    static let `default` = Schedule(
        blockSchedule: .empty
    )
}
