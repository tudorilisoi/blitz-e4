import { resolver } from "@blitzjs/rpc"
import { NotFoundError } from "blitz"
import db from "db"
import { postInclude } from "src/config"
import { z } from "zod"
import { PostWithIncludes } from "../helpers"
import getCurrentUser from "src/users/queries/getCurrentUser"

const GetPost = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetPost), async ({ id }, context) => {
  const author = await getCurrentUser(null, context)
  if (id === -1) {
    const newPost = {
      id,
      title: "",
      body: "",
      price: 0,
      phone: author?.phone || "",
      // currency: null,
      // categoryId: null,
    } as PostWithIncludes
    return newPost
  }

  const post = await db.post.findFirst({
    where: { id },
    include: postInclude,
  })

  if (!post) throw new NotFoundError()
  if (!post.phone) {
    post.phone = author?.phone || ""
  }

  return post
})
