import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { app } from "./app";
import { connectDB } from "./config/db";
import { wsManager } from "./wa/ws.manager";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    // ── Create HTTP server wrapping Express ──────────────────────────────────
    const server = http.createServer(app);

    // ── Attach WebSocket server ──────────────────────────────────────────────
    // URL pattern: ws://host/ws/:resumeId
    const wss = new WebSocketServer({ server, path: undefined });

    wss.on("connection", (ws: WebSocket, req) => {
      // Extract resumeId from URL: /ws/abc123
      const url = req.url || "";
      const match = url.match(/^\/ws\/(.+)$/);

      if (!match) {
        ws.close(1008, "Invalid session path. Use /ws/:resumeId");
        return;
      }

      const resumeId = match[1];
      wsManager.add(resumeId, ws);
      console.log(`[WS] Connected: ${resumeId}`);

      // Keep-alive pings
      const ping = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.ping();
      }, 30000);

      ws.on("close", () => {
        wsManager.remove(resumeId);
        clearInterval(ping);
        console.log(`[WS] Disconnected: ${resumeId}`);
      });

      ws.on("error", (err) => {
        console.error(`[WS] Error on ${resumeId}:`, err.message);
      });
    });

    // ── Start listening ──────────────────────────────────────────────────────
    server.listen(PORT, () => {
      console.log(`[SERVER] Running on port ${PORT}`);
      console.log(`[SERVER] Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`[SERVER] WebSocket ready at ws://localhost:${PORT}/ws/:resumeId`);
    });
  } catch (error) {
    console.error("[SERVER] Failed to start server:", error);
    process.exit(1);
  }
};

startServer();