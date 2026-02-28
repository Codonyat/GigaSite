import { Hono } from "hono";
import { env } from "../config/env.js";

export const subgraphRouter = new Hono();

subgraphRouter.post("/api/subgraph", async (c) => {
  if (!env.SUBGRAPH_URL) {
    return c.json({ error: "Subgraph not configured" }, 503);
  }

  try {
    const body = await c.req.json();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (env.SUBGRAPH_API_TOKEN) {
      headers["Authorization"] = `Bearer ${env.SUBGRAPH_API_TOKEN}`;
    }

    const response = await fetch(env.SUBGRAPH_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("[subgraph] Proxy error:", error);
    return c.json({ error: "Subgraph proxy failed" }, 502);
  }
});
