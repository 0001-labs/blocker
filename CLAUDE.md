# Blocker

Web app for unbypassable time-blocking using Screen Time with server-controlled credential escrow.

## Stack

**Frontend:**
- Vanilla JavaScript
- DS one (design system via CDN)
- Web Notifications API

**Backend:**
- Cloudflare Workers (TypeScript)
- Cloudflare KV (vault storage)

## Architecture

The server is the escrow agent. It holds your recovery password and only releases it when blocking ends.

```
Frontend (DS one + vanilla JS)
         │
         ▼
Cloudflare Worker
         │
         ▼
Cloudflare KV
```

## API Endpoints

- `POST /vault` — Create or update vault (credentials + schedule)
- `GET /vault?token=xxx` — Get vault state (password always hidden)
- `GET /password?token=xxx` — Get password (403 if blocking)
- `DELETE /vault?token=xxx` — Delete vault (403 if blocking)
- `GET /status` — Health check

## How bypass prevention works

1. User creates dedicated Apple ID for Screen Time recovery
2. User stores Apple ID + password in Blocker (password never viewable in app)
3. When blocking starts: user sets random PIN in Screen Time (mash keys)
4. During blocking: can't bypass (don't know PIN, server refuses to release password)
5. When blocking ends: server releases password, user resets Screen Time

## Local development

**Frontend:**
```bash
bun install
bun run dev
```

**Worker:**
```bash
cd worker
bun install
bun run dev
```

## Deployment

**Frontend:**
```bash
bun run deploy
```

**Worker:**
```bash
cd worker
bun run deploy
```

## Files

```
blocker/
├── index.html            # Landing page
├── app.html              # Main app
├── js/
│   ├── api.js            # API client
│   ├── schedule.js       # Week grid editor
│   └── notifications.js
├── worker/
│   ├── src/index.ts      # Cloudflare Worker
│   ├── wrangler.toml     # Worker config
│   └── package.json
└── SPEC-WEB.md           # Full specification
```

## Domain

- Frontend: `blocker.0001.one` (Cloudflare Pages)
- API: `blocker.0001-labs.workers.dev` (Cloudflare Worker)

## GitHub

Repository: https://github.com/0001-labs/blocker
