import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

const blockSchema = v.object({
  id: v.string(),
  day: v.number(),
  startHour: v.number(),
  startMinute: v.number(),
  endHour: v.number(),
  endMinute: v.number(),
  recurring: v.boolean(),
});

// Get the current user's schedule
export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const schedule = await ctx.db
      .query("schedules")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return schedule;
  },
});

// Create or update the user's schedule
export const update = mutation({
  args: {
    blocks: v.array(blockSchema),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("schedules")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { blocks: args.blocks });
      return existing._id;
    } else {
      // Generate a vault token for the Cloudflare Worker
      const vaultToken = generateVaultToken();
      return await ctx.db.insert("schedules", {
        userId,
        blocks: args.blocks,
        vaultToken,
      });
    }
  },
});

// Set the vault token (called after creating vault in Worker)
export const setVaultToken = mutation({
  args: {
    vaultToken: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("schedules")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { vaultToken: args.vaultToken });
    } else {
      await ctx.db.insert("schedules", {
        userId,
        blocks: [],
        vaultToken: args.vaultToken,
      });
    }
  },
});

// Get vault token for Worker API calls
export const getVaultToken = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const schedule = await ctx.db
      .query("schedules")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return schedule?.vaultToken ?? null;
  },
});

// Check if currently blocking based on schedule
export const isBlocking = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return { blocking: false, endsAt: null };

    const schedule = await ctx.db
      .query("schedules")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!schedule || schedule.blocks.length === 0) {
      return { blocking: false, endsAt: null };
    }

    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;

    for (const block of schedule.blocks) {
      // Check if block applies today
      const blockApplies = block.recurring || block.day === currentDay;

      if (blockApplies && block.day === currentDay) {
        const startTotalMinutes = block.startHour * 60 + block.startMinute;
        const endTotalMinutes = block.endHour * 60 + block.endMinute;

        if (
          currentTotalMinutes >= startTotalMinutes &&
          currentTotalMinutes < endTotalMinutes
        ) {
          // Currently blocking - calculate end time
          const endsAt = new Date(now);
          endsAt.setHours(block.endHour, block.endMinute, 0, 0);
          return { blocking: true, endsAt: endsAt.getTime() };
        }
      }
    }

    return { blocking: false, endsAt: null };
  },
});

// Helper to generate a random vault token
function generateVaultToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}
