import { AppProps, ErrorBoundary, ErrorFallbackProps } from "@blitzjs/next"
import { AuthenticationError, AuthorizationError } from "blitz"
import { ReactNode } from "react"
import { withBlitz } from "src/blitz-client"
import { ErrorIcon } from "src/core/components/ErrorNotification"
import ViewportCentered from "src/core/components/spinner/ViewPortCentered"
import Layout from "src/core/layouts/Layout"
import "src/styles/init.css"
import { trpc } from "src/ws-utils/trpc"

function RootErrorFallback({ error }: ErrorFallbackProps) {
  let returnValue: ReactNode | null = null
  if (error instanceof AuthenticationError) {
    returnValue = "Must login"
  } else if (error instanceof AuthorizationError) {
    returnValue = "Not authorized"
  } else {
    returnValue = error.message || error.name
  }
  return (
    <Layout>
      <ViewportCentered>
        <div className="flex flex-col place-content-center mx-auto rounded-2xl min-h-[40vh] w-[50vw] bg-black bg-opacity-80 text-center">
          <span className="inline-block mb-4">
            <ErrorIcon />
          </span>
          <h1 className="text-2xl text-error">{returnValue}</h1>
        </div>
      </ViewportCentered>
    </Layout>
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

export default trpc.withTRPC(withBlitz(MyApp))
