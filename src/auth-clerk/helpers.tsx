import { ClerkProvider } from "@clerk/nextjs"

export function withClerkProvider<T>(WrappedComponent: React.ComponentType<T>) {
  const ComponentWithClerk = (props) => {
    const clerkProps = {
      signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
      signUnUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    }

    return (
      <ClerkProvider {...clerkProps}>
        <WrappedComponent {...props} />
      </ClerkProvider>
    )
  }

  // Try to create a nice displayName for React Dev Tools.
  const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component"
  ComponentWithClerk.displayName = `withClerkProvider(${displayName})`

  return ComponentWithClerk
}
