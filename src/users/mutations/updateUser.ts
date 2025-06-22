import { resolver } from "@blitzjs/rpc"
import { AuthorizationError } from "blitz"
import db from "db"
import { guardAuthenticated } from "src/auth/helpers"
import { UpdateUserSchema } from "../schemas"

export default resolver.pipe(resolver.zod(UpdateUserSchema), async ({ id, fullName }, ctx) => {
  const currentUser = await guardAuthenticated(ctx)
  if (currentUser?.role !== "SUPERADMIN") {
    if (id !== currentUser.id) {
      throw new AuthorizationError("Acces refuzat")
    }
  }

  const user = await db.user.update({
    where: { id },
    data: { fullName },
  })

  return user
})
