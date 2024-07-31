import { BlitzPage } from "@blitzjs/next"
import { SignedOut, SignUp } from "@clerk/nextjs"
import { useRouter } from "next/router"
import { Suspense, useState } from "react"
import { clerkOptions } from "src/auth-clerk/clerkOptions"
import { ClerkProviderWrapper } from "src/auth-clerk/helpers"
import { SignupForm } from "src/auth/components/SignupForm"
import { InfoIcon } from "src/core/components/notifications"
import {
  messageClassName,
  messageWrapperClassName,
  useOverlay,
} from "src/core/components/overlay/OverlayProvider"
import ViewportCentered from "src/core/components/spinner/ViewPortCentered"
import { useRedirectToUserHome } from "src/core/components/useRedirectToUserHome"
import Layout from "src/core/layouts/Layout"
import { canonical } from "src/helpers"

const SignupPage: BlitzPage = () => {
  const router = useRouter()
  const { toggle } = useOverlay()
  useRedirectToUserHome()
  const [activeTab, setActiveTab] = useState("social")
  const activeTabClass = "tab-active bg-secondary bg-opacity-80"
  const tabClass = "tab  !rounded-none bg-primary bg-opacity-40 hover:bg-primary"
  const socialTabClass = `${tabClass}    ${activeTab === "social" ? activeTabClass : ""}`
  const localTabClass = ` ${tabClass}  ${activeTab === "local" ? activeTabClass : ""}`

  const successNotification = (
    <ViewportCentered>
      <div className={messageWrapperClassName}>
        <div className="text-center">
          <InfoIcon />
        </div>
        <h2 className={messageClassName}>{"Contul a fost creat"}</h2>
        <h3 className="text-2xl text-neutral-content">
          {"Citiţi e-mailul (inclusiv secţiunea spam) pentru a activa contul"}
        </h3>
        {/* <button
          onClick={() => {
            toggle(false)
          }}
          className="btn btn-secondary"
        >
          OK
        </button> */}
      </div>
    </ViewportCentered>
  )

  return (
    <>
      <div className="prose mb-3">
        <h1 className="text-2xl text-base-content">Creează cont</h1>
      </div>

      <div className=" ">
        <div className="tabs  tabs-lg  ">
          <span className={socialTabClass} onClick={() => setActiveTab("social")}>
            Cu rețele sociale
          </span>
          <span className={localTabClass} onClick={() => setActiveTab("local")}>
            Cu email și parola
          </span>
        </div>
        <div className="bordered border-[1px] rounded-lg rounded-t-none border-primary p-4  ">
          <div className={`${activeTab === "social" ? "" : "hidden"}`}>
            <div className="flex flex-col items-center justify-center py-8">
              <div>
                <Suspense>
                  <ClerkProviderWrapper>
                    <SignedOut>
                      <SignUp forceRedirectUrl={canonical(clerkOptions.afterSignUpUrl)} />
                    </SignedOut>
                  </ClerkProviderWrapper>
                </Suspense>
              </div>
            </div>
          </div>
          <div className={`${activeTab === "local" ? "mt-4" : "hidden"}`}>
            <SignupForm onSuccess={() => toggle(true, { component: successNotification })} />
          </div>
        </div>
      </div>
    </>
  )
}
SignupPage.getLayout = (page) => (
  <Layout title="Creează cont">
    <Suspense>{page}</Suspense>
  </Layout>
)
export default SignupPage
