import { AuthServerPlugin, BlitzCtx, PrismaStorage, simpleRolesIsAuthorized } from "@blitzjs/auth"
import { setupBlitzServer } from "@blitzjs/next"
import { ClerkMiddlewareAuthObject } from "@clerk/nextjs/dist/types/server"
import { BlitzLogger, createServerPlugin, RequestMiddleware } from "blitz"
import db, { UserRoles } from "db"
import { IncomingMessage, ServerResponse } from "http"
import { nanoid } from "nanoid"
import { Role } from "types"
import { authConfig } from "./blitz-client"

export async function handleClerkAuth(authObj: ClerkMiddlewareAuthObject, ctx: BlitzCtx) {
  if (authObj.sessionClaims) {
    ctx.session.clerkAuthObj = authObj
    const userSelect = { id: true, fullName: true, email: true, role: true, activationKey: true }
    let { email, fullName } = authObj.sessionClaims
    let user = await db.user.findFirst({ where: { email }, select: userSelect })
    console.log(`🚀 ~ handleClerkAuth ~ user:`, user)
    if (!user) {
      user = await db.user.create({
        data: {
          email,
          role: UserRoles.USER,
          fullName,
          activationKey: nanoid(),
        },
        select: userSelect,
      })
    }
    console.log(`🚀 ~ handleClerkAuth ~ ctx.session 1:`, ctx.session.userId)
    if (!ctx.session.userId) {
      //login the user
      console.log(`🚀 ~ handleClerkAuth ~ login:`, user)
      await ctx.session.$create({ userId: user.id, role: user.role as Role })
      console.log(`🚀 ~ handleClerkAuth ~ ctx.session 2:`, ctx.session.userId)
    }
  }
}

const cplugin = createServerPlugin((options) => {
  const mw: RequestMiddleware<
    IncomingMessage & { clerkAuth: any },
    ServerResponse & { blitzCtx: BlitzCtx }
  > = async (req, res, next) => {
    // console.log("Fuyoo", req.url, req.headers["x-clerk-auth"])
    if (req.headers["x-clerk-auth"]) {
      const authObj = JSON.parse(req.headers["x-clerk-auth"] as string) as ClerkMiddlewareAuthObject
      await handleClerkAuth(authObj, res.blitzCtx)
    }
    return next()
  }

  mw.config = {
    name: "mw",
  }

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
