import SwiftUI

/// Main settings window with tabbed interface
struct SettingsView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        TabView {
            ScheduleView()
                .tabItem {
                    Label("Schedule", systemImage: "calendar")
                }

            RecoveryView()
                .tabItem {
                    Label("Recovery", systemImage: "key.fill")
                }
        }
        .frame(minWidth: 600, minHeight: 500)
    }
}

#Preview {
    SettingsView()
        .environmentObject(AppState())
}
