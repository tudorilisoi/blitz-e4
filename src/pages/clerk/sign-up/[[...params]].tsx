import { AuthParam, ClerkAuthPagePage } from "../sign-in/[[...params]]"

export default function ClerkSignupPage() {
  return <ClerkAuthPagePage authType={AuthParam.SIGN_UP} />
}
