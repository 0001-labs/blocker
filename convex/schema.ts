import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const blockSchema = v.object({
  id: v.string(),
  day: v.number(), // 0-6 (Sun-Sat)
  startHour: v.number(),
  startMinute: v.number(),
  endHour: v.number(),
  endMinute: v.number(),
  recurring: v.boolean(),
});

export default defineSchema({
  ...authTables,

  schedules: defineTable({
    userId: v.id("users"),
    blocks: v.array(blockSchema),
    vaultToken: v.string(), // Token for Cloudflare Worker API
  }).index("by_user", ["userId"]),
});
