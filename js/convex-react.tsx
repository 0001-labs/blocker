import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string;

if (!convexUrl) {
  throw new Error(
    "Missing VITE_CONVEX_URL environment variable. Run 'bunx convex dev' first."
  );
}

export const convexReact = new ConvexReactClient(convexUrl);
