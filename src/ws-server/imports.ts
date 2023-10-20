globalThis.__BLITZ_SESSION_COOKIE_PREFIX = process.env.__BLITZ_SESSION_COOKIE_PREFIX
import { loadEnvConfig } from "@next/env"
import { authPlugin } from "src/blitz-server"
console.log("IMPORTING DATA FROM blitz-auth")
const projectDir = process.cwd()
loadEnvConfig(projectDir)

//fake blitz-auth
authPlugin && console.log("authPlugin imported from main app")

const { NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_WS_URL } = process.env
export { NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_WS_URL }
