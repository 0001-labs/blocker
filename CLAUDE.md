# Blocker

macOS app for unbypassable time-blocking using Screen Time with delayed recovery.

## Stack

- SwiftUI
- Swift 5.9+
- Combine framework
- UserDefaults/Codable (persistence)
- Cloudflare Workers (delayed email delivery)
- Resend (email API)

## Architecture

- **Models:** BlockSession, Schedule, LockState, RuntimeState
- **Services:** PersistenceService, Scheduler, RecoveryService, NotificationService, BlockingEngine
- **ViewModels:** AppState
- **Views:** ScheduleView, RecoveryView, SetupGuideView, WeekGridView

## Features

1. Weekly schedule with drag-to-create blocking sessions (no overlaps)
2. Bypass-prevention via dedicated Apple ID for Screen Time recovery
3. Password stored locally, emailed only when blocking ends
4. Local notifications for blocking start/end
5. Setup guide for creating dedicated Apple ID
6. Auto-persistence with 0.5s debounce

## How bypass prevention works

1. User creates dedicated Apple ID for Screen Time recovery
2. User stores Apple ID + password in app (password never viewable)
3. When blocking starts: user sets random PIN in Screen Time (mash keys)
4. During blocking: can't bypass (don't know PIN, password not sent yet)
5. When blocking ends: Cloudflare Worker emails credentials to user's regular email
6. User resets Screen Time using "Forgot Passcode?" with the credentials

## Cloudflare Worker

Deployed to: `https://blocker.0001-labs.workers.dev`

Endpoints:
- `POST /schedule` - Schedule recovery email delivery
- `DELETE /schedule/:id` - Cancel scheduled email
- `GET /status` - Health check

Requires `RESEND_API_KEY` secret to be configured.

## Platform

macOS 14+ native

## GitHub

Repository: https://github.com/0001-labs/blocker
