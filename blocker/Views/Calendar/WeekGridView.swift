import SwiftUI

/// A week calendar grid view with drag-to-create block sessions
struct WeekGridView: View {
    @Binding var schedule: BlockSchedule
    @State private var dragStart: GridPosition?
    @State private var dragCurrent: GridPosition?
    @State private var selectedSession: BlockSession?

    let hourHeight: CGFloat = 50
    let dayWidth: CGFloat = 80
    let timeColumnWidth: CGFloat = 50
    let headerHeight: CGFloat = 40

    // Hours to display (6 AM to 11 PM by default)
    let startHour = 6
    let endHour = 23

    var body: some View {
        VStack(spacing: 0) {
            // Day headers
            dayHeaderRow

            // Scrollable time grid
            ScrollView(.vertical, showsIndicators: true) {
                ZStack(alignment: .topLeading) {
                    // Background grid
                    gridBackground

                    // Existing sessions
                    existingSessionsLayer

                    // Current drag selection
                    dragSelectionLayer
                }
                .frame(height: CGFloat(endHour - startHour) * hourHeight)
            }
        }
        .background(Color(NSColor.windowBackgroundColor))
    }

    // MARK: - Day Header Row

    private var dayHeaderRow: some View {
        HStack(spacing: 0) {
            // Empty corner for time column
            Text("")
                .frame(width: timeColumnWidth, height: headerHeight)
                .background(Color(NSColor.controlBackgroundColor))

            // Day headers
            ForEach(1...7, id: \.self) { day in
                let adjustedDay = day == 7 ? 1 : day + 1 // Convert to Sunday=1 format
                Text(shortDayName(for: adjustedDay))
                    .font(.system(size: 12, weight: .medium))
                    .frame(width: dayWidth, height: headerHeight)
                    .background(isToday(adjustedDay) ? Color.accentColor.opacity(0.2) : Color(NSColor.controlBackgroundColor))
            }
        }
        .border(Color(NSColor.separatorColor), width: 0.5)
    }

    // MARK: - Grid Background

    private var gridBackground: some View {
        HStack(spacing: 0) {
            // Time labels column
            VStack(spacing: 0) {
                ForEach(startHour..<endHour, id: \.self) { hour in
                    Text(formatHour(hour))
                        .font(.system(size: 10, weight: .regular))
                        .foregroundColor(.secondary)
                        .frame(width: timeColumnWidth, height: hourHeight, alignment: .topTrailing)
                        .padding(.trailing, 4)
                }
            }

            // Day columns with grid lines
            ForEach(1...7, id: \.self) { dayIndex in
                let adjustedDay = dayIndex == 7 ? 1 : dayIndex + 1
                dayColumn(for: adjustedDay, index: dayIndex)
            }
        }
    }

    private func dayColumn(for day: Int, index: Int) -> some View {
        ZStack(alignment: .top) {
            // Hour grid lines
            VStack(spacing: 0) {
                ForEach(startHour..<endHour, id: \.self) { hour in
                    Rectangle()
                        .fill(Color.clear)
                        .frame(width: dayWidth, height: hourHeight)
                        .border(Color(NSColor.separatorColor).opacity(0.3), width: 0.5)
                }
            }

            // Drag gesture overlay
            Color.clear
                .contentShape(Rectangle())
                .gesture(
                    DragGesture(minimumDistance: 5)
                        .onChanged { value in
                            handleDragChanged(value: value, day: day)
                        }
                        .onEnded { value in
                            handleDragEnded(value: value, day: day)
                        }
                )
        }
    }

    // MARK: - Existing Sessions Layer

    private var existingSessionsLayer: some View {
        ForEach(schedule.sessions) { session in
            sessionBlock(for: session)
        }
    }

    private func sessionBlock(for session: BlockSession) -> some View {
        let dayIndex = session.dayOfWeek == 1 ? 7 : session.dayOfWeek - 1
        let xOffset = timeColumnWidth + CGFloat(dayIndex - 1) * dayWidth
        let yOffset = CGFloat(session.startHour - startHour) * hourHeight + CGFloat(session.startMinute) / 60.0 * hourHeight
        let height = CGFloat(session.duration) / 60.0 * hourHeight

        return RoundedRectangle(cornerRadius: 4)
            .fill(session.isActiveNow() ? Color.red.opacity(0.8) : Color.accentColor.opacity(0.7))
            .frame(width: dayWidth - 4, height: max(height, 20))
            .overlay(
                VStack(alignment: .leading, spacing: 2) {
                    Text(session.formattedTimeRange)
                        .font(.system(size: 9, weight: .medium))
                        .foregroundColor(.white)
                }
                .padding(4),
                alignment: .topLeading
            )
            .offset(x: xOffset + 2, y: yOffset)
            .onTapGesture {
                selectedSession = session
            }
            .contextMenu {
                Button(role: .destructive) {
                    schedule.remove(id: session.id)
                } label: {
                    Label("Delete", systemImage: "trash")
                }
            }
    }

    // MARK: - Drag Selection Layer

    private var dragSelectionLayer: some View {
        Group {
            if let start = dragStart, let current = dragCurrent {
                let minHour = min(start.hour, current.hour)
                let maxHour = max(start.hour, current.hour) + 1
                let dayIndex = start.day == 1 ? 7 : start.day - 1
                let xOffset = timeColumnWidth + CGFloat(dayIndex - 1) * dayWidth
                let yOffset = CGFloat(minHour - startHour) * hourHeight
                let height = CGFloat(maxHour - minHour) * hourHeight

                // Check for overlap
                let tempSession = BlockSession(dayOfWeek: start.day, startHour: minHour, endHour: maxHour)
                let hasOverlap = schedule.hasOverlap(with: tempSession)
                let fillColor = hasOverlap ? Color.red.opacity(0.4) : Color.accentColor.opacity(0.4)
                let strokeColor = hasOverlap ? Color.red : Color.accentColor

                RoundedRectangle(cornerRadius: 4)
                    .fill(fillColor)
                    .frame(width: dayWidth - 4, height: height)
                    .overlay(
                        RoundedRectangle(cornerRadius: 4)
                            .stroke(strokeColor, lineWidth: 2)
                    )
                    .offset(x: xOffset + 2, y: yOffset)
            }
        }
    }

    // MARK: - Drag Handling

    private func handleDragChanged(value: DragGesture.Value, day: Int) {
        let hour = hourFromY(value.location.y)

        if dragStart == nil {
            let startHourValue = hourFromY(value.startLocation.y)
            dragStart = GridPosition(day: day, hour: startHourValue)
        }

        dragCurrent = GridPosition(day: day, hour: hour)
    }

    private func handleDragEnded(value: DragGesture.Value, day: Int) {
        guard let start = dragStart, let current = dragCurrent else {
            resetDrag()
            return
        }

        let minHour = min(start.hour, current.hour)
        let maxHour = max(start.hour, current.hour) + 1

        // Create new session (minimum 1 hour)
        if maxHour > minHour {
            let session = BlockSession(
                dayOfWeek: start.day,
                startHour: minHour,
                endHour: maxHour
            )
            schedule.add(session)
        }

        resetDrag()
    }

    private func resetDrag() {
        dragStart = nil
        dragCurrent = nil
    }

    private func hourFromY(_ y: CGFloat) -> Int {
        let hour = startHour + Int(y / hourHeight)
        return max(startHour, min(endHour - 1, hour))
    }

    // MARK: - Helpers

    private func shortDayName(for day: Int) -> String {
        let formatter = DateFormatter()
        formatter.locale = Locale.current
        return formatter.shortWeekdaySymbols[day - 1]
    }

    private func isToday(_ day: Int) -> Bool {
        let today = Calendar.current.component(.weekday, from: Date())
        return today == day
    }

    private func formatHour(_ hour: Int) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        var components = DateComponents()
        components.hour = hour
        if let date = Calendar.current.date(from: components) {
            return formatter.string(from: date)
        }
        return "\(hour):00"
    }
}

/// Position in the grid
private struct GridPosition {
    let day: Int // 1-7 (Sunday = 1)
    let hour: Int // 0-23
}

// MARK: - Preview

#Preview {
    WeekGridView(schedule: .constant(BlockSchedule(sessions: [
        BlockSession(dayOfWeek: 2, startHour: 9, endHour: 12),
        BlockSession(dayOfWeek: 4, startHour: 14, endHour: 16)
    ])))
    .frame(width: 650, height: 500)
}
