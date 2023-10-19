import { getBlitzContext, getSession } from "@blitzjs/auth"
import { loadEnvConfig } from "@next/env"
import * as trpc from "@trpc/server"
import * as trpcNext from "@trpc/server/adapters/next"
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http"
import { IncomingMessage } from "http"
const projectDir = process.cwd()
const conf = loadEnvConfig(projectDir)

import ws from "ws"

globalThis.__BLITZ_SESSION_COOKIE_PREFIX = process.env.__BLITZ_SESSION_COOKIE_PREFIX

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (
  opts: NodeHTTPCreateContextFnOptions<IncomingMessage, ws> | trpcNext.CreateNextContextOptions
) => {
  // const session = await getSession(opts.req)

  // console.log("createContext for", session?.user?.name ?? "unknown user")
  try {
    const sess = await getSession(opts.req, opts.res)
    const ctx = await getBlitzContext()
    console.log(`🚀 ~ ctx:`, ctx)
  } catch (error) {
    console.log(`🚀 ~ error:`, error)
    // console.log(process.env)
  }
  return {
    session: {},
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
