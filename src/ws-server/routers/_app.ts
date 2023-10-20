/**
 * This file contains the root router of your tRPC-backend
 */
import { router, publicProcedure } from "../trpc"
import { postRouter } from "./post"
import { observable } from "@trpc/server/observable"
import { clearInterval } from "timers"

export const wsRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),

  post: postRouter,

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

export type wsRouter = typeof wsRouter
