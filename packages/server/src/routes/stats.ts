import { Hono } from "hono";
import { getStats } from "../services/stats-aggregator.js";

export const statsRouter = new Hono();

statsRouter.get("/api/stats", async (c) => {
  try {
    const stats = await getStats();
    return c.json(stats);
  } catch (error) {
    console.error("[stats] Error:", error);
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
});
