import { resolver } from "@blitzjs/rpc"
import { NotFoundError } from "blitz"
import db from "db"
import { postInclude } from "src/config"
import { z } from "zod"

const GetPost = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetPost), async ({ id }) => {
  const post = await db.post.findFirst({
    where: { id },
    include: postInclude,
  })

  if (!post) throw new NotFoundError()

  return post
})
