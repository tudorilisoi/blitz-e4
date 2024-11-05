import { decode } from "html-entities"
import { AuthServerPlugin, PrismaStorage, simpleRolesIsAuthorized } from "@blitzjs/auth"
import { BlitzServerMiddleware, setupBlitzServer } from "@blitzjs/next"
import { BlitzLogger } from "blitz"
import db from "db"
import { authConfig } from "./blitz-client"
import { hashObject } from "./hashObject"

const fmw = BlitzServerMiddleware(async (req, res, next) => {
  const clerkHeader = req.headers["x-clerk-decoded"] as string
  if (clerkHeader) {
    console.log(`🚀 ~ fmw ~ req:`, req.headers["x-clerk-decoded"])
    console.log(`${req.url} BLITZ PLUGIN`)
    const { data, verify } = JSON.parse(clerkHeader)
    const hash = hashObject(data)
    if (hash === verify) {
      console.log(`${req.url} BLITZ PLUGIN VERIFIED ${verify}`)
    }
  }
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
