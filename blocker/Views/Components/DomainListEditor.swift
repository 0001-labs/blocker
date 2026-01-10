import SwiftUI
import UniformTypeIdentifiers

/// Editable list of domains with add/remove/import/export functionality
struct DomainListEditor: View {
    @Binding var entries: [DomainEntry]
    @Binding var selection: Set<UUID>

    let title: String
    let helperText: String
    let onAdd: () -> Void
    let onExport: () -> Data?
    let onImport: (Data) -> Void
    let onClear: () -> Void

    @State private var showingImporter = false
    @State private var showingExporter = false
    @State private var showingClearConfirmation = false
    @State private var exportData: Data?

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Header
            HStack {
                Text(title)
                    .font(.headline)

                Spacer()

                // Toolbar buttons
                HStack(spacing: 4) {
                    Button(action: onAdd) {
                        Image(systemName: "plus")
                    }
                    .buttonStyle(.borderless)
                    .help("Add website")

                    Button(action: removeSelected) {
                        Image(systemName: "minus")
                    }
                    .buttonStyle(.borderless)
                    .disabled(selection.isEmpty)
                    .help("Remove selected")

                    Menu {
                        Button("Import...") {
                            showingImporter = true
                        }
                        Button("Export...") {
                            exportData = onExport()
                            if exportData != nil {
                                showingExporter = true
                            }
                        }
                        .disabled(entries.isEmpty)

                        Divider()

                        Button("Clear list", role: .destructive) {
                            showingClearConfirmation = true
                        }
                        .disabled(entries.isEmpty)
                    } label: {
                        Image(systemName: "ellipsis.circle")
                    }
                    .buttonStyle(.borderless)
                    .menuIndicator(.hidden)
                }
            }

            // Helper text
            Text(helperText)
                .font(.caption)
                .foregroundStyle(.secondary)

            // List
            if entries.isEmpty {
                ContentUnavailableView {
                    Label("No websites", systemImage: "globe")
                } description: {
                    Text("Click + to add a website")
                }
                .frame(minHeight: 100)
            } else {
                List(entries, selection: $selection) { entry in
                    DomainRowView(entry: entry)
                        .tag(entry.id)
                }
                .listStyle(.bordered)
                .frame(minHeight: 150)
            }
        }
        .fileImporter(
            isPresented: $showingImporter,
            allowedContentTypes: [.json]
        ) { result in
            if case .success(let url) = result {
                if let data = try? Data(contentsOf: url) {
                    onImport(data)
                }
            }
        }
        .fileExporter(
            isPresented: $showingExporter,
            document: JSONDocument(data: exportData ?? Data()),
            contentType: .json,
            defaultFilename: "\(title.lowercased()).json"
        ) { _ in
            exportData = nil
        }
        .confirmationDialog(
            "Clear all websites from \(title)?",
            isPresented: $showingClearConfirmation,
            titleVisibility: .visible
        ) {
            Button("Clear", role: .destructive) {
                onClear()
            }
            Button("Cancel", role: .cancel) {}
        }
    }

    private func removeSelected() {
        entries.removeAll { selection.contains($0.id) }
        selection.removeAll()
    }
}

/// Document wrapper for JSON export
struct JSONDocument: FileDocument {
    static var readableContentTypes: [UTType] = [.json]

    var data: Data

    init(data: Data) {
        self.data = data
    }

    init(configuration: ReadConfiguration) throws {
        data = configuration.file.regularFileContents ?? Data()
    }

    func fileWrapper(configuration: WriteConfiguration) throws -> FileWrapper {
        FileWrapper(regularFileWithContents: data)
    }
}

#Preview {
    @Previewable @State var entries = [
        DomainEntry(host: "youtube.com", title: "Video"),
        DomainEntry(host: "twitter.com")
    ]
    @Previewable @State var selection: Set<UUID> = []

    DomainListEditor(
        entries: $entries,
        selection: $selection,
        title: "Restricted",
        helperText: "Websites in this list will be blocked.",
        onAdd: {},
        onExport: { nil },
        onImport: { _ in },
        onClear: {}
    )
    .padding()
}
