import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import db, { Prisma } from "db"
import { postInclude } from "src/config"
import { getPermissionsForPosts } from "./getPermissions"

interface getPaginatedPostsInput
  extends Pick<Prisma.PostFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  async ({ where, orderBy, skip = 0, take = 100 }: getPaginatedPostsInput, ctx) => {
    const {
      items: posts,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.post.count({ where }),
      query: (paginateArgs) =>
        db.post.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include: postInclude,
        }),
    })
    const numPages = Math.ceil(count / take)
    const permissions = await getPermissionsForPosts(posts, ctx)
    return {
      posts,
      permissions,
      nextPage,
      hasMore,
      count,
      numPages,
    }
  }
)
