import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { hashObject } from "./hashObject"

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])

// See https://vercel.com/templates/next.js/edge-functions-modify-request-header
export default clerkMiddleware(
  async (auth, req) => {
    try {
      const _auth = await auth()
      console.log(`${req.url} 🚀 ~ clerkMiddleware ~ userId:`, _auth.userId)

      const requestHeaders = new Headers(req.headers)

      const hashedClerkData = {
        data: _auth.sessionClaims,
        verify: hashObject(_auth.sessionClaims),
      }
      requestHeaders.set("x-clerk-decoded", JSON.stringify(hashedClerkData))

      return NextResponse.next({
        request: {
          // New request headers
          headers: requestHeaders,
        },
      })
    } catch (error) {
      console.log(`🚀 ~ error:`, error)
    }

    // return NextResponse.next()
  },
  { debug: false && process.env.NODE_ENV === "development" }
)

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)", "/clerk(.*)"],
}
