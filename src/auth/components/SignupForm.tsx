import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { useCap } from "@takeshape/use-cap"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useRef } from "react"
import signup from "src/auth/mutations/signup"
import { Signup } from "src/auth/schemas"
import { Form, FORM_ERROR } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const searchParams = useSearchParams()
  const { solve, reset, solving, progress, error, token } = useCap({
    endpoint: process.env.NEXT_PUBLIC_CAPJS_API_ENDPOINT || "ERR_CAPSJS_API_ENDPOINT_NOT_SET",
  })
  const ref = useRef<any>()

  // console.log(`🚀 ~ SignupForm ~ ref:`, ref)
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
      <div className="prose mb-3">
        <h1 className="text-2xl text-base-content">Creează cont</h1>
      </div>

      <Form
        submitText="Creează cont"
        schema={Signup}
        controller={ref}
        initialValues={{ email, password: "", capjsToken: "" }}
        onSubmit={async (values) => {
          try {
            await reset()
            console.log("solving...")
            const _token = await solve()
            values["capjsToken"] = _token?.token
            console.log("solved")
            await signupMutation(values)
            // props.onSuccess?.()
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
        <div className="mb-8">
          <Link
            className="btn btn-primary w-full p-8 flex flex-row place-content-center text-xl "
            href={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/clerk/sign-in"}
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
        <h1>use-cap</h1>
        <div>Solving: {solving ? "true" : "false"}</div>
        <div>Progress: {progress ?? "???"}</div>
        <div>Token: {token?.token ?? "???"}</div>
        <div>Expires: {token?.expires ?? "???"}</div>
      </Form>
    </div>
  )
}

export default SignupForm
