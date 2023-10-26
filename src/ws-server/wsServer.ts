// NOTE DO NOT redorder or remove this import, next-auth getSession expects some globals
export * from "./imports"
import { applyWSSHandler } from "@trpc/server/adapters/ws"
import ws from "ws"
import { createContext } from "./context"
import { wsRouter } from "./routers/_app"
import { NEXT_PUBLIC_WS_URL } from "./imports"

let port = NEXT_PUBLIC_WS_URL || ":3001"
port = port.substring(port.lastIndexOf(":") + 1)

const wss = new ws.Server({
  port,
})
const handler = applyWSSHandler({ wss, router: wsRouter, createContext })

wss.on("connection", (ws) => {
  console.log(`WS: ++ Connection (${wss.clients.size})`)
  ws.once("close", () => {
    console.log(`WS: -- Connection (${wss.clients.size})`)
  })
})
console.log(`WS: ✅ WebSocket Server listening on ${NEXT_PUBLIC_WS_URL}`)

process.on("SIGTERM", () => {
  console.log("WS: SIGTERM")
  handler.broadcastReconnectNotification()
  wss.close()
})
