import { SignedIn, SignIn, SignedOut, SignOutButton, SignUp } from "@clerk/nextjs"

export enum AuthParam {
  SIGN_IN,
  SIGN_UP,
}

export const ClerkAuthPagePage = ({ authType }: { authType: AuthParam }) => {
  const authElement = authType === AuthParam.SIGN_IN ? <SignIn /> : <SignUp />
  return (
    <div className="flex flex-col place-items-center place-content-center w-full min-h-[100vh]">
      <SignedOut>{authElement}</SignedOut>
      <SignedIn>
        <div className="btn btn-primary">
          <SignOutButton>Deconectare</SignOutButton>
        </div>
      </SignedIn>
    </div>
  )
}

export default function ClerkSignInPage() {
  return <ClerkAuthPagePage authType={AuthParam.SIGN_IN} />
}
