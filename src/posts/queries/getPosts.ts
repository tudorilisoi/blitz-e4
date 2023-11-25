import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import db, { Prisma } from "db"
import { postInclude } from "src/config"
import { getPermissionsForPosts } from "./getPermissions"

interface GetPostsInput
  extends Pick<Prisma.PostFindManyArgs, "where" | "orderBy" | "skip" | "take" | "cursor"> {}

export default resolver.pipe(
  async (
    { where, orderBy = { id: "asc" }, skip = 0, take = 100, cursor = { id: -1 } }: GetPostsInput,
    ctx
  ) => {
    let findArgs: Prisma.PostFindManyArgs = {
      skip,
      take,
      where,
      orderBy,
      include: postInclude,
      cursor,
    }
    if (cursor?.id === -1) {
      delete findArgs.cursor
    }
    const posts = await db.post.findMany(findArgs)

    const permissions = await getPermissionsForPosts(posts, ctx)
    return {
      posts,
      permissions,
    }
  }
)
