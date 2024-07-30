import { BlitzPage } from "@blitzjs/next"
import { SignIn } from "@clerk/nextjs"
import { ClerkProviderWrapper } from "src/auth-clerk/helpers"
import { clerkOptions } from "src/auth-clerk/clerkOptions"

const SignInPage: BlitzPage = () => {
  return (
    <ClerkProviderWrapper>
      <div className="flex flex-col items-center justify-center py-8 min-h-screen">
        <div>
          <SignIn forceRedirectUrl={clerkOptions.afterSignInUrl} />
        </div>
      </div>
    </ClerkProviderWrapper>
  )
}
export default SignInPage
