import { convexAuth } from "@convex-dev/auth/server";
import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";

// Custom Email provider with OTP codes
const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY!,
  maxAge: 60 * 15, // 15 minutes
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const sanitizedEmail = email.trim().toLowerCase();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      throw new Error(
        JSON.stringify({
          statusCode: 422,
          name: "validation_error",
          message: `Invalid email format: "${email}".`,
        })
      );
    }

    // Send email via Resend
    const resend = new ResendAPI(provider.apiKey);

    const { error } = await resend.emails.send({
      from: "Blocker <onboarding@resend.dev>",
      to: sanitizedEmail,
      subject: "Your Blocker sign-in code",
      text: `Your sign-in code is: ${token}\n\nThis code expires in 15 minutes.`,
    });

    if (error) {
      throw new Error(JSON.stringify(error));
    }

    console.log(`✅ Email sent to ${sanitizedEmail}`);
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [ResendOTP],
});
