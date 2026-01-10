import SwiftUI

/// Rules tab: manage allowed and restricted domain lists
struct RulesView: View {
    @EnvironmentObject var appState: AppState
    @StateObject private var viewModel = RulesViewModel()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Status header
                StatusHeaderView()

                // Mode selector
                VStack(alignment: .leading, spacing: 8) {
                    Text("Mode")
                        .font(.headline)

                    Picker("Mode", selection: $appState.rules.mode) {
                        Text("Blocklist").tag(BlockingMode.blocklist)
                        Text("Allowlist").tag(BlockingMode.allowlist)
                    }
                    .pickerStyle(.segmented)
                    .labelsHidden()

                    Text(appState.rules.mode.description)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                Divider()

                // Domain lists
                VStack(spacing: 24) {
                    // Allowed list
                    DomainListEditor(
                        entries: $appState.rules.allowed,
                        selection: $viewModel.selectedAllowed,
                        title: "Allowed",
                        helperText: allowedHelperText,
                        onAdd: { viewModel.showingAddAllowed = true },
                        onExport: { viewModel.exportList(.allowed) },
                        onImport: { viewModel.importList(.allowed, from: $0) },
                        onClear: { viewModel.clearList(.allowed) }
                    )

                    // Restricted list
                    DomainListEditor(
                        entries: $appState.rules.restricted,
                        selection: $viewModel.selectedRestricted,
                        title: "Restricted",
                        helperText: restrictedHelperText,
                        onAdd: { viewModel.showingAddRestricted = true },
                        onExport: { viewModel.exportList(.restricted) },
                        onImport: { viewModel.importList(.restricted, from: $0) },
                        onClear: { viewModel.clearList(.restricted) }
                    )
                }
            }
            .padding()
        }
        .onAppear {
            viewModel.appState = appState
        }
        .sheet(isPresented: $viewModel.showingAddAllowed) {
            AddDomainSheet { url, title in
                viewModel.addToAllowed(input: url, title: title)
            }
        }
        .sheet(isPresented: $viewModel.showingAddRestricted) {
            AddDomainSheet { url, title in
                viewModel.addToRestricted(input: url, title: title)
            }
        }
        .alert("Error", isPresented: $viewModel.showingError) {
            Button("OK") {}
        } message: {
            Text(viewModel.errorMessage ?? "An error occurred")
        }
    }

    private var allowedHelperText: String {
        switch appState.rules.mode {
        case .blocklist:
            return "These websites are always allowed (not used in blocklist mode)."
        case .allowlist:
            return "Only these websites will be accessible when blocking is active."
        }
    }

    private var restrictedHelperText: String {
        switch appState.rules.mode {
        case .blocklist:
            return "These websites will be blocked when blocking is active."
        case .allowlist:
            return "These websites are explicitly blocked (not used in allowlist mode)."
        }
    }
}

#Preview {
    RulesView()
        .environmentObject(AppState())
        .frame(width: 500, height: 600)
}
