import { BlitzPage } from "@blitzjs/next"
import { useRouter } from "next/router"
import { Suspense } from "react"
import { LoginForm } from "src/auth/components/LoginForm"
import { useRedirectToUserHome } from "src/core/components/useRedirectToUserHome"
import Layout from "src/core/layouts/Layout"

// export const getServerSideProps = gSSPU(({ ctx, query }) => {
//   console.log(`🚀 ~ getServerSideProps ~ query:`, query)
//   return { props: { foo: "bar" } }
// })
const LoginPage: BlitzPage = () => {
  const router = useRouter()
  useRedirectToUserHome()

  return (
    <>
      <LoginForm
        onSuccess={(_user) => {
          const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"
          return router.push(next)
        }}
      />
    </>
  )
}
LoginPage.getLayout = (page) => (
  <Layout title="Conectare">
    <Suspense>{page}</Suspense>
  </Layout>
)
export default LoginPage
