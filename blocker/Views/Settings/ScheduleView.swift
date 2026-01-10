import SwiftUI
import EventKit

/// Schedule tab: configure calendar keyword or manual timer scheduling
struct ScheduleView: View {
    @EnvironmentObject var appState: AppState
    @StateObject private var viewModel = ScheduleViewModel()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Status header
                StatusHeaderView()

                // Mode selector
                VStack(alignment: .leading, spacing: 8) {
                    Text("Scheduling mode")
                        .font(.headline)

                    Picker("Mode", selection: $appState.schedule.mode) {
                        ForEach(ScheduleMode.allCases, id: \.self) { mode in
                            Text(mode.displayName).tag(mode)
                        }
                    }
                    .pickerStyle(.segmented)
                    .labelsHidden()
                }

                Divider()

                // Mode-specific content
                switch appState.schedule.mode {
                case .calendarKeyword:
                    calendarKeywordSection
                case .manualTimer:
                    manualTimerSection
                }
            }
            .padding()
        }
        .onAppear {
            viewModel.appState = appState
        }
        .sheet(isPresented: $viewModel.showingCreateEvent) {
            createEventSheet
        }
        .sheet(isPresented: $viewModel.showingPINPrompt) {
            PINPromptView(
                title: "Enter PIN",
                message: "PIN required to start blocking.",
                onVerify: { pin in
                    viewModel.confirmTimerStart(pin: pin)
                    return true
                }
            )
        }
    }

    // MARK: - Calendar Keyword Mode

    private var calendarKeywordSection: some View {
        VStack(alignment: .leading, spacing: 20) {
            // Keyword configuration
            VStack(alignment: .leading, spacing: 8) {
                Text("Keyword")
                    .font(.headline)

                TextField("blocker", text: $appState.schedule.keyword)
                    .textFieldStyle(.roundedBorder)

                Text("Calendar events containing this keyword will trigger blocking.")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            // Matching fields
            VStack(alignment: .leading, spacing: 8) {
                Text("Match keyword in")
                    .font(.headline)

                HStack(spacing: 16) {
                    ForEach(MatchingField.allCases) { field in
                        Toggle(field.displayName, isOn: Binding(
                            get: { viewModel.isFieldSelected(field) },
                            set: { _ in viewModel.toggleField(field) }
                        ))
                        .toggleStyle(.checkbox)
                    }
                }
            }

            // Calendar access
            if !viewModel.hasCalendarAccess {
                calendarAccessRequest
            } else {
                calendarSelection
            }

            Divider()

            // Upcoming events
            upcomingEventsSection
        }
    }

    private var calendarAccessRequest: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Calendar access")
                .font(.headline)

            Text("blocker needs access to your calendars to detect scheduled blocking sessions.")
                .font(.caption)
                .foregroundStyle(.secondary)

            Button("Grant calendar access") {
                Task {
                    await viewModel.requestCalendarAccess()
                }
            }
        }
        .padding()
        .background(.background.secondary)
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }

    private var calendarSelection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Calendars")
                .font(.headline)

            if let calendars = viewModel.calendarService?.availableCalendars {
                ForEach(calendars, id: \.calendarIdentifier) { calendar in
                    Toggle(calendar.title, isOn: Binding(
                        get: { viewModel.isCalendarSelected(calendar.calendarIdentifier) },
                        set: { _ in viewModel.toggleCalendar(calendar.calendarIdentifier) }
                    ))
                    .toggleStyle(.checkbox)
                }
            }
        }
    }

    private var upcomingEventsSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("Upcoming blocker events")
                    .font(.headline)

                Spacer()

                Button("Create event...") {
                    viewModel.prepareCreateEvent()
                }
                .disabled(!viewModel.hasCalendarAccess)
            }

            if viewModel.upcomingEvents.isEmpty {
                ContentUnavailableView {
                    Label("No upcoming events", systemImage: "calendar")
                } description: {
                    Text("No events with the keyword '\(appState.schedule.keyword)' found in the next 7 days.")
                }
                .frame(minHeight: 100)
            } else {
                VStack(spacing: 0) {
                    ForEach(viewModel.upcomingEvents) { event in
                        CalendarEventRow(event: event)
                        if event.id != viewModel.upcomingEvents.last?.id {
                            Divider()
                        }
                    }
                }
                .padding()
                .background(.background.secondary)
                .clipShape(RoundedRectangle(cornerRadius: 8))
            }
        }
    }

    // MARK: - Manual Timer Mode

    private var manualTimerSection: some View {
        VStack(alignment: .leading, spacing: 20) {
            // Quick presets
            VStack(alignment: .leading, spacing: 8) {
                Text("Quick start")
                    .font(.headline)

                HStack(spacing: 12) {
                    ForEach(TimerPreset.allCases) { preset in
                        Button(preset.displayName) {
                            viewModel.startTimer(preset: preset)
                        }
                        .buttonStyle(.bordered)
                        .disabled(appState.runtimeState.isBlockingActive)
                    }
                }
            }

            // Custom duration
            VStack(alignment: .leading, spacing: 8) {
                Text("Custom duration")
                    .font(.headline)

                HStack {
                    Stepper(
                        "\(viewModel.customDurationMinutes) minutes",
                        value: $viewModel.customDurationMinutes,
                        in: 5...480,
                        step: 5
                    )

                    Spacer()

                    Button("Start") {
                        viewModel.startTimer(duration: TimeInterval(viewModel.customDurationMinutes * 60))
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(appState.runtimeState.isBlockingActive)
                }
            }

            // Stop button (if active)
            if appState.runtimeState.isBlockingActive {
                Divider()

                VStack(alignment: .leading, spacing: 8) {
                    Text("Active session")
                        .font(.headline)

                    HStack {
                        VStack(alignment: .leading) {
                            if let remaining = appState.runtimeState.timeRemaining {
                                Text("Time remaining: \(remaining)")
                            }
                            if let reason = appState.runtimeState.activeReason {
                                Text(reason.displayDescription)
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }

                        Spacer()

                        Button("Stop blocking", role: .destructive) {
                            _ = viewModel.stopBlocking()
                        }
                    }
                }
            }
        }
    }

    // MARK: - Create Event Sheet

    private var createEventSheet: some View {
        VStack(spacing: 20) {
            Text("Create blocker event")
                .font(.headline)

            VStack(alignment: .leading, spacing: 16) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Title")
                        .font(.caption)
                        .foregroundStyle(.secondary)

                    TextField("Event title", text: $viewModel.newEventTitle)
                        .textFieldStyle(.roundedBorder)
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text("Start")
                        .font(.caption)
                        .foregroundStyle(.secondary)

                    DatePicker("", selection: $viewModel.newEventStartDate)
                        .labelsHidden()
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text("Duration")
                        .font(.caption)
                        .foregroundStyle(.secondary)

                    Picker("Duration", selection: $viewModel.newEventDuration) {
                        Text("30 minutes").tag(TimeInterval(1800))
                        Text("1 hour").tag(TimeInterval(3600))
                        Text("1.5 hours").tag(TimeInterval(5400))
                        Text("2 hours").tag(TimeInterval(7200))
                        Text("3 hours").tag(TimeInterval(10800))
                    }
                    .labelsHidden()
                }

                if let calendars = viewModel.calendarService?.availableCalendars {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Calendar")
                            .font(.caption)
                            .foregroundStyle(.secondary)

                        Picker("Calendar", selection: $viewModel.newEventCalendar) {
                            ForEach(calendars, id: \.calendarIdentifier) { calendar in
                                Text(calendar.title).tag(calendar.calendarIdentifier)
                            }
                        }
                        .labelsHidden()
                    }
                }
            }

            HStack {
                Button("Cancel") {
                    viewModel.showingCreateEvent = false
                }
                .keyboardShortcut(.cancelAction)

                Spacer()

                Button("Create") {
                    Task {
                        try? await viewModel.createEvent()
                    }
                }
                .keyboardShortcut(.defaultAction)
            }
        }
        .padding()
        .frame(width: 350)
    }
}

#Preview {
    ScheduleView()
        .environmentObject(AppState())
        .frame(width: 500, height: 600)
}
