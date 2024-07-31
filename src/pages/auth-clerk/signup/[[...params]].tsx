import { BlitzPage } from "@blitzjs/next"
import { SignUp } from "@clerk/nextjs"
import { clerkVars, ClerkProviderWrapper } from "src/auth-clerk/helpers"

const SignUpPage: BlitzPage = () => {
  return (
    <ClerkProviderWrapper>
      <div className="flex flex-col items-center justify-center py-8 min-h-screen">
        <div>
          <SignUp forceRedirectUrl={clerkVars.afterSignUpUrl} />
        </div>
      </div>
    </ClerkProviderWrapper>
  )
}

export default SignUpPage
