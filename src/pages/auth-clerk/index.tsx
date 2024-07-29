// import "@/styles/globals.css"
import { BlitzPage } from "@blitzjs/next"
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import type { AppProps } from "next/app"

const ClerkStatusPage: BlitzPage = () => {
  const clerkProps = {
    signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    signUnUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  }

  return (
    <ClerkProvider {...clerkProps}>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </ClerkProvider>
  )
}

export default ClerkStatusPage
