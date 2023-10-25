import { AuthenticationError, PromiseReturnType } from "blitz"
import Link from "next/link"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/core/components/Form"
import login from "src/auth/mutations/login"
import { Login } from "src/auth/schemas"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
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
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            const user = await loginMutation(values)
            props.onSuccess?.(user)
          } catch (error: any) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
            } else {
              return {
                [FORM_ERROR]:
                  "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
              }
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
        <div>
          <Link href={Routes.ForgotPasswordPage()}>Forgot your password?</Link>
        </div>
      </Form>

      <div style={{ marginTop: "1rem" }}>
        sau <Link href={Routes.SignupPage()}>Creează cont</Link>
      </div>
    </div>
  )
}

export default LoginForm
