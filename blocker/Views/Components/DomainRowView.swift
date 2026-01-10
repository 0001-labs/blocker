import SwiftUI

/// A single row in a domain list
struct DomainRowView: View {
    let entry: DomainEntry

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(entry.host)
                    .font(.body)

                if let title = entry.title {
                    Text(title)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }

            Spacer()
        }
        .contentShape(Rectangle())
    }
}

#Preview {
    VStack {
        DomainRowView(entry: DomainEntry(host: "youtube.com", title: "Video streaming"))
        DomainRowView(entry: DomainEntry(host: "twitter.com"))
    }
    .padding()
}
