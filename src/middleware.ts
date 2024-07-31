import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import url from "url"
import { clerkOptions } from "./auth-clerk/clerkOptions"
import { deleteCookie, getCookies } from "cookies-next"
import { canonical } from "./helpers"

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // "/(.*)",
  ],
}
const skipRe = new RegExp(config.matcher[0] as string)

// NOTE clerk cookie names
// @see https://github.com/clerk/javascript/blob/3726b0eb7c89dd227ded62ad0269763ceabc670e/packages/backend/src/constants.ts#L19
const clerkCookieRe = new RegExp("^(__clerk_handshake|__session|__client_uat|__clerk_db_jwt)")
export default clerkMiddleware(async (auth, req: NextRequest) => {
  // const user = await currentUser()
  let { pathname, path } = url.parse(req.url)
  pathname = pathname || "/"
  path = path || "/"
  console.log(`🚀 ~ clerkMiddleware ~ url: "${pathname}"`)
  if (skipRe.test(pathname)) {
    console.log(`🚀 ~ clerkMiddleware ~ SKIP url:`, pathname)
  }

  if (path === "/api/rpc/logout") {
    const authObj = auth()
    if (!authObj.userId) {
      return
    }
    const res = NextResponse.redirect(canonical("/api/rpc/logout?afterClerk"))
    const cookies = getCookies({ res, req })
    // console.log(`🚀 ~ clerkMiddleware ~ cookies:`, Object.keys(cookies))

    for (let key of Object.keys(cookies)) {
      if (clerkCookieRe.test(key)) {
        console.log(`🚀 ~ clerkMiddleware ~ k:`, key)
        res.cookies.set(key, "", { expires: new Date(Date.now() - 30 * 24 * 3600000) })
      }
      // console.log("HEADERS", req.cookies._parsed)
    }
    req.headers.set("x-clerk-auth", "")
    return res
  }
  if (pathname === "/api/rpc/getCurrentUser") {
    const authObj = auth()

    // NOTE this is the way to preserve data all the way to blitz-server
    // @see https://github.com/vercel/next.js/discussions/31188#discussioncomment-4914057
    req.headers.set("x-clerk-auth", JSON.stringify(authObj))
  }

  return NextResponse.next({
    request: req,
  })
}, clerkOptions)
