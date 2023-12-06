import { BlitzPage } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { Suspense, useEffect, useState } from "react"
import verifyEmail from "src/auth/mutations/verifyEmail"
import { gSSP } from "src/blitz-server"
import { ErrorNotification } from "src/core/components/ErrorNotification"
import { useOverlay } from "src/core/components/overlay/OverlayProvider"
import { useRedirectToUserHome } from "src/core/components/useRedirectToUserHome"
import Layout from "src/core/layouts/Layout"
import getCurrentUser from "src/users/queries/getCurrentUser"

export const getServerSideProps = gSSP(async (args) => {
  const { query, ctx } = args
  const user = await getCurrentUser(null, ctx)
  return { props: { query, user } }
})

const VerifyPage: BlitzPage<{ query; user }> = ({ query, user }) => {
  const { activationKey, email } = query
  const { toggle, reset } = useOverlay()
  const [verifyMutation] = useMutation(verifyEmail)
  const [verified, setVerified] = useState(false)
  useRedirectToUserHome()

  useEffect(() => {
    if (user) {
      return
    }
    const activate = async (): Promise<void> => {
      try {
        toggle(true, reset)
        await verifyMutation({ email, activationKey })
        setVerified(true)
        toggle(false, { delay: 500 })

        // TODO toggle() a success component
      } catch (error) {
        toggle(true, { component: <ErrorNotification error={error}></ErrorNotification> })
      }
    }
    // NOTE fixes @typescript-eslint/no-floating-promises
    // activate().catch(() => {})
    void activate()
  }, [activationKey, email])

  return (
    <>
      <h1>Se activează</h1>
      <pre>{JSON.stringify(query, null, 2)}</pre>
    </>
  )
}
VerifyPage.getLayout = (page) => (
  <Layout title="Activarea contului">
    <Suspense>{page}</Suspense>
  </Layout>
)
export default VerifyPage
