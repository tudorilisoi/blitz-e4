import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeletePostSchema } from "../schemas"
import { guardEdit, guardPermission, mayDelete } from "src/auth/helpers"
import { postInclude } from "src/config"
import { NotFoundError } from "blitz"
import deleteImage from "src/images/mutations/deleteImage"

export default resolver.pipe(resolver.zod(DeletePostSchema), async ({ id }, context) => {
  const existing = await db.post.findFirst({ where: { id }, include: postInclude })
  if (!existing) {
    throw new NotFoundError()
  }
  await guardPermission(existing, context, mayDelete)
  for (let image of existing.images) {
    await deleteImage({ id: image.id }, context)
  }
  const post = await db.post.deleteMany({ where: { id } })

  return post
})
