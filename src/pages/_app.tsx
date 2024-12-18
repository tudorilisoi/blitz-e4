import { AppProps, ErrorBoundary, ErrorFallbackProps, Routes } from "@blitzjs/next"
import { AuthenticationError, AuthorizationError } from "blitz"
import Link from "next/link"
import React, { ReactNode } from "react"
import "src/../public/fonts/fonts.css"
import { withBlitz } from "src/blitz-client"
import { ErrorIcon, InfoIcon } from "src/core/components/notifications"
import { messageWrapperClassName } from "src/core/components/overlay/OverlayProvider"
import ViewportCentered from "src/core/components/spinner/ViewPortCentered"
import Layout from "src/core/layouts/Layout"
import "src/styles/init.css"
import { ClerkProvider } from "@clerk/nextjs"
import { roRO } from "@clerk/localizations"

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
        <p className="text-2xl text-info">{"Trebuie să vă conectaţi"}</p>
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
        <p className="text-2xl text-error">{"Acces refuzat"}</p>
      </>
    )
  } else {
    returnValue = (
      <>
        <span className="inline-block mb-4">
          <InfoIcon />
        </span>
        <p className="text-2xl text-info">{error.message || error.name}</p>
      </>
    )
  }
  // Note forceOverlay to achieve the OverlayProvider effect
  return (
    <>
      <ClerkProvider localization={roRO}>
        <Layout forceOverlay={true}>
          <h1 className="text-2xl text-error">{returnValue}</h1>
        </Layout>
        <ViewportCentered>
          <div className={messageWrapperClassName}>{returnValue}</div>
        </ViewportCentered>
      </ClerkProvider>
    </>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <ErrorBoundary FallbackComponent={RootErrorFallback}>
      <ClerkProvider localization={roRO} {...pageProps}>
        {getLayout(<Component {...pageProps} />)}
      </ClerkProvider>
    </ErrorBoundary>
  )
}

// TODO maybe enable WS withTRPC on individual pages
// export default trpc.withTRPC(withBlitz(MyApp))
export default withBlitz(MyApp)
