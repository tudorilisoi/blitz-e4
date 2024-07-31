import { clerkMiddleware } from "@clerk/nextjs/server"
import { INTERNALS } from "next/dist/server/web/spec-extension/request"
import { NextRequest, NextResponse } from "next/server"
import url from "url"
import { clerkOptions } from "./clerkOptions"

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // const user = await currentUser()
  const authObj = auth()
  console.log(`🚀 ~ clerkMiddleware ~ url:`, url.parse(req.url))
  req.headers.set("x-clerk-auth", JSON.stringify(authObj))
  return NextResponse.next({
    request: req,
  })
}, clerkOptions)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // "/(.*)",
  ],
}
