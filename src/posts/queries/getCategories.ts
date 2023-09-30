import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetCategoriesInput extends Pick<Prisma.CategoryFindManyArgs, "where" | "orderBy"> {}

export default resolver.pipe(async ({ where, orderBy }: GetCategoriesInput) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const categories = await db.category.findMany({ where, orderBy })
  return categories
})
