import { ClerkProvider } from "@clerk/nextjs"
import { roRO } from "@clerk/localizations"

const clerkProps = {
  signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "",
  signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "",
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
}

export function ClerkProviderWrapper({ children }) {
  return (
    <ClerkProvider localization={roRO} {...clerkProps}>
      {children}
    </ClerkProvider>
  )
}

export function withClerkProvider<T>(WrappedComponent: React.ComponentType<T>) {
  const ComponentWithClerk = (props) => {
    return (
      <ClerkProviderWrapper>
        <WrappedComponent {...props} />
      </ClerkProviderWrapper>
    )
  }

  // Try to create a nice displayName for React Dev Tools.
  const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component"
  ComponentWithClerk.displayName = `withClerkProvider(${displayName})`

  return ComponentWithClerk
}
