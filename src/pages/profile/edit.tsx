import { useSession } from "@blitzjs/auth"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Head from "next/head"
import { Suspense } from "react"
import { ErrorNotification } from "src/core/components/ErrorNotification"
import { Form } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { SuccessIcon } from "src/core/components/notifications"
import { useOverlay } from "src/core/components/overlay/OverlayProvider"
import Layout from "src/core/layouts/Layout"
import updateUser from "src/users/mutations/updateUser"
import getUser from "src/users/queries/getUser"
import { UpdateUserSchema } from "src/users/schemas"

const SuccessNotification = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="text-center">
      <SuccessIcon />
      <h2 className="text-xl font-bold mt-4">Profile updated successfully!</h2>
      <button onClick={onClose} className="btn btn-primary mt-4">
        Close
      </button>
    </div>
  )
}

const labelProps = {
  className:
    "label text-secondary hover:text-accent-focus focus-within:text-primary font-bold mb-1 mt-2",
}
const outerProps = { className: "flex flex-col text-0xl" }
const labelClassName = "input input-bordered bg-base-200 focus:outline-secondary-focus"

const EditProfile = () => {
  const { toggle, reset } = useOverlay()
  const session = useSession()
  if (!session.userId) throw new Error("User not authenticated")
  const [user] = useQuery(getUser, { id: session.userId })
  const [updateUserMutation] = useMutation(updateUser)

  return (
    <>
      <Head>
        <title>Modifică profilul</title>
      </Head>

      <div className="prose mb-3">
        <h1 className="text-2xl">Modifică profilul</h1>
      </div>

      <div className="max-w-md">
        <Form
          schema={UpdateUserSchema}
          initialValues={{ id: user.id, fullName: user.fullName || "" }}
          onSubmit={async (values) => {
            try {
              toggle(true, reset)
              await updateUserMutation(values)
              toggle(true, { component: <SuccessNotification onClose={() => toggle(false)} /> })
            } catch (error) {
              toggle(true, { component: <ErrorNotification error={error} /> })
            }
          }}
          submitText="Salvează modificările"
        >
          <LabeledTextField
            labelProps={labelProps}
            outerProps={outerProps}
            className={labelClassName}
            name="fullName"
            label="Full Name"
          />
        </Form>
      </div>
    </>
  )
}

const EditProfilePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProfile />
    </Suspense>
  )
}

EditProfilePage.authenticate = true
EditProfilePage.getLayout = (page) => <Layout>{page}</Layout>

export default EditProfilePage
