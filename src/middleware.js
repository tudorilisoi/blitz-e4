import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default clerkMiddleware(
  async (auth, req) => {
    try {
      const _auth = await auth()
      console.log(`🚀 ~ clerkMiddleware ~ userId:`, _auth.userId)
    } catch (error) {
      console.log(`🚀 ~ error:`, error)
    }

    // return NextResponse.next()
  },
  { debug: false && process.env.NODE_ENV === "development" }
)

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
