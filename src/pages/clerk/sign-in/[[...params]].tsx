import { SignedIn, SignIn, SignedOut, SignOutButton } from "@clerk/nextjs"

const SignInPage = () => (
  <div className="flex flex-col place-items-center place-content-center w-full min-h-[100vh]">
    <SignedOut>
      <SignIn />
    </SignedOut>
    <SignedIn>
      <div className="btn btn-primary">
        <SignOutButton>Deconectare</SignOutButton>
      </div>
    </SignedIn>
  </div>
)

export default SignInPage
