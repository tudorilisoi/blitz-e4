import getCurrentUser from "src/users/queries/getCurrentUser"
import { resolver } from "@blitzjs/rpc"
import db, { PostStatuses } from "db"
import { CreatePostSchema } from "../schemas"
import { makeSlug } from "src/helpers"
import getPost from "../queries/getPost"
import { guardAuthenticated } from "src/auth/helpers"
import { PostWithIncludes } from "../helpers"

export default resolver.pipe(resolver.zod(CreatePostSchema), async (input, context) => {
  await guardAuthenticated(context)
  const author = await getCurrentUser(null, context)
  const { title, body, price, currency } = input
  const data = {
    title,
    body,
    price,
    currency,
    category: { connect: { id: input.categoryId } },
    author: { connect: { id: author?.id } },
    slug: makeSlug(input.title),
    // status: 'active' as post_statuses,
    status: PostStatuses.ACTIVE,
  }
  // delete data.categoryId

  const _post = await db.post.create({ data, select: { id: true } })
  const post = await getPost({ id: _post.id }, context)
  return post
})
