import { BlitzPage, Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import { SignupForm } from "src/auth/components/SignupForm"
import Layout from "src/core/layouts/Layout"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <>
      <SignupForm onSuccess={() => router.push(Routes.Home())} />
    </>
  )
}
SignupPage.getLayout = (page) => <Layout title="Creează cont">{page}</Layout>
export default SignupPage
