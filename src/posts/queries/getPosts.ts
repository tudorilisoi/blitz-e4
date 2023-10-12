import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma, User } from "db"

interface GetPostsInput
  extends Pick<Prisma.PostFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

const UNSAFE_USER_FIELDS = "activationKey hashedPassword".split(" ")
//@ts-ignore
let userFields: any = Prisma.dmmf.datamodel.models.find((model) => model.name === "User").fields
// NOTE get all scalar-like fields and omit sensitive fields
userFields = userFields.filter((f) => f.kind !== "object").map((f) => f.name)
const authorSelect = userFields.reduce((acc, f) => {
  if (!UNSAFE_USER_FIELDS.includes(f)) {
    acc[f] = true
  }
  return acc
}, userFields)

export { authorSelect }

export default resolver.pipe(
  // resolver.authorize(),

  async ({ where, orderBy, skip = 0, take = 100 }: GetPostsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
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
          include: {
            author: { select: authorSelect },
            images: { select: { id: true, fileName: true } },
          },
        }),
    })

    return {
      posts,
      nextPage,
      hasMore,
      count,
    }
  }
)
