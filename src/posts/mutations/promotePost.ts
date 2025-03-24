import { resolver } from "@blitzjs/rpc"
import { NotFoundError } from "blitz"
import db, { PROMOTION_LEVELS } from "db"
import { guardPermission, mayPromote } from "src/auth/helpers"
import { postInclude } from "src/config"
import getPost from "../queries/getPost"
import { DeletePostSchema } from "../schemas"

export default resolver.pipe(resolver.zod(DeletePostSchema), async ({ id }, context) => {
  const existing = await db.post.findFirst({ where: { id }, include: postInclude })
  if (!existing) {
    throw new NotFoundError()
  }
  await guardPermission(existing, context, mayPromote)

  const newLevel = existing.promotionLevel === 0 ? PROMOTION_LEVELS.FRONTPAGE : 0

  await db.post.update({
    where: { id },
    data: { promotionLevel: newLevel },
    select: { id: true },
  })
  const post = await getPost({ id }, context)

  return post
})
