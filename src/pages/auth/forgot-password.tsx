import { BlitzPage } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { useSearchParams } from "next/navigation"
import forgotPassword from "src/auth/mutations/forgotPassword"
import { ForgotPassword } from "src/auth/schemas"
import { Form, FORM_ERROR } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import Layout from "src/core/layouts/Layout"

const ForgotPasswordPage: BlitzPage = () => {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)
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
        {isSuccess ? (
          <div className="bg-info text-info-content rounded-md p-1 px-">
            <h2 className="text-xl  ">Cererea a fost trimisă</h2>
            <p>Veţi primi nformaţiile pe e-mail în scurt timp</p>
          </div>
        ) : (
          <Form
            submitText="Trimite e-mail de resetare"
            schema={ForgotPassword}
            initialValues={{ email }}
            onSubmit={async (values) => {
              try {
                await forgotPasswordMutation(values)
              } catch (error: any) {
                return {
                  [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
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
          </Form>
        )}
      </div>
    </>
  )
}
ForgotPasswordPage.getLayout = (page) => <Layout title="Ai uitat parola?">{page}</Layout>
export default ForgotPasswordPage
