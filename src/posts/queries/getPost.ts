import { resolver } from "@blitzjs/rpc"
import { NotFoundError } from "blitz"
import db from "db"
import { postInclude } from "src/config"
import { z } from "zod"
import { PostWithIncludes } from "../helpers"

const GetPost = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetPost), async ({ id }) => {
  if (id == -1) {
    const newPost = {
      id,
      title: "",
      body: "",
      price: 0,
      // currency: null,
      // categoryId: null,
    } as PostWithIncludes
    console.log(`🚀 ~ resolver.pipe ~ newPost:`, newPost)
    return newPost
  }

  const post = await db.post.findFirst({
    where: { id },
    include: postInclude,
  })

  if (!post) throw new NotFoundError()

  return post
})
