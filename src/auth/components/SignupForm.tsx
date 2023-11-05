import { LabeledTextField } from "src/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/core/components/Form"
import signup from "src/auth/mutations/signup"
import { Signup } from "src/auth/schemas"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import Link from "next/link"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)
  const labelProps = {
    className:
      "label text-secondary hover:text-accent-focus focus-within:text-primary font-bold mb-1 mt-2",
  }
  const outerProps = { className: "flex flex-col text-0xl" }
  const labelClassName = "input input-bordered bg-base-200 focus:outline-secondary-focus"
  return (
    <div className="max-w-screen-sm">
      <div className="prose mb-3">
        <h1 className="text-2xl text-base-content">Creează cont</h1>
      </div>

      <Form
        submitText="Creează cont"
        schema={Signup}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values)
            props.onSuccess?.()
          } catch (error: any) {
            console.dir(error)
            if (error.code === "USER_EXISTS") {
              return {
                email: (
                  <div>
                    {error.message}{" "}
                    <Link className="btn btn-xs btn-secondary" href={Routes.LoginPage()}>
                      Conectare
                    </Link>
                  </div>
                ),
              }
            } else {
              return { [FORM_ERROR]: error.toString() }
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

export default SignupForm
