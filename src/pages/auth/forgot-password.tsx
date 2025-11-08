import { BlitzPage } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { useCap } from "@takeshape/use-cap"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import forgotPassword from "src/auth/mutations/forgotPassword"
import { ForgotPassword } from "src/auth/schemas"
import { Form, FORM_ERROR } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { InfoIcon } from "src/core/components/notifications"
import {
  messageClassName,
  messageWrapperClassName,
  useOverlay,
} from "src/core/components/overlay/OverlayProvider"
import ViewportCentered from "src/core/components/spinner/ViewPortCentered"
import { useRedirectToUserHome } from "src/core/components/useRedirectToUserHome"
import Layout from "src/core/layouts/Layout"

const ForgotPasswordPage: BlitzPage = () => {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)
  const { toggle, reset: resetOverlay } = useOverlay()
  useRedirectToUserHome()
  const { solve, reset, solving, progress, error, token } = useCap({
    endpoint: process.env.NEXT_PUBLIC_CAPJS_API_ENDPOINT || "ERR_CAPSJS_API_ENDPOINT_NOT_SET",
  })

  const successNotification = (
    <ViewportCentered>
      <div className={messageWrapperClassName}>
        <div className="text-center">
          <InfoIcon />
        </div>
        <h2 className={messageClassName}>{"Mesajul de e-mail a fost trimis"}</h2>
        <h3 className="text-2xl text-neutral-content">
          {"Citiţi e-mailul (inclusiv secţiunea spam) pentru a reseta parola"}
        </h3>
      </div>
    </ViewportCentered>
  )

  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const labelProps = {
    className:
      "label text-secondary hover:text-accent-focus focus-within:text-primary font-bold mb-1 mt-2",
  }
  const outerProps = { className: "flex flex-col text-0xl" }
  const labelClassName = "input input-bordered bg-base-200 focus:outline-secondary-focus"

  return (
    <>
      <div className="max-w-screen-sm">
        <div className="prose mb-3">
          <h1 className="text-2xl text-base-content">Ai uitat parola?</h1>
        </div>

        <Form
          submitText="Trimite e-mail de resetare"
          schema={ForgotPassword}
          initialValues={{ email }}
          onSubmit={async (values) => {
            try {
              await reset()
              console.log("solving...")
              const _token = await solve()
              values["capjsToken"] = _token?.token || ""
              console.log("solved")
              toggle(true, { ...resetOverlay })
              await forgotPasswordMutation(values)
              toggle(true, { component: successNotification })
            } catch (error: any) {
              toggle(false)
              return {
                [FORM_ERROR]: "Eroare: Nu s-a putut trimite e-mail de resetare",
              }
            }
          }}
        >
          <LabeledTextField
            labelProps={labelProps}
            outerProps={outerProps}
            className={labelClassName}
            name="email"
            label="Email"
            placeholder="Email"
          />
          <progress
            className="progress progress-info w-full"
            value={progress || 0}
            max="100"
          ></progress>
        </Form>
      </div>
    </>
  )
}
ForgotPasswordPage.getLayout = (page) => (
  <Layout title="Ai uitat parola?">
    <Suspense>{page}</Suspense>
  </Layout>
)
export default ForgotPasswordPage
