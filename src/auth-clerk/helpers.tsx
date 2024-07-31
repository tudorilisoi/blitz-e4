import { Clerk } from "@clerk/clerk-js"
import { roRO } from "@clerk/localizations"
import { ClerkProvider } from "@clerk/nextjs"
import { clerkOptions } from "src/auth-clerk/clerkOptions"

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
  if (!displayName) {
    displayName = `Component__${++counter}`
  }
  ComponentWithClerk.displayName = `withClerkProvider(${displayName})`

  return ComponentWithClerk
}

export async function logoutClerk() {
  // Initialize Clerk with your Clerk publishable key
  const clerk = new Clerk(clerkOptions.publishableKey)
  await clerk.load()

  if (clerk.user && clerk.session) {
    await clerk.session
      .end()
      // .then((res) => console.log(res))
      .catch((error) => console.log("An error occurred:", error.errors))
  }
}

export async function loadClerk() {
  // Initialize Clerk with your Clerk publishable key
  const clerk = new Clerk(clerkOptions.publishableKey)
  await clerk.load()
  return clerk
}
