import { BlitzPage } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import { useEffect } from "react"
import verifyEmail from "src/auth/mutations/verifyEmail"
import { ErrorNotification } from "src/core/components/ErrorNotification"
import { useOverlay } from "src/core/components/overlay/OverlayProvider"
import Layout from "src/core/layouts/Layout"

const VerifyPage: BlitzPage = () => {
  const router = useRouter()
  const { toggle } = useOverlay()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const activationKey = searchParams.get("activationKey") || ""
  console.log(`🚀 ~ activationKey:`, activationKey, email)
  const [verifyMutation] = useMutation(verifyEmail)
  useEffect(() => {
    const activate = async (): Promise<void> => {
      try {
        await verifyMutation({ email, activationKey })

        // TODO toggle() a success component
      } catch (error) {
        toggle(true, { component: <ErrorNotification error={error}></ErrorNotification> })
      }
    }
    // NOTE fixes @typescript-eslint/no-floating-promises
    activate().catch(() => {})
  }, [])
  return <></>
}
VerifyPage.getLayout = (page) => <Layout title="Conectare">{page}</Layout>
export default VerifyPage
