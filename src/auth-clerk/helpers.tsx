import { ClerkProvider } from "@clerk/nextjs"
import { roRO } from "@clerk/localizations"
import { useState } from "react"

export const clerkProps = {
  signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "",
  signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "",
  afterSignInUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "",
  afterSignUpUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "",
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
}

export function ClerkProviderWrapper({ children }) {
  return (
    <ClerkProvider localization={roRO} {...clerkProps}>
      {children}
    </ClerkProvider>
  )
}
let counter = 0
export function withClerkProvider<T>(WrappedComponent: React.ComponentType<T>) {
  const ComponentWithClerk = (props) => {
    return (
      <ClerkProviderWrapper>
        <WrappedComponent {...props} />
      </ClerkProviderWrapper>
    )
  }

  // Try to create a nice displayName for React Dev Tools.
  let displayName = WrappedComponent.displayName || WrappedComponent.name
  console.log(`🚀 ~ displayName:`, displayName)
  if (!displayName) {
    displayName = `Component__${++counter}`
  }
  ComponentWithClerk.displayName = `withClerkProvider(${displayName})`

  return ComponentWithClerk
}
