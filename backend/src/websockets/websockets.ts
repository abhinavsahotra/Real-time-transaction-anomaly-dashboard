import { WebSocketServer } from "ws";

let wss: WebSocketServer;

export function initWebSocket(server: any){
    wss = new WebSocketServer({ server  });

    wss.on("connection", (ws) => {
        console.log("Admin connected");

        ws.send(JSON.stringify({
            type: "CONNECTED",
            "message": "WebSocket connected"
        }))

        ws.on("close", () => {
            console.log("Admin disconnected")
        })
    })
}

export function broadcastTransaction(transaction: any) {
  if (!wss) return;

  const message = JSON.stringify({
    type: "TRANSACTION_UPDATE",
    data: transaction
  });

  wss.clients.forEach((client: any) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}