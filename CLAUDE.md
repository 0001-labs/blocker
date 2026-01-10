# Blocker

macOS/iOS app for time-blocking and website filtering.

## Stack

- SwiftUI
- Swift 5.9+
- Combine framework
- EventKit (calendar integration)
- UserDefaults/Codable (persistence)

## Architecture

- **Models:** Rules, Schedule, LockState, DomainEntry, RuntimeState
- **Services:** PersistenceService, CalendarService, Scheduler, BlockingEngine
- **ViewModels:** AppState, RulesViewModel, ScheduleViewModel, LockViewModel
- **Views:** Settings UI, MenuBar component

## Features

1. Dual blocking modes (blocklist/allowlist)
2. Calendar-based scheduling (keyword matching)
3. Manual timer with presets (25m, 60m, 90m, 2h)
4. PIN protection during active sessions
5. Auto-persistence with 0.5s debounce

## Platform

macOS/iOS native (no npm/Bun scripts)
