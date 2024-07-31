import { LabeledTextField } from "src/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/core/components/Form"
import signup from "src/auth/mutations/signup"
import { Signup } from "src/auth/schemas"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useRef } from "react"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const searchParams = useSearchParams()
  const ref = useRef<any>()
  console.log(`🚀 ~ SignupForm ~ ref:`, ref)
  const email = searchParams.get("email") || ""
  const [signupMutation] = useMutation(signup)
  const labelProps = {
    className:
      "label text-secondary hover:text-accent-focus focus-within:text-primary font-bold mb-1 mt-2",
  }
  const outerProps = { className: "flex flex-col text-0xl" }
  const labelClassName = "input input-bordered bg-base-200 focus:outline-secondary-focus"
  const handlePasswordConfirmation = (ev) => {
    console.log(`🚀 ~ SignupForm ~ ref:`, ref)
    const _ref = ref?.current
    if (!_ref) {
      return
    }
    const values = _ref.getValues() || {}
    console.log(`🚀 ~ handlePasswordConfirmation ~ values:`, values)
    if (values.password === values.passwordConfirmation) {
      _ref.clearErrors("password")
      _ref.clearErrors("passwordConfirmation")
    }
    _ref.trigger("password")
    _ref.trigger("passwordConfirmation")
  }
  return (
    <div className="max-w-screen-sm">
      <Form
        submitText="Creează cont"
        schema={Signup}
        controller={ref}
        initialValues={{ email, password: "" }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values)
            props.onSuccess?.()
          } catch (error: any) {
            console.dir(error)
            if (error.name === "USER_EXISTS") {
              return {
                email: (
                  <div>
                    {error.message}{" "}
                    <Link
                      className="btn btn-xs btn-secondary"
                      href={Routes.LoginPage({ email: values.email })}
                    >
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
          name="fullName"
          label="Nume / numele firmei"
          placeholder=""
        />
        <LabeledTextField
          labelProps={labelProps}
          outerProps={outerProps}
          className={labelClassName}
          name="phone"
          label="Nr. de telefon"
          placeholder=""
        />
        <LabeledTextField
          onKeyUp={handlePasswordConfirmation}
          labelProps={labelProps}
          outerProps={outerProps}
          className={labelClassName}
          name="password"
          label="Parola"
          placeholder=""
          type="password"
        />
        <LabeledTextField
          onKeyUp={handlePasswordConfirmation}
          labelProps={labelProps}
          outerProps={outerProps}
          className={labelClassName}
          name="passwordConfirmation"
          label="Parola din nou"
          placeholder=""
          type="password"
        />
      </Form>
    </div>
  )
}

export default SignupForm
