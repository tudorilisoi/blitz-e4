/**
 * This file contains the root router of your tRPC-backend
 */
import { observable } from "@trpc/server/observable"
import { clearInterval } from "timers"
import { publicProcedure, router } from "../trpc"

export const wsRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),

  // post: postRouter,

  randomNumber: publicProcedure.subscription(() => {
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
