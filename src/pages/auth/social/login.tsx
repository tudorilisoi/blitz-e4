import { BlitzPage } from "@blitzjs/next"
import { useEarthoOne } from "@eartho/one-client-react"
import { Suspense, useEffect, useState } from "react"
import Layout from "src/core/layouts/Layout"

const SocialLoginPage: BlitzPage = () => {
  const { isLoading, isConnected, error, user, connectWithPopup, logout } = useEarthoOne()
  console.log("USER", user)

  if (isLoading) {
    return <div>Loading...</div>
  }
  // if (error) {
  //   return <div>Oops... {error.message}</div>
  // }

  if (isConnected && user) {
    return (
      <div>
        Hello {user.displayName}{" "}
        <button
          onClick={() => {
            logout().catch((e) => {
              console.log(`LOGOUT ERR`, e)
            })
            // .finally(() => {
            //   window.location.reload()
            // })
          }}
        >
          Log out
        </button>
      </div>
    )
  } else {
    return (
      <button
        className="btn btn-outline-success"
        id="login"
        onClick={() =>
          connectWithPopup({
            accessId: process.env.NEXT_PUBLIC_EARTHO_ACCESS_ID || "! ACCCES_ID_NOT_SET !",
            enabledAuthProviders: ["facebook", "google", "apple"],
          })
        }
      >
        Log in
      </button>
    )
  }
}
SocialLoginPage.getLayout = (page) => (
  <Layout title="Conectare">
    <Suspense>{page}</Suspense>
  </Layout>
)
export default SocialLoginPage
