import Foundation
import SwiftUI
import UniformTypeIdentifiers

/// ViewModel for the Rules tab
@MainActor
final class RulesViewModel: ObservableObject {

    @Published var showingAddAllowed = false
    @Published var showingAddRestricted = false
    @Published var selectedAllowed: Set<UUID> = []
    @Published var selectedRestricted: Set<UUID> = []
    @Published var errorMessage: String?
    @Published var showingError = false
    @Published var showingClearConfirmation = false
    @Published var clearTarget: ListType?

    enum ListType {
        case allowed
        case restricted
    }

    weak var appState: AppState?

    // MARK: - Domain Management

    /// Add a domain to the allowed list
    func addToAllowed(input: String, title: String?) -> Bool {
        guard let appState = appState else { return false }

        let result = DomainNormalizer.normalize(input)
        guard let host = result.host else {
            showError(result.error ?? "Invalid domain")
            return false
        }

        if DomainNormalizer.isDuplicate(host, in: appState.rules.allowed) {
            showError("Domain already exists in Allowed list")
            return false
        }

        let entry = DomainEntry(host: host, title: title?.isEmpty == true ? nil : title)
        appState.rules.allowed.append(entry)
        return true
    }

    /// Add a domain to the restricted list
    func addToRestricted(input: String, title: String?) -> Bool {
        guard let appState = appState else { return false }

        let result = DomainNormalizer.normalize(input)
        guard let host = result.host else {
            showError(result.error ?? "Invalid domain")
            return false
        }

        if DomainNormalizer.isDuplicate(host, in: appState.rules.restricted) {
            showError("Domain already exists in Restricted list")
            return false
        }

        let entry = DomainEntry(host: host, title: title?.isEmpty == true ? nil : title)
        appState.rules.restricted.append(entry)
        return true
    }

    /// Remove selected domains from allowed list
    func removeSelectedAllowed() {
        guard let appState = appState else { return }
        appState.rules.allowed.removeAll { selectedAllowed.contains($0.id) }
        selectedAllowed.removeAll()
    }

    /// Remove selected domains from restricted list
    func removeSelectedRestricted() {
        guard let appState = appState else { return }
        appState.rules.restricted.removeAll { selectedRestricted.contains($0.id) }
        selectedRestricted.removeAll()
    }

    /// Clear all domains in a list
    func clearList(_ type: ListType) {
        guard let appState = appState else { return }

        switch type {
        case .allowed:
            appState.rules.allowed.removeAll()
            selectedAllowed.removeAll()
        case .restricted:
            appState.rules.restricted.removeAll()
            selectedRestricted.removeAll()
        }
    }

    // MARK: - Import/Export

    /// Export a domain list to JSON
    func exportList(_ type: ListType) -> Data? {
        guard let appState = appState else { return nil }

        let entries: [DomainEntry]
        switch type {
        case .allowed:
            entries = appState.rules.allowed
        case .restricted:
            entries = appState.rules.restricted
        }

        return appState.persistence.exportDomainList(entries)
    }

    /// Import domains from JSON data
    func importList(_ type: ListType, from data: Data) {
        guard let appState = appState,
              let entries = appState.persistence.importDomainList(from: data) else {
            showError("Invalid import file format")
            return
        }

        switch type {
        case .allowed:
            for entry in entries {
                if !DomainNormalizer.isDuplicate(entry.host, in: appState.rules.allowed) {
                    appState.rules.allowed.append(entry)
                }
            }
        case .restricted:
            for entry in entries {
                if !DomainNormalizer.isDuplicate(entry.host, in: appState.rules.restricted) {
                    appState.rules.restricted.append(entry)
                }
            }
        }
    }

    // MARK: - Helpers

    private func showError(_ message: String) {
        errorMessage = message
        showingError = true
    }
}
