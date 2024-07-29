import { clerkMiddleware } from "@clerk/nextjs/server"

const clerkOptions = {
  signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "",
  signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "",
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
}

export default clerkMiddleware(clerkOptions)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
