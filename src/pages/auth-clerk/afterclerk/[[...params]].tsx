import { useUser } from "@clerk/nextjs"
import { useEffect, useLayoutEffect } from "react"
import { withClerkProvider } from "src/auth-clerk/helpers"

function AfterClerkPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  let msg: any = "Nu sunteți conectat"

  if (isLoaded && isSignedIn) {
    msg = <div>Bună, {user.firstName}!</div>
  }

  useEffect(() => {
    if (!isLoaded) {
      return
    }
    console.log(`🚀 ~ AfterClerkPage ~ isLoaded:`, isLoaded)
    window.location.href = "/"
  }, [isLoaded])

  return (
    <>
      <div className="prose flex min-h-screen justify-center items-center">
        <div className=" text-center">
          <h1 className="block">{msg}</h1>
          <h2 className="block">
            <a href="/">{isLoaded ? "Pagina principală" : "Un moment..."}</a>
          </h2>
        </div>
      </div>
    </>
  )
}

export default withClerkProvider(AfterClerkPage)
