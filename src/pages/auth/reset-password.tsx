import { BlitzPage } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { assert } from "blitz"
import { Info } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Suspense, useEffect, useState } from "react"
import resetPassword from "src/auth/mutations/resetPassword"
import { ResetPassword } from "src/auth/schemas"
import { Form, FORM_ERROR } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import Layout from "src/core/layouts/Layout"

const ResetPasswordPage: BlitzPage = () => {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}

const ResetPasswordForm = () => {
  "use client"
  const [homeURL, setHomeURL] = useState("/")
  const router = useRouter()
  useEffect(() => {
    if (homeURL !== "/") {
      console.log(`redirect to ${homeURL}`)
      setTimeout(() => {
        router.replace(homeURL).catch(() => {})
      }, 5000)
    }
  }, [homeURL, router])
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
        <h1 className="text-2xl text-base-content">
          {isSuccess ? "Ai setat o nouă parolă!" : "Setează o nouă parolă"}
        </h1>
      </div>

      {isSuccess ? (
        <div className="text-center">
          <h2 className="alert alert-info my-8 text-2xl inline-flex items-center justify-center">
            <Info className="w-8 h-8" />
            Parola a fost resetată
          </h2>
          <button className="btn btn-primary btn-lg w-full">
            Mergi la <Link href={homeURL}> pagina de pornire</Link>
          </button>
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
              const userHomeURL = await resetPasswordMutation({ ...values, token })
              setHomeURL(userHomeURL)
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
            label="Repetă parola nouă"
            type="password"
          />
        </Form>
      )}
    </div>
  )
}

// ResetPasswordPage.redirectAuthenticatedTo = "/"
ResetPasswordPage.getLayout = (page) => <Layout title="Resetează parola">{page}</Layout>

export default ResetPasswordPage
