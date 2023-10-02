import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdatePostSchema } from "../schemas"
import { makeSlug } from "src/helpers"

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default resolver.pipe(
  resolver.zod(UpdatePostSchema),
  resolver.authorize(),
  async ({ id, ...input }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const data = {
      ...input,
      slug: makeSlug(input.title),
    }
    const post = await db.post.update({ where: { id }, data })
    await delay(1500)
    return post
  }
)
