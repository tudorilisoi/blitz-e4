import { SESSION_TYPE_ANONYMOUS_JWT } from "@blitzjs/auth"
import { loadEnvConfig } from "@next/env"
import * as trpc from "@trpc/server"
import * as trpcNext from "@trpc/server/adapters/next"
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http"
import { IncomingMessage, OutgoingMessage, ServerResponse } from "http"
import { authConfig } from "src/blitz-client"
const projectDir = process.cwd()
const conf = loadEnvConfig(projectDir)

import ws from "ws"

const { getSession } = require("@blitzjs/auth")
/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (
  opts: NodeHTTPCreateContextFnOptions<IncomingMessage, ws> | trpcNext.CreateNextContextOptions
) => {
  try {
    const { req } = opts
    // const res = new ServerResponse(req)
    const res = opts.res
    globalThis.__BLITZ_SESSION_COOKIE_PREFIX = authConfig.cookiePrefix
    const ctx = await getSession(req, res)

    console.log("WS SESSION", Object.keys(res.blitzCtx.session))
    return res.blitzCtx.session
  } catch (error) {
    console.log(`🚀 ~ error:`, error)
  }

  const { req, res } = opts
  // console.log("H:", req.headers)
  if (req.headers.cookie) {
    console.log("COOKIE:", req.headers.cookie)
  }
  return {
    session: {},
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
