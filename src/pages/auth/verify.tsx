import { BlitzPage } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import verifyEmail from "src/auth/mutations/verifyEmail"
import { ErrorNotification } from "src/core/components/ErrorNotification"
import { useOverlay } from "src/core/components/overlay/OverlayProvider"
import Layout from "src/core/layouts/Layout"

const VerifyPage: BlitzPage = () => {
  const router = useRouter()
  const { toggle, reset } = useOverlay()
  const searchParams = useSearchParams()
  // console.log(`🚀 ~ searchParams:`, searchParams)
  const email = searchParams.get("email") || ""
  const activationKey = searchParams.get("activationKey") || ""
  const [verifyMutation] = useMutation(verifyEmail)
  const [loaded, setLoaded] = useState(0)
  useEffect(() => {
    setLoaded((v) => v + 1)
  }, [])

  useEffect(() => {
    if (!loaded) {
      return
    }
    if (!email || !activationKey) {
      const error = new Error("Link de activare incomplet")
      toggle(true, { component: <ErrorNotification error={error}></ErrorNotification> })
      return
    }

    console.log(`render # ${loaded}`)
    console.log(`🚀 ~ activationKey:`, loaded, activationKey, email)

    const activate = async (): Promise<void> => {
      try {
        toggle(true, reset)
        await verifyMutation({ email, activationKey })

        // TODO toggle() a success component
      } catch (error) {
        toggle(true, { component: <ErrorNotification error={error}></ErrorNotification> })
      }
    }
    // NOTE fixes @typescript-eslint/no-floating-promises
    activate().catch(() => {})
  }, [searchParams, loaded])
  return <></>
}
VerifyPage.getLayout = (page) => <Layout title="Conectare">{page}</Layout>
export default VerifyPage
