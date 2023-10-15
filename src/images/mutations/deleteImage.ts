import { resolver } from "@blitzjs/rpc"
import { NotFoundError } from "blitz"
import db from "db"
import fs from "fs"
import { guardEdit } from "src/auth/helpers"
import { removeStoredImages } from "src/pages/api/poze/[[...uploadParams]]"
import { DeleteImageSchema } from "../schemas"
const fsp = fs.promises
export default resolver.pipe(
  resolver.zod(DeleteImageSchema),
  resolver.authorize(),
  async ({ id }, context) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const existing = await db.image.findFirst({ where: { id } })
    if (!existing) {
      throw new NotFoundError()
    }
    await guardEdit(existing, context)
    const image = await db.image.delete({ where: { id } })

    await removeStoredImages(existing.fileName)
    return image
  }
)
