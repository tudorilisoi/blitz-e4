import { resolver } from "@blitzjs/rpc"
import db, { Category, Prisma } from "db"
import { CategoryWithCounters } from "../helpers"

interface GetCategoriesInput extends Pick<Prisma.CategoryFindManyArgs, "where" | "orderBy"> {}

export default resolver.pipe(async ({ where, orderBy }: GetCategoriesInput) => {
  const categories = await db.category.findMany({ where, orderBy })
  const res: CategoryWithCounters[] = []
  for (const c of categories) {
    const postCount = await db.post.count({ where: { categoryId: c.id } })
    res.push({ ...c, postCount })
  }
  return res
})
