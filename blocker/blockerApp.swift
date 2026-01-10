import SwiftUI

@main
struct blockerApp: App {
    @StateObject private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            SettingsView()
                .environmentObject(appState)
        }
        .windowStyle(.hiddenTitleBar)
        .defaultSize(width: 600, height: 500)

        MenuBarExtra("Blocker", systemImage: runtimeState.isBlockingActive ? "hand.raised.fill" : "hand.raised") {
            MenuBarView()
                .environmentObject(appState)
        }
    }

    private var runtimeState: RuntimeState {
        appState.runtimeState
    }
}

struct MenuBarView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        VStack(spacing: 8) {
            StatusHeaderView()

            Divider()

            if appState.runtimeState.isBlockingActive {
                Button("Stop Blocking") {
                    appState.stopBlocking()
                }
            } else {
                Text("No active session")
                    .foregroundStyle(.secondary)
                    .font(.caption)
            }

            Divider()

            SettingsLink {
                Text("Settings...")
            }

            Button("Quit") {
                NSApplication.shared.terminate(nil)
            }
            .keyboardShortcut("q")
        }
        .padding(8)
    }
}
