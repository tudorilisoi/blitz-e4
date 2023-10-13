import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteImageSchema } from "../schemas"
import { guardEdit, mayEdit } from "src/auth/helpers"
import { AuthorizationError, NotFoundError } from "blitz"

export default resolver.pipe(
  resolver.zod(DeleteImageSchema),
  resolver.authorize(),
  async ({ id }, context) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const existing = await db.image.findFirst({ where: { id } })
    await guardEdit(existing, context)
    const image = await db.image.deleteMany({ where: { id } })

    return image
  }
)