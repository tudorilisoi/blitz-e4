import { setupBlitzServer } from "@blitzjs/next"
import { AuthServerPlugin, PrismaStorage } from "@blitzjs/auth"
import { simpleRolesIsAuthorized } from "@blitzjs/auth"
import { BlitzLogger } from "blitz"
import db from "db"
import { authConfig } from "./blitz-client"

export const { gSSP, gSP, api } = setupBlitzServer({
  plugins: [
    AuthServerPlugin({
      ...authConfig,
      storage: PrismaStorage(db),
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  // NOTE tslog comes with default log level 0: silly, 1: trace, 2: debug, 3: info, 4: warn, 5: error, 6: fatal.
  logger: BlitzLogger({
    minLevel: 3,
  }),
})
