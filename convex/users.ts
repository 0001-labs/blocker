import { query } from "./_generated/server";
import { auth } from "./auth";

// Get current authenticated user with email
export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    // Get email from authAccounts table (where email OTP stores it)
    const authAccount = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .first();

    return {
      ...user,
      email: authAccount?.providerAccountId ?? null,
    };
  },
});
