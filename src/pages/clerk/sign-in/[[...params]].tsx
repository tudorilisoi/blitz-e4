import { SignedIn, SignIn, SignedOut, SignOutButton } from "@clerk/nextjs"

const SignInPage = () => (
  <div className="flex flex-col place-items-center place-content-center w-full min-h-[100vh]">
    <SignedOut>
      <SignIn />
    </SignedOut>
    <SignedIn>
      <SignOutButton>Deconectare</SignOutButton>
    </SignedIn>
  </div>
)

export default SignInPage
