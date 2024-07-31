import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import url from "url"
import { clerkOptions } from "./auth-clerk/clerkOptions"
import { deleteCookie, getCookies } from "cookies-next"

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
const clerkCookieRe = new RegExp("^(__clerk_db_|__session)")
export default clerkMiddleware(async (auth, req: NextRequest) => {
  // const user = await currentUser()
  let { pathname } = url.parse(req.url)
  pathname = pathname || "/"
  console.log(`🚀 ~ clerkMiddleware ~ url: "${pathname}"`)
  if (skipRe.test(pathname)) {
    console.log(`🚀 ~ clerkMiddleware ~ SKIP url:`, pathname)
  }

  if (pathname === "/api/rpc/logout") {
    const res = NextResponse.next()
    const cookies = getCookies({ res, req })
    console.log(`🚀 ~ clerkMiddleware ~ cookies:`, Object.keys(cookies))

    for (let key of Object.keys(cookies)) {
      if (clerkCookieRe.test(key)) {
        console.log(`🚀 ~ clerkMiddleware ~ k:`, key)
        // req.cookies.delete(key)
        deleteCookie(key, { req, res })
      }
      // console.log("HEADERS", req.cookies._parsed)
    }
    req.headers.set("x-clerk-auth", "")
    return NextResponse.next({
      request: req,
    })
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
