import SwiftUI

/// Schedule tab: configure weekly blocking schedule
struct ScheduleView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        VStack(spacing: 0) {
            // Status header
            StatusHeaderView()
                .padding()

            Divider()

            // Instructions
            Text("Drag on the calendar to create blocking sessions")
                .font(.caption)
                .foregroundStyle(.secondary)
                .padding(.vertical, 8)

            // Week grid calendar
            WeekGridView(schedule: $appState.schedule.blockSchedule)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }
}

#Preview {
    ScheduleView()
        .environmentObject(AppState())
        .frame(width: 600, height: 500)
}
