import SwiftUI

/// Lock tab: configure PIN protection
struct LockView: View {
    @EnvironmentObject var appState: AppState
    @StateObject private var viewModel = LockViewModel()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Status header
                StatusHeaderView()

                // Lock toggle
                VStack(alignment: .leading, spacing: 8) {
                    Toggle("Require PIN to stop blocking or edit rules", isOn: .constant(appState.lockState.enabled))
                        .disabled(true) // Controlled by PIN setup

                    Text("When enabled, you must enter your PIN to stop an active blocking session or modify the website lists.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                Divider()

                // PIN setup section
                if appState.lockState.hasPIN {
                    pinConfiguredSection
                } else {
                    pinNotConfiguredSection
                }

                Divider()

                // Recovery email section
                recoveryEmailSection

                // Warning
                VStack(alignment: .leading, spacing: 8) {
                    Label("No reset available", systemImage: "exclamationmark.triangle")
                        .font(.headline)
                        .foregroundStyle(.orange)

                    Text("There is no \"Forgot PIN\" option. If you forget your PIN, the only way to recover is via the email you send to yourself. Make sure to send the recovery email before starting a blocking session.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                .padding()
                .background(.orange.opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 8))
            }
            .padding()
        }
        .onAppear {
            viewModel.appState = appState
        }
        .sheet(isPresented: $viewModel.showingSetPIN) {
            setPINSheet
        }
        .sheet(isPresented: $viewModel.showingChangePIN) {
            changePINSheet
        }
    }

    // MARK: - PIN Configuration

    private var pinNotConfiguredSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("PIN not configured")
                .font(.headline)

            Text("Set a PIN to protect your blocking sessions. The PIN must be 4-12 digits.")
                .font(.caption)
                .foregroundStyle(.secondary)

            Button("Set PIN...") {
                viewModel.startSetPIN()
            }
            .buttonStyle(.borderedProminent)
        }
    }

    private var pinConfiguredSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Label("PIN configured", systemImage: "checkmark.circle.fill")
                    .font(.headline)
                    .foregroundStyle(.green)

                Spacer()

                Button("Change PIN...") {
                    viewModel.startChangePIN()
                }

                Button("Disable", role: .destructive) {
                    viewModel.disableLock()
                }
            }
        }
    }

    // MARK: - Recovery Email

    private var recoveryEmailSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Recovery email")
                .font(.headline)

            Text("Send yourself an email with your PIN before starting a blocking session. This is your only recovery method.")
                .font(.caption)
                .foregroundStyle(.secondary)

            TextField("your@email.com", text: Binding(
                get: { appState.lockState.recoveryEmail ?? "" },
                set: { appState.lockState.recoveryEmail = $0.isEmpty ? nil : $0 }
            ))
            .textFieldStyle(.roundedBorder)

            Button("Compose recovery email...") {
                // Show PIN entry first
                viewModel.showingSetPIN = false
                viewModel.showingChangePIN = false
                // Need to get the PIN from user before sending
                showRecoveryEmailPrompt()
            }
            .disabled(appState.lockState.recoveryEmail?.isEmpty != false || !appState.lockState.hasPIN)
        }
    }

    @State private var showingRecoveryPINPrompt = false
    @State private var recoveryPIN = ""

    private func showRecoveryEmailPrompt() {
        showingRecoveryPINPrompt = true
    }

    // MARK: - Set PIN Sheet

    private var setPINSheet: some View {
        VStack(spacing: 20) {
            Text("Set PIN")
                .font(.headline)

            VStack(alignment: .leading, spacing: 16) {
                PINEntryView(
                    pin: $viewModel.newPIN,
                    label: "New PIN",
                    placeholder: "4-12 digits"
                )

                PINEntryView(
                    pin: $viewModel.confirmPIN,
                    label: "Confirm PIN",
                    placeholder: "Enter again to confirm"
                )

                // Validation messages
                VStack(alignment: .leading, spacing: 4) {
                    if viewModel.pinTooShort {
                        validationMessage("PIN must be at least 4 digits", isError: true)
                    }
                    if viewModel.pinContainsNonDigits {
                        validationMessage("PIN must contain only digits", isError: true)
                    }
                    if viewModel.pinMismatch {
                        validationMessage("PINs do not match", isError: true)
                    }
                    if let error = viewModel.pinError {
                        validationMessage(error, isError: true)
                    }
                }
            }

            HStack {
                Button("Cancel") {
                    viewModel.showingSetPIN = false
                    viewModel.resetForm()
                }
                .keyboardShortcut(.cancelAction)

                Spacer()

                Button("Set PIN") {
                    _ = viewModel.setPIN()
                }
                .keyboardShortcut(.defaultAction)
                .disabled(!viewModel.isPINValid)
            }
        }
        .padding()
        .frame(width: 350)
    }

    // MARK: - Change PIN Sheet

    private var changePINSheet: some View {
        VStack(spacing: 20) {
            Text("Change PIN")
                .font(.headline)

            VStack(alignment: .leading, spacing: 16) {
                PINEntryView(
                    pin: $viewModel.currentPIN,
                    label: "Current PIN",
                    placeholder: "Enter current PIN"
                )

                Divider()

                PINEntryView(
                    pin: $viewModel.newPIN,
                    label: "New PIN",
                    placeholder: "4-12 digits"
                )

                PINEntryView(
                    pin: $viewModel.confirmPIN,
                    label: "Confirm new PIN",
                    placeholder: "Enter again to confirm"
                )

                // Validation messages
                VStack(alignment: .leading, spacing: 4) {
                    if viewModel.pinMismatch {
                        validationMessage("PINs do not match", isError: true)
                    }
                    if let error = viewModel.pinError {
                        validationMessage(error, isError: true)
                    }
                }
            }

            HStack {
                Button("Cancel") {
                    viewModel.showingChangePIN = false
                    viewModel.resetForm()
                }
                .keyboardShortcut(.cancelAction)

                Spacer()

                Button("Change PIN") {
                    _ = viewModel.changePIN()
                }
                .keyboardShortcut(.defaultAction)
                .disabled(!viewModel.isPINValid || viewModel.currentPIN.isEmpty)
            }
        }
        .padding()
        .frame(width: 350)
    }

    private func validationMessage(_ text: String, isError: Bool) -> some View {
        HStack(spacing: 4) {
            Image(systemName: isError ? "xmark.circle" : "checkmark.circle")
            Text(text)
        }
        .font(.caption)
        .foregroundStyle(isError ? .red : .green)
    }
}

#Preview {
    LockView()
        .environmentObject(AppState())
        .frame(width: 500, height: 600)
}
