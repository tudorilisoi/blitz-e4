// NOTE DO NOT redorder or remove this import, next-auth getSession expects some globals
export * from "./imports"
import { applyWSSHandler } from "@trpc/server/adapters/ws"
import ws from "ws"
import { createContext } from "./context"
import { wsRouter } from "./routers/_app"
import { NEXT_PUBLIC_WS_URL } from "./imports"

const wss = new ws.Server({
  port: 3001,
})
const handler = applyWSSHandler({ wss, router: wsRouter, createContext })

wss.on("connection", (ws) => {
  console.log(`++ Connection (${wss.clients.size})`)
  ws.once("close", () => {
    console.log(`-- Connection (${wss.clients.size})`)
  })
})
console.log(`✅ WebSocket Server listening on ${NEXT_PUBLIC_WS_URL}`)

process.on("SIGTERM", () => {
  console.log("SIGTERM")
  handler.broadcastReconnectNotification()
  wss.close()
})
