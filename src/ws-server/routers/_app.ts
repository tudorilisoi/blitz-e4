/**
 * This file contains the root router of your tRPC-backend
 */
import { observable } from "@trpc/server/observable"
import { clearInterval } from "timers"
import { publicProcedure, router } from "../trpc"
import getCurrentUser from "src/users/queries/getCurrentUser"

export const wsRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),

  // post: postRouter,

  randomNumber: publicProcedure.subscription(async ({ ctx }) => {
    const user = await getCurrentUser(null, ctx)
    console.log(`🚀 ~ randomNumber:publicProcedure.subscription ~ user:`, user)
    return observable<number>((emit) => {
      const int = setInterval(() => {
        emit.next(Math.random())
      }, 1000)
      return () => {
        clearInterval(int)
      }
    })
  }),
})

export type WSRouter = typeof wsRouter
