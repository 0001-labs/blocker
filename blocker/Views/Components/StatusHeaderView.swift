import SwiftUI

/// Displays the current blocking status
struct StatusHeaderView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        HStack(spacing: 12) {
            // Status indicator
            Circle()
                .fill(statusColor)
                .frame(width: 10, height: 10)

            VStack(alignment: .leading, spacing: 2) {
                Text(statusTitle)
                    .font(.headline)

                if let subtitle = statusSubtitle {
                    Text(subtitle)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }

            Spacer()

            if appState.runtimeState.isBlockingActive {
                if let remaining = appState.runtimeState.timeRemaining {
                    Text(remaining)
                        .font(.system(.body, design: .monospaced))
                        .foregroundStyle(.secondary)
                }
            }
        }
        .padding()
        .background(.background.secondary)
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }

    private var statusColor: Color {
        appState.runtimeState.isBlockingActive ? .red : .green
    }

    private var statusTitle: String {
        appState.runtimeState.isBlockingActive ? "Blocking active" : "Idle"
    }

    private var statusSubtitle: String? {
        guard appState.runtimeState.isBlockingActive else { return nil }
        return appState.runtimeState.activeReason?.displayDescription
    }
}

#Preview {
    StatusHeaderView()
        .environmentObject(AppState())
        .padding()
}
