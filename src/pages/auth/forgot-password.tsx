import { BlitzPage } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import forgotPassword from "src/auth/mutations/forgotPassword"
import { ForgotPassword } from "src/auth/schemas"
import { Form, FORM_ERROR } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import Layout from "src/core/layouts/Layout"

const ForgotPasswordPage: BlitzPage = () => {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)

  return (
    <Layout title="Forgot Your Password?">
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
          submitText="Send Reset Password Instructions"
          schema={ForgotPassword}
          initialValues={{ email: "" }}
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
          <LabeledTextField name="email" label="Email" placeholder="Email" />
        </Form>
      )}
    </Layout>
  )
}

export default ForgotPasswordPage
