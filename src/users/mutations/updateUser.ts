import { resolver } from "@blitzjs/rpc"
import db from "db"
import getCurrentUser from "../queries/getCurrentUser"
import { UpdateUserSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateUserSchema),
  resolver.authorize(),
  async ({ id, fullName }, ctx) => {
    // Add any authorization logic here if needed
    const user_ = await getCurrentUser(null, ctx)

    const user = await db.user.update({
      where: { id },
      data: { fullName },
    })

    return user
  },
)
