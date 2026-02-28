import { Server as SocketIOServer } from "socket.io";
import type { Server as HttpServer } from "node:http";
import { env } from "../config/env.js";
import { getRecentTransactions } from "./handlers.js";

export function createSocketServer(httpServer: HttpServer): SocketIOServer {
  const origins = env.FRONTEND_URLS.split(",").map((u) => u.trim());

  const io = new SocketIOServer(httpServer, {
    cors: { origin: origins, methods: ["GET", "POST"] },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log(`[ws] Client connected: ${socket.id}`);

    // Send recent transactions on connect
    socket.emit("recentTransactions", getRecentTransactions(10));

    socket.on("disconnect", () => {
      console.log(`[ws] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}
