import { AuthServerPlugin, PrismaStorage, simpleRolesIsAuthorized } from "@blitzjs/auth"
import { BlitzServerMiddleware, setupBlitzServer } from "@blitzjs/next"
import { BlitzLogger } from "blitz"
import db from "db"
import { authConfig } from "./blitz-client"

const fmw = BlitzServerMiddleware(async (req, res, next) => {
  // req.url = canonical(req.url || "")
  console.log("BLITZ PLUGIN")
  return next()
})

export const authPlugin = AuthServerPlugin({
  ...authConfig,
  storage: PrismaStorage(db),
  isAuthorized: simpleRolesIsAuthorized,
})

export const { gSSP, gSP, api } = setupBlitzServer({
  plugins: [
    //canonic URLs
    fmw,
    // blitz auth
    authPlugin,
  ],
  // NOTE tslog comes with default log level 0: silly, 1: trace, 2: debug, 3: info, 4: warn, 5: error, 6: fatal.
  logger: BlitzLogger({
    minLevel: 3,
  }),
})
