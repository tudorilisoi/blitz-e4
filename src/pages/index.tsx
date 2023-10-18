import { Suspense } from "react"
import Link from "next/link"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import logout from "src/auth/mutations/logout"
import { useMutation } from "@blitzjs/rpc"
import { Routes, BlitzPage } from "@blitzjs/next"
import Spinner from "src/core/components/spinner/Spinner"
import { gSSP } from "src/blitz-server"
import getCategories from "src/posts/queries/getCategories"
import CategoryCell from "src/posts/components/CategoryCell"

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <>
        <button
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
        <div>
          User id: <code>{currentUser.id}</code>
          <br />
          User role: <code>{currentUser.role}</code>
        </div>
      </>
    )
  } else {
    return (
      <>
        <Link href={Routes.SignupPage()}>
          <strong>Sign Up</strong>
        </Link>
        <Link href={Routes.LoginPage()}>
          <strong>Login</strong>
        </Link>
      </>
    )
  }
}
export const getServerSideProps = gSSP(async (args) => {
  const { query, ctx } = args
  const categories = await getCategories({}, ctx)
  return { props: { categories } }
})

const Home = ({ categories }) => {
  return (
    <Layout title="Home">
      <div className="prose mb-3">
        <h1 className="text-2xl text-base-content">Anunţuri</h1>
      </div>
      <div>
        <Suspense fallback={<Spinner />}>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
            {categories.map((c) => (
              <CategoryCell key={c.id} category={c} />
            ))}
          </div>
        </Suspense>
      </div>
    </Layout>
  )
}

export default Home
