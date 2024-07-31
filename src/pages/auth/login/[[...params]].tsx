import { BlitzPage } from "@blitzjs/next"
import { SignedOut, SignIn } from "@clerk/nextjs"
import { useRouter } from "next/router"
import { Suspense, useEffect, useState } from "react"
import { clerkOptions } from "src/auth-clerk/clerkOptions"
import { ClerkProviderWrapper, loadClerk } from "src/auth-clerk/helpers"
import { LoginForm } from "src/auth/components/LoginForm"
import { useRedirectToUserHome } from "src/core/components/useRedirectToUserHome"
import Layout from "src/core/layouts/Layout"
import { canonical } from "src/helpers"

// export const getServerSideProps = gSSPU(({ ctx, query }) => {
//   console.log(`🚀 ~ getServerSideProps ~ query:`, query)
//   return { props: { foo: "bar" } }
// })
const LoginPage: BlitzPage = () => {
  const router = useRouter()
  useRedirectToUserHome()
  const [activeTab, setActiveTab] = useState("social")
  const activeTabClass = "tab-active bg-secondary bg-opacity-80"
  const tabClass = "tab  !rounded-none bg-primary bg-opacity-40 hover:bg-primary"
  const socialTabClass = `${tabClass}    ${activeTab === "social" ? activeTabClass : ""}`
  const localTabClass = ` ${tabClass}  ${activeTab === "local" ? activeTabClass : ""}`

  useEffect(() => {
    loadClerk()
      .then((clerk) => {
        console.log("clerk loaded", clerk)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  return (
    <>
      <div className="prose mb-3">
        <h1 className="text-2xl text-base-content">Conectare</h1>
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
            <Suspense>
              <ClerkProviderWrapper>
                <div className="flex flex-col items-center justify-center py-8">
                  <div>
                    <SignedOut>
                      <SignIn forceRedirectUrl={canonical(clerkOptions.afterSignInUrl)} />
                    </SignedOut>
                  </div>
                </div>
              </ClerkProviderWrapper>
            </Suspense>
          </div>
          <div className={`${activeTab === "local" ? "mt-4" : "hidden"}`}>
            <LoginForm
              onSuccess={(_user) => {
                const next = router.query.next
                  ? decodeURIComponent(router.query.next as string)
                  : "/"
                return router.push(next)
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
LoginPage.getLayout = (page) => (
  <Layout title="Conectare">
    <Suspense>{page}</Suspense>
  </Layout>
)
export default LoginPage
