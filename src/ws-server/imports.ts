globalThis.__BLITZ_SESSION_COOKIE_PREFIX = process.env.__BLITZ_SESSION_COOKIE_PREFIX
import { loadEnvConfig } from "@next/env"
import { authPlugin } from "src/blitz-server"
const projectDir = process.cwd()
console.log(`WS: IMPORTING ENV loadEnvConfig(${projectDir})`)
loadEnvConfig(projectDir)

//fake blitz-auth
authPlugin && console.log("WS: authPlugin imported from main app")

const { NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_WS_URL } = process.env
export { NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_WS_URL }
