globalThis.__BLITZ_SESSION_COOKIE_PREFIX = process.env.__BLITZ_SESSION_COOKIE_PREFIX
import { authPlugin } from "src/blitz-server"
import { createContext } from "./context"
import { appRouter } from "./routers/_app"
import { applyWSSHandler } from "@trpc/server/adapters/ws"
import ws from "ws"

//fake blitz-auth
authPlugin && console.log("authPlugin imported from main app")

const wss = new ws.Server({
  port: 3001,
})
const handler = applyWSSHandler({ wss, router: appRouter, createContext })

wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`)
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`)
  })
})
console.log("✅ WebSocket Server listening on ws://localhost:3001")

process.on("SIGTERM", () => {
  console.log("SIGTERM")
  handler.broadcastReconnectNotification()
  wss.close()
})
