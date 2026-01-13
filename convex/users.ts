import { query } from "./_generated/server";
import { auth } from "./auth";

// Get current authenticated user
export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    return user;
  },
});
