import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Admin email - only this user can access admin functions
const ADMIN_EMAIL = "jaa90@icloud.com";

// Helper to get current user's email
async function getCurrentUserEmail(ctx: any): Promise<string | null> {
  const userId = await auth.getUserId(ctx);
  if (!userId) return null;

  const authAccount = await ctx.db
    .query("authAccounts")
    .withIndex("userIdAndProvider", (q: any) => q.eq("userId", userId))
    .first();

  return authAccount?.providerAccountId ?? null;
}

// Check if current user is admin
export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const email = await getCurrentUserEmail(ctx);
    console.log("isAdmin check - email:", email, "expected:", ADMIN_EMAIL, "match:", email === ADMIN_EMAIL);
    return email === ADMIN_EMAIL;
  },
});

// List all users (admin only)
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const email = await getCurrentUserEmail(ctx);
    if (email !== ADMIN_EMAIL) {
      throw new Error("Unauthorized: Admin access required");
    }

    // Get all users
    const users = await ctx.db.query("users").collect();

    // Get auth accounts for emails
    const authAccounts = await ctx.db.query("authAccounts").collect();

    // Get schedules for vault tokens
    const schedules = await ctx.db.query("schedules").collect();

    // Map users with their email and vault info
    return users.map((user) => {
      const authAccount = authAccounts.find((a) => a.userId === user._id);
      const schedule = schedules.find((s) => s.userId === user._id);

      return {
        id: user._id,
        email: authAccount?.providerAccountId ?? "Unknown",
        createdAt: user._creationTime,
        hasSchedule: !!schedule,
        vaultToken: schedule?.vaultToken ?? null,
        blockCount: schedule?.blocks?.length ?? 0,
      };
    });
  },
});

// Get user's vault token (admin only)
export const getUserVaultToken = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const email = await getCurrentUserEmail(ctx);
    if (email !== ADMIN_EMAIL) {
      throw new Error("Unauthorized: Admin access required");
    }

    const schedule = await ctx.db
      .query("schedules")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    return schedule?.vaultToken ?? null;
  },
});

// Delete user's schedule data (admin only)
export const deleteUserSchedule = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const email = await getCurrentUserEmail(ctx);
    if (email !== ADMIN_EMAIL) {
      throw new Error("Unauthorized: Admin access required");
    }

    const schedule = await ctx.db
      .query("schedules")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (schedule) {
      await ctx.db.delete(schedule._id);
      return { deleted: true, vaultToken: schedule.vaultToken };
    }

    return { deleted: false, vaultToken: null };
  },
});
