import { WebSocket } from "ws";

class WebSocketManager {
  private connections = new Map<string, WebSocket>();

  add(sessionId: string, ws: WebSocket): void {
    this.connections.set(sessionId, ws);
  }

  remove(sessionId: string): void {
    this.connections.delete(sessionId);
  }

  send(sessionId: string, payload: object): void {
    const ws = this.connections.get(sessionId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  }

  isConnected(sessionId: string): boolean {
    const ws = this.connections.get(sessionId);
    return !!ws && ws.readyState === WebSocket.OPEN;
  }
}

// Singleton — imported by both the WS route and the latex service
export const wsManager = new WebSocketManager();