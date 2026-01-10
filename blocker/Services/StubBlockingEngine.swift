import Foundation
import os.log

/// Stub implementation of BlockingEngine for development and testing
/// Logs all operations to console without actually blocking websites
final class StubBlockingEngine: BlockingEngine, ObservableObject {

    private let logger = Logger(subsystem: "com.0001labs.blocker", category: "StubBlockingEngine")

    @Published private(set) var isActive: Bool = false

    func activate(rules: Rules) async throws {
        logger.info("=== STUB: Activating blocking ===")
        logger.info("Mode: \(rules.mode.rawValue)")

        switch rules.mode {
        case .blocklist:
            logger.info("Blocking \(rules.restricted.count) restricted domains:")
            for entry in rules.restricted {
                logger.info("  - \(entry.host) (\(entry.title ?? "no title"))")
            }
        case .allowlist:
            logger.info("Allowing only \(rules.allowed.count) domains:")
            for entry in rules.allowed {
                logger.info("  + \(entry.host) (\(entry.title ?? "no title"))")
            }
        }

        logger.info("=================================")

        isActive = true
    }

    func deactivate() async throws {
        logger.info("=== STUB: Deactivating blocking ===")
        logger.info("All websites are now accessible")
        logger.info("===================================")

        isActive = false
    }
}

// MARK: - Future Implementation Notes

/*
 ## NetworkExtension Content Filter Approach

 To implement actual website blocking, you would need to:

 1. Create a System Extension target with NEFilterDataProvider
 2. Add the "com.apple.developer.networking.networkextension" entitlement
 3. Configure the network extension in Info.plist
 4. Implement NEFilterDataProvider to inspect and block traffic

 Example structure:

 ```swift
 class ContentFilterProvider: NEFilterDataProvider {
     override func startFilter(completionHandler: @escaping (Error?) -> Void) {
         // Initialize filter
     }

     override func handleNewFlow(_ flow: NEFilterFlow) -> NEFilterNewFlowVerdict {
         guard let browserFlow = flow as? NEFilterBrowserFlow,
               let url = browserFlow.url else {
             return .allow()
         }

         // Check URL against rules
         if shouldBlock(url) {
             return .drop()
         }

         return .allow()
     }
 }
 ```

 ## Configuration Profile Approach

 Alternatively, generate a .mobileconfig with WebContentFilter payload:

 ```xml
 <dict>
     <key>PayloadType</key>
     <string>com.apple.webcontent-filter</string>
     <key>FilterType</key>
     <string>BuiltIn</string>
     <key>BlacklistedURLs</key>
     <array>
         <string>youtube.com</string>
     </array>
 </dict>
 ```

 Limitations:
 - Requires user to manually install the profile
 - Cannot be dynamically updated without reinstalling
 - May require MDM for full functionality
 */
