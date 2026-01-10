import SwiftUI

/// Displays an upcoming calendar event
struct CalendarEventRow: View {
    let event: UpcomingEvent

    var body: some View {
        HStack {
            // Active indicator
            Circle()
                .fill(event.isActive ? .red : .clear)
                .frame(width: 8, height: 8)

            VStack(alignment: .leading, spacing: 2) {
                Text(event.title)
                    .font(.body)
                    .lineLimit(1)

                HStack(spacing: 4) {
                    Text(event.formattedDateRange)
                        .font(.caption)
                        .foregroundStyle(.secondary)

                    Text("•")
                        .font(.caption)
                        .foregroundStyle(.secondary)

                    Text(event.calendarName)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }

            Spacer()

            if event.isActive {
                Text("Active")
                    .font(.caption)
                    .foregroundStyle(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(.red)
                    .clipShape(Capsule())
            }
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    VStack {
        CalendarEventRow(event: UpcomingEvent(
            id: "1",
            title: "blocker: Deep work",
            startDate: Date(),
            endDate: Date().addingTimeInterval(3600),
            calendarName: "Work"
        ))

        CalendarEventRow(event: UpcomingEvent(
            id: "2",
            title: "blocker: Focus time",
            startDate: Date().addingTimeInterval(7200),
            endDate: Date().addingTimeInterval(10800),
            calendarName: "Personal"
        ))
    }
    .padding()
}
