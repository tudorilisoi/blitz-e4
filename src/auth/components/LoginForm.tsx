import { AuthenticationError, PromiseReturnType } from "blitz"
import Link from "next/link"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/core/components/Form"
import login from "src/auth/mutations/login"
import { Login } from "src/auth/schemas"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import { useSearchParams } from "next/navigation"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
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
                break
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
                          ? "Trebuie să resetezi parola"
                          : "Ai uitat parola?"}
                      </Link>
                    </div>
                  ),
                }
                break

              default:
                return { [FORM_ERROR]: error.toString() }
                break
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
      </Form>
    </div>
  )
}

export default LoginForm
