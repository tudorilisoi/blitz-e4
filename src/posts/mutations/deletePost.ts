import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeletePostSchema } from "../schemas"
import { guardEdit } from "src/auth/helpers"

export default resolver.pipe(resolver.zod(DeletePostSchema), async ({ id }, context) => {
  const existing = await db.post.findFirst({ where: { id } })
  await guardEdit(existing, context)
  const post = await db.post.deleteMany({ where: { id } })

  return post
})
