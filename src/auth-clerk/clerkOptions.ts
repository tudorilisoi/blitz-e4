export const clerkOptions = {
  signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "",
  signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "",
  afterSignInUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "",
  afterSignUpUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "",
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
  secretKey: process.env.CLERK_SECRET_KEY,
  debug: true,
}
