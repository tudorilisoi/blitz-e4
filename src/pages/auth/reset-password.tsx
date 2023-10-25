import { BlitzPage, Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { assert } from "blitz"
import Link from "next/link"
import { useRouter } from "next/router"
import resetPassword from "src/auth/mutations/resetPassword"
import { ResetPassword } from "src/auth/schemas"
import { Form, FORM_ERROR } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import Layout from "src/core/layouts/Layout"

const ResetPasswordPage: BlitzPage = () => {
  const router = useRouter()
  const token = router.query.token?.toString() || ""
  console.log(`🚀 ~ token:`, token)
  const [resetPasswordMutation, { isSuccess }] = useMutation(resetPassword)

  const labelProps = {
    className:
      "label text-secondary hover:text-accent-focus focus-within:text-primary font-bold mb-1 mt-2",
  }
  const outerProps = { className: "flex flex-col text-0xl" }
  const labelClassName = "input input-bordered bg-base-200 focus:outline-secondary-focus"

  return (
    <div className="max-w-screen-sm">
      <div className="prose mb-3">
        <h1 className="text-2xl text-base-content">Setează o nouă parolă</h1>
      </div>

      {isSuccess ? (
        <div>
          <h2>Password Reset Successfully</h2>
          <p>
            Go to the <Link href={Routes.Home()}>homepage</Link>
          </p>
        </div>
      ) : (
        <Form
          submitText="Resetează parola"
          schema={ResetPassword}
          initialValues={{
            password: "",
            passwordConfirmation: "",
            token,
          }}
          onSubmit={async (values) => {
            try {
              assert(token, "token is required.")
              await resetPasswordMutation({ ...values, token })
            } catch (error: any) {
              if (error.name === "ResetPasswordError") {
                return {
                  [FORM_ERROR]: error.message,
                }
              } else {
                return {
                  [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                }
              }
            }
          }}
        >
          <LabeledTextField
            labelProps={labelProps}
            outerProps={outerProps}
            className={labelClassName}
            name="password"
            label="Parola nouă"
            type="password"
          />
          <LabeledTextField
            labelProps={labelProps}
            outerProps={outerProps}
            className={labelClassName}
            name="passwordConfirmation"
            label="Parola nouă (din nou)"
            type="password"
          />
        </Form>
      )}
    </div>
  )
}

ResetPasswordPage.redirectAuthenticatedTo = "/"
ResetPasswordPage.getLayout = (page) => <Layout title="Resetează parola">{page}</Layout>

export default ResetPasswordPage
