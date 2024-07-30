import { BlitzPage } from "@blitzjs/next"
import { SignUp } from "@clerk/nextjs"
import { ClerkProviderWrapper } from "src/auth-clerk/helpers"
import { clerkOptions } from "src/auth-clerk/clerkOptions"

const SignUpPage: BlitzPage = () => {
  return (
    <ClerkProviderWrapper>
      <div className="flex flex-col items-center justify-center py-8 min-h-screen">
        <div>
          <SignUp forceRedirectUrl={clerkOptions.afterSignUpUrl} />
        </div>
      </div>
    </ClerkProviderWrapper>
  )
}

export default SignUpPage
