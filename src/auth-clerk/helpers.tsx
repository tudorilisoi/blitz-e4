import { roRO } from "@clerk/localizations"
import { ClerkProvider } from "@clerk/nextjs"
import { clerkOptions } from "src/clerkOptions"

const { afterSignInUrl, afterSignUpUrl, ...clerkProps } = clerkOptions

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
