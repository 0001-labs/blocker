import SwiftUI

/// Recovery tab: configure Screen Time Apple ID credentials
struct RecoveryView: View {
    @EnvironmentObject var appState: AppState
    @State private var showingGuide = false
    @State private var appleIdEmail = ""
    @State private var appleIdPassword = ""
    @State private var confirmPassword = ""
    @State private var isEditing = false
    @State private var showingDeleteConfirmation = false

    private var isBlocking: Bool {
        appState.runtimeState.isBlockingActive
    }

    private var hasCredentials: Bool {
        appState.lockState.screenTimeAppleId != nil &&
        appState.lockState.screenTimePassword != nil
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Header
                headerSection

                // Setup guide button
                setupGuideSection

                Divider()

                // Recovery email (where to send)
                recoveryEmailSection

                Divider()

                // Apple ID credentials
                if hasCredentials && !isEditing {
                    credentialsDisplaySection
                } else {
                    credentialsEditSection
                }

                // Warnings
                if hasCredentials {
                    securityWarningSection
                }
            }
            .padding()
        }
        .sheet(isPresented: $showingGuide) {
            SetupGuideView()
        }
        .alert("Delete Credentials?", isPresented: $showingDeleteConfirmation) {
            Button("Cancel", role: .cancel) { }
            Button("Delete", role: .destructive) {
                deleteCredentials()
            }
        } message: {
            Text("This will remove your Screen Time Apple ID credentials. You'll need to enter them again.")
        }
        .onAppear {
            // Don't load password - it should never be readable
            appleIdEmail = appState.lockState.screenTimeAppleId ?? ""
        }
    }

    // MARK: - Header

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Label("Screen Time Recovery", systemImage: "key.fill")
                .font(.title2.bold())

            Text("Store your dedicated Screen Time Apple ID credentials here. They will be emailed to you when blocking ends, so you can reset and unlock the Screen Time lock.")
                .font(.callout)
                .foregroundStyle(.secondary)
        }
    }

    // MARK: - Setup Guide

    private var setupGuideSection: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("First time setup?")
                    .font(.subheadline.bold())
                Text("Learn how to create a dedicated Apple ID")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            Button("Setup Guide") {
                showingGuide = true
            }
        }
        .padding()
        .background(Color.accentColor.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }

    // MARK: - Recovery Email

    private var recoveryEmailSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Your email (where to send recovery)")
                .font(.headline)

            TextField("your.regular@email.com", text: Binding(
                get: { appState.lockState.recoveryEmail ?? "" },
                set: { appState.lockState.recoveryEmail = $0.isEmpty ? nil : $0 }
            ))
            .textFieldStyle(.roundedBorder)
            .textContentType(.emailAddress)
            .disabled(isBlocking)

            Text("When blocking ends, your Screen Time credentials will be sent to this email.")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }

    // MARK: - Credentials Display (locked view)

    private var credentialsDisplaySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Screen Time Apple ID")
                .font(.headline)

            // Show Apple ID email (readable)
            VStack(alignment: .leading, spacing: 6) {
                Text("Apple ID")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)

                HStack {
                    Text(appState.lockState.screenTimeAppleId ?? "")
                        .font(.body.monospaced())
                        .padding(8)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(NSColor.controlBackgroundColor))
                        .clipShape(RoundedRectangle(cornerRadius: 6))

                    if !isBlocking {
                        Button("Edit") {
                            startEditing()
                        }
                    }
                }
            }

            // Password is NEVER shown
            VStack(alignment: .leading, spacing: 6) {
                Text("Password")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)

                HStack {
                    Text("••••••••••••••••")
                        .font(.body.monospaced())
                        .foregroundStyle(.secondary)
                        .padding(8)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(NSColor.controlBackgroundColor))
                        .clipShape(RoundedRectangle(cornerRadius: 6))

                    if !isBlocking {
                        Button("Change") {
                            startEditing()
                        }
                    }
                }

                Label("Password is hidden and cannot be viewed", systemImage: "lock.fill")
                    .font(.caption)
                    .foregroundStyle(.green)
            }

            if isBlocking {
                Label("Cannot edit while blocking is active", systemImage: "hand.raised.fill")
                    .font(.caption)
                    .foregroundStyle(.orange)
                    .padding(.top, 8)
            } else {
                Button("Delete credentials", role: .destructive) {
                    showingDeleteConfirmation = true
                }
                .padding(.top, 8)
            }
        }
    }

    // MARK: - Credentials Edit

    private var credentialsEditSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Screen Time Apple ID")
                .font(.headline)

            if isBlocking {
                Label("Cannot edit while blocking is active", systemImage: "hand.raised.fill")
                    .font(.callout)
                    .foregroundStyle(.orange)
            } else {
                // Apple ID email
                VStack(alignment: .leading, spacing: 6) {
                    Text("Apple ID email")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)

                    TextField("screentime@icloud.com", text: $appleIdEmail)
                        .textFieldStyle(.roundedBorder)
                        .textContentType(.emailAddress)

                    Text("The email for your DEDICATED Screen Time Apple ID (not your main one)")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                // Password
                VStack(alignment: .leading, spacing: 6) {
                    Text("Password")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)

                    SecureField("Enter password", text: $appleIdPassword)
                        .textFieldStyle(.roundedBorder)
                        .textContentType(.newPassword)

                    Text("Once saved, this password cannot be viewed - only emailed to you when blocking ends")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                // Confirm password
                VStack(alignment: .leading, spacing: 6) {
                    Text("Confirm password")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)

                    SecureField("Enter password again", text: $confirmPassword)
                        .textFieldStyle(.roundedBorder)
                        .textContentType(.newPassword)

                    if !confirmPassword.isEmpty && appleIdPassword != confirmPassword {
                        Label("Passwords don't match", systemImage: "xmark.circle.fill")
                            .font(.caption)
                            .foregroundStyle(.red)
                    }
                }

                // Save button
                HStack {
                    if isEditing {
                        Button("Cancel") {
                            cancelEditing()
                        }
                    }

                    Spacer()

                    Button("Save Credentials") {
                        saveCredentials()
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(!canSave)
                }
                .padding(.top, 8)
            }
        }
    }

    // MARK: - Security Warning

    private var securityWarningSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Label("Security", systemImage: "shield.checkered")
                .font(.subheadline.bold())
                .foregroundStyle(.green)

            Text("Your password is stored securely and can only be sent via email when blocking ends. It cannot be viewed or copied from this app.")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding()
        .background(Color.green.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }

    // MARK: - Validation

    private var canSave: Bool {
        let emailValid = isValidEmail(appleIdEmail)
        let passwordValid = !appleIdPassword.isEmpty && appleIdPassword.count >= 8
        let passwordsMatch = appleIdPassword == confirmPassword
        return emailValid && passwordValid && passwordsMatch
    }

    private func isValidEmail(_ email: String) -> Bool {
        guard !email.isEmpty else { return false }
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }

    // MARK: - Actions

    private func startEditing() {
        appleIdEmail = appState.lockState.screenTimeAppleId ?? ""
        appleIdPassword = ""
        confirmPassword = ""
        isEditing = true
    }

    private func cancelEditing() {
        appleIdEmail = appState.lockState.screenTimeAppleId ?? ""
        appleIdPassword = ""
        confirmPassword = ""
        isEditing = false
    }

    private func saveCredentials() {
        appState.lockState.screenTimeAppleId = appleIdEmail
        appState.lockState.screenTimePassword = appleIdPassword
        appleIdPassword = ""
        confirmPassword = ""
        isEditing = false
    }

    private func deleteCredentials() {
        appState.lockState.screenTimeAppleId = nil
        appState.lockState.screenTimePassword = nil
        appleIdEmail = ""
        appleIdPassword = ""
        confirmPassword = ""
        isEditing = false
    }
}

#Preview {
    RecoveryView()
        .environmentObject(AppState())
        .frame(width: 500, height: 700)
}
