import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { PromiseReturnType } from "blitz"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import login from "src/auth/mutations/login"
import { Login } from "src/auth/schemas"
import { FORM_ERROR, Form } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import ReCAPTCHA from "src/core/components/RecaptchaWrapper"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [loginMutation] = useMutation(login)
  const labelProps = {
    className:
      "label text-secondary hover:text-accent-focus focus-within:text-primary font-bold mb-1 mt-2",
  }
  const outerProps = { className: "flex flex-col text-0xl" }
  const labelClassName = "input input-bordered bg-base-200 focus:outline-secondary-focus"
  return (
    <div className="max-w-screen-sm">
      <div className="prose mb-3">
        <h1 className="text-2xl text-base-content">Conectare</h1>
      </div>

      <Form
        submitText="Conectare"
        schema={Login}
        initialValues={{ email, password: "" }}
        onSubmit={async (values) => {
          try {
            values["recaptchaToken"] = recaptchaToken || ""
            const user = await loginMutation(values)
            props.onSuccess?.(user)
          } catch (error: any) {
            switch (error.name) {
              case "ACCOUNT_NOT_FOUND":
                return {
                  email: (
                    <div>
                      {error.message}{" "}
                      <Link
                        className="btn btn-xs btn-secondary"
                        href={Routes.SignupPage({ email: values.email })}
                      >
                        Creează cont
                      </Link>
                    </div>
                  ),
                }
              case "WRONG_PASSWORD":
              case "PASSWORD_NEEDS_RESET":
                return {
                  password: (
                    <div>
                      {error.message}{" "}
                      <Link
                        className="btn btn-xs btn-secondary"
                        href={Routes.ForgotPasswordPage({ email: values.email })}
                      >
                        {error.name === "PASSWORD_NEEDS_RESET"
                          ? "Resetează parola"
                          : "Ai uitat parola?"}
                      </Link>
                    </div>
                  ),
                }
              default:
                return { [FORM_ERROR]: error.toString() }
            }
          }
        }}
      >
        <div className="mb-8">
          <Link
            className="btn btn-primary w-full p-8 flex flex-row place-content-center text-xl "
            href={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/clerk/sign-in"}
          >
            <img
              alt="Conectare cu Google"
              className="w-8 h-8"
              src="/google-icon-logo-svgrepo-com.svg"
            />
            Conectare cu Google
          </Link>
        </div>

        <div className="divider">SAU CU E-MAIL ȘI PAROLA</div>

        <LabeledTextField
          labelProps={labelProps}
          outerProps={outerProps}
          className={labelClassName}
          name="email"
          label="Email"
          placeholder=""
        />
        <LabeledTextField
          labelProps={labelProps}
          outerProps={outerProps}
          className={labelClassName}
          name="password"
          label="Parola"
          placeholder=""
          type="password"
        />
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
          onChange={(token) => setRecaptchaToken(token)}
        />
      </Form>
      <div className="mt-6">
        <p>
          {"Nu ai un cont?"}
          <Link
            className="inline-block ml-2 underline text-secondary-content"
            href={Routes.SignupPage()}
          >
            <strong>Creează cont</strong>
          </Link>{" "}
        </p>
      </div>
    </div>
  )
}

export default LoginForm
