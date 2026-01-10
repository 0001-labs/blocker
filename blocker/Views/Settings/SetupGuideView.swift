import SwiftUI

/// Complete setup guide for bypass-prevention blocking
struct SetupGuideView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 32) {
                // Header
                VStack(alignment: .leading, spacing: 8) {
                    Text("Setup Guide")
                        .font(.largeTitle.bold())
                    Text("Follow these steps to enable unbypassable blocking")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }

                // Overview
                overviewSection

                Divider()

                // Step 1: Create Apple ID
                createAppleIdSection

                Divider()

                // Step 2: Configure app
                configureAppSection

                Divider()

                // Step 3: When blocking starts
                whenBlockingStartsSection

                Divider()

                // Step 4: When blocking ends
                whenBlockingEndsSection

                Divider()

                // Important warnings
                warningsSection

                // Done button
                Button("Got it") {
                    dismiss()
                }
                .buttonStyle(.borderedProminent)
                .frame(maxWidth: .infinity)
                .padding(.top)
            }
            .padding(24)
        }
        .frame(minWidth: 500, minHeight: 600)
    }

    // MARK: - Overview

    private var overviewSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("How it works", systemImage: "info.circle.fill")
                .font(.headline)
                .foregroundStyle(.blue)

            Text("This app makes Screen Time blocking truly unbypassable by using a clever trick: you won't know your own Screen Time passcode or recovery credentials during blocking.")
                .font(.callout)

            Text("The recovery password is sent to you by email only when the blocking session ends.")
                .font(.callout)
                .foregroundStyle(.secondary)
        }
        .padding()
        .background(Color.blue.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    // MARK: - Step 1: Create Apple ID

    private var createAppleIdSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            stepHeader(number: 1, title: "Create a dedicated Apple ID", subtitle: "One-time setup")

            VStack(alignment: .leading, spacing: 12) {
                instructionRow(
                    icon: "globe",
                    title: "Go to appleid.apple.com",
                    description: "Open Safari and navigate to Apple's account creation page"
                )

                instructionRow(
                    icon: "person.badge.plus",
                    title: "Create a new Apple ID",
                    description: "Use any email you have access to. This account is ONLY for Screen Time recovery."
                )

                instructionRow(
                    icon: "key.fill",
                    title: "Set a long, random password",
                    description: "Use a password generator. Make it 20+ characters. You don't need to memorize it."
                )

                instructionRow(
                    icon: "doc.on.clipboard",
                    title: "Copy the password",
                    description: "You'll paste this into the Blocker app in the next step."
                )

                importantNote(
                    "Do NOT save this password anywhere you can access during blocking (no password manager, no notes app, no bookmarks)."
                )
            }
        }
    }

    // MARK: - Step 2: Configure App

    private var configureAppSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            stepHeader(number: 2, title: "Configure recovery in the app", subtitle: "One-time setup")

            VStack(alignment: .leading, spacing: 12) {
                instructionRow(
                    icon: "envelope",
                    title: "Enter your recovery email",
                    description: "This is where you'll receive the password when blocking ends. Use your regular email."
                )

                instructionRow(
                    icon: "lock.fill",
                    title: "Paste the Apple ID password",
                    description: "Paste the password you created for your dedicated Screen Time Apple ID."
                )

                instructionRow(
                    icon: "checkmark.circle",
                    title: "Test the connection",
                    description: "Click 'Test connection' to verify the email service is working."
                )
            }
        }
    }

    // MARK: - Step 3: When Blocking Starts

    private var whenBlockingStartsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            stepHeader(number: 3, title: "When a blocking session starts", subtitle: "Each time")

            VStack(alignment: .leading, spacing: 12) {
                instructionRow(
                    icon: "bell.badge",
                    title: "You'll receive a notification",
                    description: "The app alerts you that a scheduled blocking session is starting."
                )

                instructionRow(
                    icon: "gear",
                    title: "Open System Settings > Screen Time",
                    description: "Navigate to Screen Time settings on your Mac."
                )

                instructionRow(
                    icon: "person.crop.circle",
                    title: "Set the recovery Apple ID",
                    description: "Under 'Change Screen Time Passcode', set recovery to your dedicated Apple ID."
                )

                instructionRow(
                    icon: "hand.tap",
                    title: "Mash random keys for the PIN",
                    description: "When setting the 4-digit passcode, randomly tap keys. Don't try to remember it!"
                )

                importantNote(
                    "The goal is to NOT know your passcode. Mash the keyboard randomly and immediately forget what you typed."
                )
            }
        }
    }

    // MARK: - Step 4: When Blocking Ends

    private var whenBlockingEndsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            stepHeader(number: 4, title: "When the blocking session ends", subtitle: "Each time")

            VStack(alignment: .leading, spacing: 12) {
                instructionRow(
                    icon: "envelope.open",
                    title: "Check your email",
                    description: "You'll receive an email with your Screen Time Apple ID password."
                )

                instructionRow(
                    icon: "arrow.counterclockwise",
                    title: "Reset your Screen Time passcode",
                    description: "Go to Screen Time > Change Passcode > Forgot Passcode, then sign in with your dedicated Apple ID."
                )

                instructionRow(
                    icon: "trash",
                    title: "DELETE the email immediately",
                    description: "Remove the recovery email from your inbox AND trash. This is critical!"
                )

                warningNote(
                    "If you don't delete the email, you could use it to bypass future blocking sessions. Delete it right after use, every time."
                )
            }
        }
    }

    // MARK: - Warnings

    private var warningsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Label("Important reminders", systemImage: "exclamationmark.triangle.fill")
                .font(.headline)
                .foregroundStyle(.orange)

            VStack(alignment: .leading, spacing: 8) {
                warningItem("Always delete recovery emails immediately after use")
                warningItem("Never save the Apple ID password where you can access it")
                warningItem("The 4-digit Screen Time PIN should be random and forgotten")
                warningItem("This only works if you commit to the process honestly")
            }
        }
        .padding()
        .background(Color.orange.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    // MARK: - Helper Views

    private func stepHeader(number: Int, title: String, subtitle: String) -> some View {
        HStack(alignment: .top, spacing: 16) {
            Text("\(number)")
                .font(.system(size: 24, weight: .bold))
                .foregroundStyle(.white)
                .frame(width: 44, height: 44)
                .background(Circle().fill(Color.accentColor))

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.title2.bold())
                Text(subtitle)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
        }
    }

    private func instructionRow(icon: String, title: String, description: String) -> some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundStyle(Color.accentColor)
                .frame(width: 24)

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.subheadline.bold())
                Text(description)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.leading, 8)
    }

    private func importantNote(_ text: String) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: "lightbulb.fill")
                .foregroundStyle(.yellow)
            Text(text)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding(12)
        .background(Color.yellow.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .padding(.leading, 8)
    }

    private func warningNote(_ text: String) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(.red)
            Text(text)
                .font(.caption)
                .fontWeight(.medium)
        }
        .padding(12)
        .background(Color.red.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .padding(.leading, 8)
    }

    private func warningItem(_ text: String) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: "checkmark.circle.fill")
                .foregroundStyle(.orange)
                .font(.caption)
            Text(text)
                .font(.callout)
        }
    }
}

#Preview {
    SetupGuideView()
}
