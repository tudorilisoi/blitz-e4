import getCurrentUser from "src/users/queries/getCurrentUser"
import { resolver } from "@blitzjs/rpc"
import db, { PostStatuses } from "db"
import { CreatePostSchema } from "../schemas"
import { makeSlug } from "src/helpers"

export default resolver.pipe(
  resolver.zod(CreatePostSchema),
  resolver.authorize(),
  async (input, context) => {
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
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const post = await db.post.create({ data })

    return post
  }
)
