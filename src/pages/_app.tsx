import { AppProps, ErrorBoundary, ErrorComponent, ErrorFallbackProps } from "@blitzjs/next"
import { AuthenticationError, AuthorizationError } from "blitz"
import { withBlitz } from "src/blitz-client"
import ViewportCentered from "src/core/components/spinner/ViewPortCentered"
import "src/styles/init.css"
import { trpc } from "src/ws-utils/trpc"

function RootErrorFallback({ error }: ErrorFallbackProps) {
  let returnValue: JSX.Element | null = null
  if (error instanceof AuthenticationError) {
    returnValue = <div>Error: You are not authenticated</div>
  } else if (error instanceof AuthorizationError) {
    returnValue = (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    returnValue = (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error.message || error.name}
      />
    )
  }
  return <ViewportCentered>{returnValue}</ViewportCentered>
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
