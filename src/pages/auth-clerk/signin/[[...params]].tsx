import { BlitzPage } from "@blitzjs/next"
import { SignIn } from "@clerk/nextjs"
import { clerkProps, withClerkProvider } from "src/auth-clerk/helpers"

const SignInPage: BlitzPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 min-h-screen">
      <div>
        <SignIn forceRedirectUrl={clerkProps.afterSignInUrl} />
      </div>
    </div>
  )
}

export default withClerkProvider(SignInPage)
