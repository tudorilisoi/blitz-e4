import { createServer } from "http"
import { Server as WebSocketServer } from "ws"
import next from "next"
import { getBlitzApp } from "@blitzjs/next"
import * as http from "http"

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

void app.prepare().then(() => {
  const server = createServer((req, res) => {
    // Handle HTTP requests (Next.js routes)
    void handle(req, res)
  })

  // WebSocket server for production
  let wss: WebSocketServer | undefined
  if (!dev) {
    wss = new WebSocketServer({ noServer: true })

    wss.on("connection", (ws) => {
      ws.on("message", (message) => {
        console.log("Received:", message.toString())
      })

      ws.send("Hello from WebSocket server on /ws-live")
    })

    server.on("upgrade", (req, socket, head) => {
      if (req.url?.startsWith("/ws-live") && wss) {
        wss.handleUpgrade(req, socket, head, (ws) => {
          wss.emit("connection", ws, req)
        })
      } else {
        // void handle(req, socket as any, head)
        socket.destroy()
      }
    })
  }

  // WebSocket server for development (on a different port)
  if (dev) {
    const devWebSocketServer = http.createServer()
    const devWss = new WebSocketServer({ server: devWebSocketServer })

    devWss.on("connection", (ws) => {
      ws.on("message", (message) => {
        console.log("Received:", message.toString())
      })

      ws.send("Hello from WebSocket server on a separate port")
    })

    devWebSocketServer.listen(3001, () => {
      console.log("Dev WebSocket server listening on ws://localhost:4000")
    })
  }

  server.listen(3000, () => {
    console.log("> Ready on http://localhost:3000")
  })
})
