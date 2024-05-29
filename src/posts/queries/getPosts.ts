import { PostWithIncludes } from "src/posts/helpers"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { postInclude } from "src/config"
import { getPermissionsForPosts } from "./getPermissions"

interface GetPostsInput
  extends Pick<
    Prisma.PostFindManyArgs,
    "where" | "orderBy" | "skip" | "take" | "cursor" | "distinct"
  > {}

export default resolver.pipe(
  async (
    {
      where,
      orderBy = { id: "asc" },
      skip = 0,
      take = 100,
      cursor = { id: -1 },
      distinct = "id",
    }: GetPostsInput,
    ctx
  ) => {
    let findArgs: Prisma.PostFindManyArgs = {
      skip,
      take,
      where,
      orderBy,
      include: postInclude,
      cursor,
      distinct,
    }
    if (cursor?.id === -1) {
      delete findArgs.cursor
    }
    if (distinct === "id") {
      delete findArgs.distinct
    }
    const posts = (await db.post.findMany(findArgs)) as PostWithIncludes[]

    const permissions = await getPermissionsForPosts(posts, ctx)
    return {
      posts,
      permissions,
    }
  }
)
