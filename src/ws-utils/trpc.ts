import { httpBatchLink } from "@trpc/client/links/httpBatchLink"
import { loggerLink } from "@trpc/client/links/loggerLink"
import { wsLink, createWSClient } from "@trpc/client/links/wsLink"
import { createTRPCNext } from "@trpc/next"
import type { inferProcedureOutput } from "@trpc/server"
import { NextPageContext } from "next"
import { WSRouter } from "src/ws-server/routers/_app"
import superjson from "superjson"

// ℹ️ Type-only import:
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export

function getEndingLink(ctx: NextPageContext | undefined) {
  if (typeof window === "undefined") {
    return httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_NEXT_PUBLIC_APP_URL}/api/trpc`,
      headers() {
        if (!ctx?.req?.headers) {
          return {}
        }
        // on ssr, forward client's headers to the server
        return {
          ...ctx.req.headers,
          "x-ssr": "1",
        }
      },
    })
  }
  const client = createWSClient({
    url: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001",
  })
  return wsLink<WSRouter>({
    client,
  })
}

/**
 * A set of strongly-typed React hooks from your `wsRouter` type signature with `createReactQueryHooks`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */
export const trpc = createTRPCNext<WSRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */

    return {
      /**
       * @link https://trpc.io/docs/client/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        // loggerLink({
        //   enabled: (opts) =>
        //     (process.env.NODE_ENV === "development" && typeof window !== "undefined") ||
        //     (opts.direction === "down" && opts.result instanceof Error),
        // }),
        getEndingLink(ctx),
      ],
      /**
       * @link https://trpc.io/docs/data-transformers
       */
      transformer: superjson,
      /**
       * @link https://tanstack.com/query/v4/docs/react/reference/QueryClient
       */
      queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})

// export const transformer = superjson;
/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
export type inferQueryOutput<TRouteKey extends keyof WSRouter["_def"]["queries"]> =
  inferProcedureOutput<WSRouter["_def"]["queries"][TRouteKey]>