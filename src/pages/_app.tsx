import { AppProps, ErrorBoundary, ErrorFallbackProps, Routes } from "@blitzjs/next"
import { AuthenticationError, AuthorizationError } from "blitz"
import React, { ReactNode } from "react"
import { withBlitz } from "src/blitz-client"
import { ErrorIcon, InfoIcon } from "src/core/components/notifications"
import { messageWrapperClassName } from "src/core/components/overlay/OverlayProvider"
import ViewportCentered from "src/core/components/spinner/ViewPortCentered"
import Layout from "src/core/layouts/Layout"
import "src/styles/init.css"
// import { trpc } from "src/ws-utils/trpc"
import Link from "next/link"

// "react-photo-gallery" does funky measurements in the DOM
// this upsets next.js, monkey patch FTW
// TODO maybe wrap the Imagegallery in next/dynamic
if (typeof window === "undefined") {
  React.useLayoutEffect = React.useEffect
}

function RootErrorFallback({ error }: ErrorFallbackProps) {
  let returnValue: ReactNode | null = null
  if (error instanceof AuthenticationError) {
    returnValue = (
      <>
        <span className="inline-block mb-4">
          <InfoIcon />
        </span>
        <h1 className="text-2xl text-info">{"Trebuie să vă conectaţi"}</h1>
        <Link className="mt-4 btn btn-info" href={Routes.LoginPage()}>
          {"Conectare"}
        </Link>
      </>
    )
  } else if (error instanceof AuthorizationError) {
    returnValue = (
      <>
        <span className="inline-block mb-4">
          <ErrorIcon />
        </span>
        <h1 className="text-2xl text-error">{"Acces refuzat"}</h1>
      </>
    )
  } else {
    returnValue = (
      <>
        <span className="inline-block mb-4">
          <InfoIcon />
        </span>
        <h1 className="text-2xl text-info">{error.message || error.name}</h1>
      </>
    )
  }
  // Note forceOverlay to achieve the OverlayProvider effect
  return (
    <>
      <Layout forceOverlay={true}>
        <h1 className="text-2xl text-error">{returnValue}</h1>
      </Layout>
      <ViewportCentered>
        <div className={messageWrapperClassName}>{returnValue}</div>
      </ViewportCentered>
    </>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <ErrorBoundary FallbackComponent={RootErrorFallback}>
      {getLayout(<Component {...pageProps} />)}
    </ErrorBoundary>
  )
}

// TODO maybe enable WS withTRPC on individual pages
// export default trpc.withTRPC(withBlitz(MyApp))
export default withBlitz(MyApp)
