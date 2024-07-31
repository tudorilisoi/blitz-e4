import { clerkMiddleware } from "@clerk/nextjs/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import url from "url"

const clerkOptions = {
  signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "",
  signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "",
  // afterSignInUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "",
  // afterSignUpUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "",
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
  secretKey: process.env.CLERK_SECRET_KEY,
  debug: true,
}

export default clerkMiddleware(async (auth, req) => {
  // const user = await currentUser()
  const authObj = auth()
  console.log(`🚀 ~ clerkMiddleware ~ url:`, url.parse(req.url))
  console.log(`🚀 ~ clerkMiddleware ~ auth:`, authObj)
  if (authObj.userId) {
    // const user = await currentUser()
    // console.log(`🚀 ~ clerkMiddleware ~ user:`, user)
  }
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
