import { BlitzPage } from "@blitzjs/next"
import { useRouter } from "next/router"
import { Suspense } from "react"
import { SignupForm } from "src/auth/components/SignupForm"
import { InfoIcon } from "src/core/components/notifications"
import {
  messageClassName,
  messageWrapperClassName,
  useOverlay,
} from "src/core/components/overlay/OverlayProvider"
import ViewportCentered from "src/core/components/spinner/ViewPortCentered"
import { useRedirectToUserHome } from "src/core/components/useRedirectToUserHome"
import Layout from "src/core/layouts/Layout"

const SignupPage: BlitzPage = () => {
  const router = useRouter()
  const { toggle } = useOverlay()
  useRedirectToUserHome()

  const successNotification = (
    <ViewportCentered>
      <div className={messageWrapperClassName}>
        <div className="text-center">
          <InfoIcon />
        </div>
        <h2 className={messageClassName}>{"Contul a fost creat"}</h2>
        <h3 className="text-2xl text-neutral-content">
          {"Citiţi e-mailul (inclusiv secţiunea spam) pentru a activa contul"}
        </h3>
        {/* <button
          onClick={() => {
            toggle(false)
          }}
          className="btn btn-secondary"
        >
          OK
        </button> */}
      </div>
    </ViewportCentered>
  )

  return (
    <>
      <SignupForm onSuccess={() => toggle(true, { component: successNotification })} />
    </>
  )
}
SignupPage.getLayout = (page) => (
  <Layout title="Creează cont">
    <Suspense>{page}</Suspense>
  </Layout>
)
export default SignupPage
