import { resolver } from "@blitzjs/rpc"
import db, { UserRoles } from "db"
import { Role } from "types"
import { VerifyEmail } from "../schemas"
import { sleep } from "src/helpers"

export class VerifyEmailError extends Error {
  name = "VerifyEmailError"
  message = "Linkul de activare nu este valabil."
}

export default resolver.pipe(resolver.zod(VerifyEmail), async ({ email, activationKey }, ctx) => {
  await sleep(2000)

  const user = await db.user.findFirst({
    where: { email, activationKey },
  })

  if (!user) {
    throw new VerifyEmailError()
  }

  // TODO check if user aleady verified?

  await db.user.update({ where: { id: user.id }, data: { role: UserRoles.USER } })

  // 6. Revoke all existing login sessions for this user
  await db.session.deleteMany({ where: { userId: user.id } })

  // 7. Now log the user
  await ctx.session.$create({ userId: user.id, role: user.role as Role })

  return true
})
