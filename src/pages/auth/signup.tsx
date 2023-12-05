import { BlitzPage } from "@blitzjs/next"
import { useRouter } from "next/router"
import { SignupForm } from "src/auth/components/SignupForm"
import { SuccessIcon } from "src/core/components/notifications"
import {
  messageClassName,
  messageWrapperClassName,
  useOverlay,
} from "src/core/components/overlay/OverlayProvider"
import ViewportCentered from "src/core/components/spinner/ViewPortCentered"
import Layout from "src/core/layouts/Layout"

const SignupPage: BlitzPage = () => {
  const router = useRouter()
  const { toggle } = useOverlay()

  const signupSuccess = (
    <ViewportCentered>
      <div className={messageWrapperClassName}>
        <div className="text-center">
          <SuccessIcon />
        </div>
        <h2 className={messageClassName}>{"Contul a fost creat"}</h2>
        <h3 className="text-2xl text-neutral-content">
          {"Citiţi e-mailul (inclusiv secţiunea spam) pentru a activa contul"}
        </h3>
      </div>
    </ViewportCentered>
  )

  return (
    <>
      <SignupForm onSuccess={() => toggle(true, { component: signupSuccess })} />
    </>
  )
}
SignupPage.getLayout = (page) => <Layout title="Creează cont">{page}</Layout>
export default SignupPage
