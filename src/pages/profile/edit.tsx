import { useSession } from "@blitzjs/auth"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Head from "next/head"
import { Suspense } from "react"
import { ErrorNotification } from "src/core/components/ErrorNotification"
import { SuccessIcon } from "src/core/components/notifications"
import { useOverlay } from "src/core/components/overlay/OverlayProvider"
import Layout from "src/core/layouts/Layout"
import updateUser from "src/users/mutations/updateUser"
import getUser from "src/users/queries/getUser"

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

const EditProfile = () => {
  const { toggle, reset } = useOverlay()
  const session = useSession()
  if (!session.userId) throw new Error("User not authenticated")
  const [user] = useQuery(getUser, { id: session.userId })
  const [updateUserMutation] = useMutation(updateUser)

  return (
    <>
      <Head>
        <title>Edit Profile</title>
      </Head>

      <div className="prose mb-3">
        <h1 className="text-2xl">Edit Profile</h1>
      </div>

      <div className="max-w-md">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const fullName = formData.get("fullName") as string

            try {
              toggle(true, reset)
              await updateUserMutation({ id: user.id, fullName })
              toggle(true, { component: <SuccessNotification onClose={() => toggle(false)} /> })
            } catch (error) {
              toggle(true, { component: <ErrorNotification error={error} /> })
            }
          }}
        >
          <div className="form-control">
            <label className="label" htmlFor="fullName">
              <span className="label-text">Full Name</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="input input-bordered"
              defaultValue={user.fullName || ""}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary mt-4">
            Save Changes
          </button>
        </form>
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
