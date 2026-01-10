/**
 * Blocker Recovery Worker
 *
 * Schedules and sends recovery emails containing the Screen Time Apple ID password
 * at the specified time when a blocking session ends.
 */

export interface Env {
  SCHEDULED_EMAILS: KVNamespace;
  RESEND_API_KEY: string;
  FROM_EMAIL: string;
}

interface ScheduledEmail {
  id: string;
  recipientEmail: string;
  password: string;
  sendAt: number; // Unix timestamp in milliseconds
  createdAt: number;
}

interface ScheduleRequest {
  recipientEmail: string;
  password: string;
  sendAtTimestamp: number; // Unix timestamp in milliseconds
}

// KV key prefix for scheduled emails
const EMAIL_PREFIX = "email:";
// KV key for the index of all pending emails
const INDEX_KEY = "pending_emails_index";

export default {
  /**
   * HTTP handler for scheduling emails
   */
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // POST /schedule - Schedule a new recovery email
      if (url.pathname === "/schedule" && request.method === "POST") {
        const body = await request.json() as ScheduleRequest;

        if (!body.recipientEmail || !body.password || !body.sendAtTimestamp) {
          return new Response(
            JSON.stringify({ error: "Missing required fields: recipientEmail, password, sendAtTimestamp" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const emailId = crypto.randomUUID();
        const scheduledEmail: ScheduledEmail = {
          id: emailId,
          recipientEmail: body.recipientEmail,
          password: body.password,
          sendAt: body.sendAtTimestamp,
          createdAt: Date.now(),
        };

        // Store the scheduled email
        await env.SCHEDULED_EMAILS.put(
          EMAIL_PREFIX + emailId,
          JSON.stringify(scheduledEmail),
          { expirationTtl: 60 * 60 * 24 * 7 } // 7 days TTL
        );

        // Update the index
        await addToIndex(env, emailId);

        const sendAtDate = new Date(body.sendAtTimestamp);
        console.log(`Scheduled email ${emailId} for ${sendAtDate.toISOString()}`);

        return new Response(
          JSON.stringify({
            success: true,
            emailId,
            scheduledFor: sendAtDate.toISOString()
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // DELETE /schedule/:id - Cancel a scheduled email
      if (url.pathname.startsWith("/schedule/") && request.method === "DELETE") {
        const emailId = url.pathname.replace("/schedule/", "");

        await env.SCHEDULED_EMAILS.delete(EMAIL_PREFIX + emailId);
        await removeFromIndex(env, emailId);

        return new Response(
          JSON.stringify({ success: true, cancelled: emailId }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // GET /status - Check worker status and pending emails count
      if (url.pathname === "/status" && request.method === "GET") {
        const index = await getIndex(env);
        return new Response(
          JSON.stringify({
            status: "ok",
            pendingEmails: index.length,
            timestamp: new Date().toISOString()
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } catch (error) {
      console.error("Error handling request:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  },

  /**
   * Cron handler - runs every minute to check for emails to send
   */
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log("Cron triggered at", new Date().toISOString());

    const now = Date.now();
    const index = await getIndex(env);

    for (const emailId of index) {
      const emailData = await env.SCHEDULED_EMAILS.get(EMAIL_PREFIX + emailId);

      if (!emailData) {
        // Email was deleted, remove from index
        await removeFromIndex(env, emailId);
        continue;
      }

      const email: ScheduledEmail = JSON.parse(emailData);

      // Check if it's time to send
      if (email.sendAt <= now) {
        console.log(`Sending recovery email ${emailId}`);

        try {
          await sendRecoveryEmail(env, email);

          // Remove from KV after successful send
          await env.SCHEDULED_EMAILS.delete(EMAIL_PREFIX + emailId);
          await removeFromIndex(env, emailId);

          console.log(`Successfully sent and removed email ${emailId}`);
        } catch (error) {
          console.error(`Failed to send email ${emailId}:`, error);
          // Keep in KV for retry on next cron run
        }
      }
    }
  },
};

/**
 * Send the recovery email via Resend
 */
async function sendRecoveryEmail(env: Env, email: ScheduledEmail): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: email.recipientEmail,
      subject: "Blocker: Your Screen Time Recovery Password",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #1a1a1a;">
            Your blocking session has ended
          </h1>
          <p style="font-size: 16px; color: #4a4a4a; line-height: 1.6; margin-bottom: 24px;">
            Here is your Screen Time Apple ID password to unlock your device:
          </p>
          <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <code style="font-size: 18px; font-family: 'SF Mono', Monaco, 'Courier New', monospace; word-break: break-all; color: #1a1a1a;">
              ${escapeHtml(email.password)}
            </code>
          </div>
          <p style="font-size: 14px; color: #8a8a8a; line-height: 1.5;">
            Go to Settings → Screen Time → Change Screen Time Passcode → Forgot Passcode? and enter your Apple ID credentials to reset your passcode.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;">
          <p style="font-size: 12px; color: #8a8a8a;">
            This email was sent by Blocker. If you didn't schedule this, you can safely ignore it.
          </p>
        </div>
      `,
      text: `Your blocking session has ended.\n\nYour Screen Time Apple ID password: ${email.password}\n\nGo to Settings → Screen Time → Change Screen Time Passcode → Forgot Passcode? and enter your Apple ID credentials to reset your passcode.`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error: ${response.status} - ${errorText}`);
  }
}

/**
 * Get the index of pending email IDs
 */
async function getIndex(env: Env): Promise<string[]> {
  const indexData = await env.SCHEDULED_EMAILS.get(INDEX_KEY);
  return indexData ? JSON.parse(indexData) : [];
}

/**
 * Add an email ID to the index
 */
async function addToIndex(env: Env, emailId: string): Promise<void> {
  const index = await getIndex(env);
  if (!index.includes(emailId)) {
    index.push(emailId);
    await env.SCHEDULED_EMAILS.put(INDEX_KEY, JSON.stringify(index));
  }
}

/**
 * Remove an email ID from the index
 */
async function removeFromIndex(env: Env, emailId: string): Promise<void> {
  const index = await getIndex(env);
  const newIndex = index.filter(id => id !== emailId);
  await env.SCHEDULED_EMAILS.put(INDEX_KEY, JSON.stringify(newIndex));
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
