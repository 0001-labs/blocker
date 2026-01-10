import SwiftUI

/// Secure PIN entry component
struct PINEntryView: View {
    @Binding var pin: String

    let label: String
    let placeholder: String

    @FocusState private var isFocused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)

            SecureField(placeholder, text: $pin)
                .textFieldStyle(.roundedBorder)
                .focused($isFocused)
                .onChange(of: pin) { _, newValue in
                    // Filter to digits only and limit length
                    let filtered = newValue.filter { $0.isNumber }
                    let limited = String(filtered.prefix(LockState.maxPINLength))
                    if limited != newValue {
                        pin = limited
                    }
                }
        }
    }
}

/// PIN verification dialog
struct PINPromptView: View {
    @Environment(\.dismiss) private var dismiss

    @State private var pin = ""
    @State private var errorMessage: String?

    let title: String
    let message: String
    let onVerify: (String) -> Bool

    var body: some View {
        VStack(spacing: 20) {
            Text(title)
                .font(.headline)

            Text(message)
                .font(.body)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)

            PINEntryView(
                pin: $pin,
                label: "PIN",
                placeholder: "Enter your PIN"
            )

            if let error = errorMessage {
                Text(error)
                    .font(.caption)
                    .foregroundStyle(.red)
            }

            HStack {
                Button("Cancel") {
                    dismiss()
                }
                .keyboardShortcut(.cancelAction)

                Spacer()

                Button("Verify") {
                    verify()
                }
                .keyboardShortcut(.defaultAction)
                .disabled(pin.isEmpty)
            }
        }
        .padding()
        .frame(width: 300)
    }

    private func verify() {
        if onVerify(pin) {
            dismiss()
        } else {
            errorMessage = "Incorrect PIN"
            pin = ""
        }
    }
}

#Preview {
    @Previewable @State var pin = ""

    VStack(spacing: 20) {
        PINEntryView(
            pin: $pin,
            label: "Enter PIN",
            placeholder: "4-12 digits"
        )

        Text("Entered: \(pin)")
    }
    .padding()
}
