import { resolver } from "@blitzjs/rpc"
import { NotFoundError } from "blitz"
import db from "db"
import { authorSelect } from "src/config"
import { z } from "zod"

const GetUser = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetUser), async ({ id }) => {
  const user = await db.user.findFirst({
    where: { id },
    select: authorSelect,
  })

  if (!user) throw new NotFoundError()

  return user
})
