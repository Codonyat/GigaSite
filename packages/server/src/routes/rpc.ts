import { Hono } from "hono";
import { env } from "../config/env.js";

export const rpcRouter = new Hono();

rpcRouter.post("/api/rpc", async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(env.RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("[rpc] Proxy error:", error);
    return c.json({ error: "RPC proxy failed" }, 502);
  }
});
