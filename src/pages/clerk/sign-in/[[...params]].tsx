import { SignIn } from "@clerk/nextjs"

const SignInPage = () => (
  <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
    <SignIn />
  </div>
)

export default SignInPage
