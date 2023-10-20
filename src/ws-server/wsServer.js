"use strict"
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        var desc = Object.getOwnPropertyDescriptor(m, k)
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k]
            },
          }
        }
        Object.defineProperty(o, k2, desc)
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
        __createBinding(exports, m, p)
  }
Object.defineProperty(exports, "__esModule", { value: true })
// NOTE DO NOT redorder or remove this import, next-auth getSession expects some globals
__exportStar(require("./imports"), exports)
var ws_1 = require("@trpc/server/adapters/ws")
var ws_2 = require("ws")
var context_1 = require("./context")
var _app_1 = require("./routers/_app")
var imports_1 = require("./imports")
var port = imports_1.NEXT_PUBLIC_WS_URL || ":3001"
port = port.substring(port.lastIndexOf(":") + 1)
var wss = new ws_2.default.Server({
  port: port,
})
var handler = (0, ws_1.applyWSSHandler)({
  wss: wss,
  router: _app_1.wsRouter,
  createContext: context_1.createContext,
})
wss.on("connection", function (ws) {
  console.log("++ Connection (".concat(wss.clients.size, ")"))
  ws.once("close", function () {
    console.log("-- Connection (".concat(wss.clients.size, ")"))
  })
})
console.log("\u2705 WebSocket Server listening on ".concat(imports_1.NEXT_PUBLIC_WS_URL))
process.on("SIGTERM", function () {
  console.log("SIGTERM")
  handler.broadcastReconnectNotification()
  wss.close()
})
