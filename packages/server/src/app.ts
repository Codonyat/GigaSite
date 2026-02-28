import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.js";
import { statsRouter } from "./routes/stats.js";
import { rpcRouter } from "./routes/rpc.js";
import { subgraphRouter } from "./routes/subgraph.js";
import { priceRouter } from "./routes/price.js";

export function createApp() {
  const app = new Hono();

  const origins = env.FRONTEND_URLS.split(",").map((u) => u.trim());
  app.use("*", cors({ origin: origins }));

  app.route("/", healthRouter);
  app.route("/", statsRouter);
  app.route("/", rpcRouter);
  app.route("/", subgraphRouter);
  app.route("/", priceRouter);

  return app;
}
