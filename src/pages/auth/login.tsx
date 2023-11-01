import { BlitzPage } from "@blitzjs/next"
import { useRouter } from "next/router"
import { LoginForm } from "src/auth/components/LoginForm"
import Layout from "src/core/layouts/Layout"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

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
LoginPage.getLayout = (page) => <Layout title="Conectare">{page}</Layout>
export default LoginPage
