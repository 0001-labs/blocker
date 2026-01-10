import SwiftUI

/// Main settings window with tabbed interface
struct SettingsView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        TabView {
            RulesView()
                .tabItem {
                    Label("Rules", systemImage: "list.bullet")
                }

            ScheduleView()
                .tabItem {
                    Label("Schedule", systemImage: "calendar")
                }

            LockView()
                .tabItem {
                    Label("Lock", systemImage: "lock")
                }
        }
        .frame(minWidth: 500, minHeight: 500)
    }
}

#Preview {
    SettingsView()
        .environmentObject(AppState())
}
