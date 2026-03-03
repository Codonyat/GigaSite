import { createServer } from "node:http";
import { getRequestListener } from "@hono/node-server";
import { createApp } from "./app.js";
import { createSocketServer } from "./websocket/index.js";
import { createChainListener } from "./services/chain-listener.js";
import { handleContractEvent } from "./websocket/handlers.js";
import { getStats } from "./services/stats-aggregator.js";
import { env } from "./config/env.js";

const app = createApp();

const httpServer = createServer(getRequestListener(app.fetch));
httpServer.listen(env.PORT, () => {
  console.log(`[server] Listening on http://localhost:${env.PORT}`);
});

const io = createSocketServer(httpServer);

// Start chain listener for real-time events
const chainListener = createChainListener((eventName, log) => {
  handleContractEvent(io, eventName, log);
});

// Fetch deployment time for day tracker, then start it
getStats()
  .then((stats) => {
    // deploymentTime is not in stats, but we can derive it from currentDay.
    // For now, use a simple interval-based stats refresh that also emits to WS clients.
    setInterval(async () => {
      try {
        const freshStats = await getStats();
        io.emit("statsUpdate", freshStats);
      } catch (err) {
        console.error("[stats-refresh] Error:", err);
      }
    }, 15_000);

    console.log("[server] Stats aggregator initialized");
  })
  .catch((err) => {
    console.error("[server] Failed to initialize stats:", err);
  });

// Graceful shutdown
function shutdown() {
  console.log("[server] Shutting down...");
  chainListener.cleanup();
  io.close();
  httpServer.close(() => {
    console.log("[server] Closed");
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
