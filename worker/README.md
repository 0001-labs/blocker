# Blocker Recovery Worker

Cloudflare Worker that sends scheduled recovery emails containing the Screen Time Apple ID password when blocking sessions end.

## Setup

### 1. Install dependencies

```bash
cd worker
npm install
```

### 2. Create KV namespace

```bash
npx wrangler kv:namespace create SCHEDULED_EMAILS
```

Copy the output ID and update `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "SCHEDULED_EMAILS"
id = "your-actual-namespace-id"
```

### 3. Set secrets

```bash
# Resend API key (get from https://resend.com)
npx wrangler secret put RESEND_API_KEY

# Update FROM_EMAIL in wrangler.toml to your verified domain
```

### 4. Deploy

```bash
npm run deploy
```

## API

### Schedule an email

```bash
POST /schedule
Content-Type: application/json

{
  "recipientEmail": "user@example.com",
  "password": "the-apple-id-password",
  "sendAtTimestamp": 1704067200000
}
```

Response:
```json
{
  "success": true,
  "emailId": "uuid",
  "scheduledFor": "2024-01-01T00:00:00.000Z"
}
```

### Cancel a scheduled email

```bash
DELETE /schedule/{emailId}
```

### Check status

```bash
GET /status
```

Response:
```json
{
  "status": "ok",
  "pendingEmails": 1,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## How it works

1. The macOS app calls `/schedule` when a blocking session starts
2. The cron trigger runs every minute checking for emails due to be sent
3. When `sendAt` time passes, the worker sends the recovery email via Resend
4. The email contains the Apple ID password needed to reset Screen Time passcode

## Local development

```bash
npm run dev
```

This starts a local server at `http://localhost:8787`.
