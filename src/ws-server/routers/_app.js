"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.wsRouter = void 0
/**
 * This file contains the root router of your tRPC-backend
 */
var observable_1 = require("@trpc/server/observable")
var timers_1 = require("timers")
var trpc_1 = require("../trpc")
exports.wsRouter = (0, trpc_1.router)({
  healthcheck: trpc_1.publicProcedure.query(function () {
    return "yay!"
  }),
  // post: postRouter,
  randomNumber: trpc_1.publicProcedure.subscription(function () {
    return (0, observable_1.observable)(function (emit) {
      var int = setInterval(function () {
        emit.next(Math.random())
      }, 1000)
      return function () {
        ;(0, timers_1.clearInterval)(int)
      }
    })
  }),
})
