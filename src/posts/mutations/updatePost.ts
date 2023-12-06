import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdatePostSchema } from "../schemas"
import { makeSlug, sleep } from "src/helpers"
import getPost from "../queries/getPost"
import { guardEdit } from "src/auth/helpers"

export default resolver.pipe(resolver.zod(UpdatePostSchema), async ({ id, ...input }, context) => {
  const data = {
    ...input,
    slug: makeSlug(input.title),
  }

  const existing = await db.post.findFirst({ where: { id } })
  await guardEdit(existing, context)
  await db.post.update({ where: { id }, data, select: { id: true } })
  const post = await getPost({ id }, context)
  await sleep(1500)
  return post
})
