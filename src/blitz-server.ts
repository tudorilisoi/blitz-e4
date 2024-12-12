import { AuthServerPlugin, PrismaStorage, simpleRolesIsAuthorized } from "@blitzjs/auth"
import { BlitzServerMiddleware, setupBlitzServer } from "@blitzjs/next"
import { BlitzLogger } from "blitz"
import db, { UserRoles } from "db"
import { nanoid } from "nanoid"
import { Role } from "types"
import { authConfig } from "./blitz-client"
import { hashObject } from "./hashObject"

const clerkMiddleware = BlitzServerMiddleware(async (req, res, next) => {
  const clerkHeader = req.headers["x-clerk-decoded"] as string
  if (!clerkHeader || res.blitzCtx.session.userId) {
    return next()
  }

  // console.log(`🚀 ~ clerkMiddleware ~ res.blitzCtx:`, res.blitzCtx.session)
  console.log(`🚀 ~ clerkMiddleware ~ req:`, req.headers["x-clerk-decoded"])
  console.log(`${req.url} BLITZ PLUGIN`)
  const { data, verify } = JSON.parse(clerkHeader)
  const hash = hashObject(data)
  if (hash === verify && data) {
    const { email, fullName } = data
    const ctx = res.blitzCtx
    console.log(`${req.url} BLITZ PLUGIN VERIFIED ${verify}`)
    const userSelect = { id: true, fullName: true, email: true, role: true, activationKey: true }

    let user = await db.user.findFirst({ where: { email }, select: userSelect })
    if (!user) {
      console.log(`${req.url} CLERK LOGIN CREATE USER ${email}`)
      user = await db.user.create({
        data: {
          email: email.toLowerCase().trim(),
          hashedPassword: "CHANGE_ME",
          role: UserRoles.USER,
          fullName,
          phone: "",
          activationKey: nanoid(),
        },
        select: userSelect,
      })
    }
    console.log(`${req.url} CLERK LOGIN EXISTING USER ${email}`)
    await ctx.session.$create({ userId: user.id, role: user.role as Role })
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
    // blitz auth
    authPlugin,
    //automatic login/signup from clerk sessionClaims
    clerkMiddleware,
  ],
  // NOTE tslog comes with default log level 0: silly, 1: trace, 2: debug, 3: info, 4: warn, 5: error, 6: fatal.
  logger: BlitzLogger({
    minLevel: 3,
  }),
})
