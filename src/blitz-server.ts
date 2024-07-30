import { AuthServerPlugin, BlitzCtx, PrismaStorage, simpleRolesIsAuthorized } from "@blitzjs/auth"
import { setupBlitzServer } from "@blitzjs/next"
import { BlitzLogger, createServerPlugin, RequestMiddleware } from "blitz"
import db from "db"
import { IncomingMessage, ServerResponse } from "http"
import { authConfig } from "./blitz-client"
import { clerkOptions } from "./clerkOptions"
import { clerkClient } from "@clerk/nextjs/server"

const cplugin = createServerPlugin((options) => {
  const mw: RequestMiddleware<
    IncomingMessage & { clerkAuth: any },
    ServerResponse & { blitzCtx: BlitzCtx }
  > = async (req, res, next) => {
    console.log("Fuyoo", req.url, req.headers["x-clerk-auth"])
    return next()
  }

  mw.config = {
    name: "mw",
  }

  const { publishableKey, secretKey } = clerkOptions
  return {
    requestMiddlewares: [mw],
    exports: () => ({}),
  }
})

export const authPlugin = AuthServerPlugin({
  ...authConfig,
  storage: PrismaStorage(db),
  isAuthorized: simpleRolesIsAuthorized,
})

export const { gSSP, gSP, api } = setupBlitzServer({
  plugins: [authPlugin, cplugin({})],
  // NOTE tslog comes with default log level 0: silly, 1: trace, 2: debug, 3: info, 4: warn, 5: error, 6: fatal.
  logger: BlitzLogger({
    minLevel: 3,
  }),
})
