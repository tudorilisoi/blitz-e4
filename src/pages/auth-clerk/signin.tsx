import { BlitzPage } from "@blitzjs/next"
import { SignIn } from "@clerk/nextjs"
import { withClerkProvider } from "src/auth-clerk/helpers"

const SignInPage: BlitzPage = () => {
  return (
    <div className="flex flex-col place-items-center py-8">
      {/* <h1 className='mb-8'>Sign In route</h1> */}
      <SignIn routing="hash" />
    </div>
  )
}

export default withClerkProvider(SignInPage)
