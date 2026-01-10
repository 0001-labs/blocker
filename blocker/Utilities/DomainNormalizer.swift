import Foundation

/// Utility for normalizing domain/URL inputs to canonical domain format
enum DomainNormalizer {

    /// Result of domain normalization
    enum NormalizationResult {
        case success(String)
        case invalid(String)

        var host: String? {
            if case .success(let host) = self {
                return host
            }
            return nil
        }

        var error: String? {
            if case .invalid(let message) = self {
                return message
            }
            return nil
        }
    }

    /// Normalize a URL or domain string to a canonical host format
    /// - Parameter input: URL string or domain (e.g., "https://www.youtube.com/watch?v=123" or "dr.dk")
    /// - Returns: Normalized domain (e.g., "youtube.com", "dr.dk") or error
    static func normalize(_ input: String) -> NormalizationResult {
        let trimmed = input.trimmingCharacters(in: .whitespacesAndNewlines)

        guard !trimmed.isEmpty else {
            return .invalid("Domain cannot be empty")
        }

        // Try to parse as URL first
        var workingString = trimmed

        // Add scheme if missing for URL parsing
        if !workingString.contains("://") {
            workingString = "https://" + workingString
        }

        guard let url = URL(string: workingString),
              var host = url.host else {
            // Fallback: treat as plain domain
            return normalizeHost(trimmed)
        }

        return normalizeHost(host)
    }

    /// Normalize a host string
    private static func normalizeHost(_ host: String) -> NormalizationResult {
        var normalized = host.lowercased()

        // Strip www. prefix
        if normalized.hasPrefix("www.") {
            normalized = String(normalized.dropFirst(4))
        }

        // Validate the result looks like a domain
        guard isValidDomain(normalized) else {
            return .invalid("Invalid domain format")
        }

        return .success(normalized)
    }

    /// Basic domain validation
    private static func isValidDomain(_ domain: String) -> Bool {
        // Must contain at least one dot
        guard domain.contains(".") else { return false }

        // Must not start or end with a dot
        guard !domain.hasPrefix(".") && !domain.hasSuffix(".") else { return false }

        // Must not contain invalid characters
        let allowedCharacters = CharacterSet.alphanumerics.union(CharacterSet(charactersIn: ".-"))
        guard domain.unicodeScalars.allSatisfy({ allowedCharacters.contains($0) }) else {
            return false
        }

        // Must not have consecutive dots
        guard !domain.contains("..") else { return false }

        // TLD must be at least 2 characters
        let components = domain.split(separator: ".")
        guard let tld = components.last, tld.count >= 2 else { return false }

        return true
    }

    /// Check if a domain is a duplicate in a list
    static func isDuplicate(_ host: String, in entries: [DomainEntry]) -> Bool {
        let normalized = host.lowercased()
        return entries.contains { $0.host.lowercased() == normalized }
    }
}
