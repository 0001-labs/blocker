import SwiftUI

/// Sheet for adding a new domain
struct AddDomainSheet: View {
    @Environment(\.dismiss) private var dismiss

    @State private var urlInput = ""
    @State private var titleInput = ""
    @State private var validationError: String?

    let onSave: (String, String?) -> Bool

    var body: some View {
        VStack(spacing: 20) {
            Text("Add website")
                .font(.headline)

            VStack(alignment: .leading, spacing: 16) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Website")
                        .font(.caption)
                        .foregroundStyle(.secondary)

                    TextField("e.g., youtube.com or https://example.com/path", text: $urlInput)
                        .textFieldStyle(.roundedBorder)
                        .onSubmit(save)
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text("Title (optional)")
                        .font(.caption)
                        .foregroundStyle(.secondary)

                    TextField("Friendly name for this website", text: $titleInput)
                        .textFieldStyle(.roundedBorder)
                }

                if let error = validationError {
                    Text(error)
                        .font(.caption)
                        .foregroundStyle(.red)
                }
            }

            HStack {
                Button("Cancel") {
                    dismiss()
                }
                .keyboardShortcut(.cancelAction)

                Spacer()

                Button("Add") {
                    save()
                }
                .keyboardShortcut(.defaultAction)
                .disabled(urlInput.trimmingCharacters(in: .whitespaces).isEmpty)
            }
        }
        .padding()
        .frame(width: 400)
    }

    private func save() {
        let trimmedTitle = titleInput.trimmingCharacters(in: .whitespaces)
        if onSave(urlInput, trimmedTitle.isEmpty ? nil : trimmedTitle) {
            dismiss()
        } else {
            // Error should be set by the callback
            validationError = "Invalid domain or already exists"
        }
    }
}

#Preview {
    AddDomainSheet { url, title in
        print("Adding: \(url), title: \(title ?? "none")")
        return true
    }
}
