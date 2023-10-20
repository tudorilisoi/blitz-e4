"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.NEXT_PUBLIC_WS_URL = exports.NEXT_PUBLIC_APP_URL = void 0
globalThis.__BLITZ_SESSION_COOKIE_PREFIX = process.env.__BLITZ_SESSION_COOKIE_PREFIX
var env_1 = require("@next/env")
var blitz_server_1 = require("src/blitz-server")
console.log("IMPORTING DATA FROM blitz-auth")
var projectDir = process.cwd()
;(0, env_1.loadEnvConfig)(projectDir)
//fake blitz-auth
blitz_server_1.authPlugin && console.log("authPlugin imported from main app")
var _a = process.env,
  NEXT_PUBLIC_APP_URL = _a.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_WS_URL = _a.NEXT_PUBLIC_WS_URL
exports.NEXT_PUBLIC_APP_URL = NEXT_PUBLIC_APP_URL
exports.NEXT_PUBLIC_WS_URL = NEXT_PUBLIC_WS_URL
