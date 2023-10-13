import { resolver } from "@blitzjs/rpc"
import db from "db"
import fs from "fs"
import path from "path"
import getCurrentUser from "src/users/queries/getCurrentUser"
import { CreateImageSchema } from "../schemas"
const fsp = fs.promises

export default resolver.pipe(
  resolver.zod(CreateImageSchema),
  resolver.authorize(),
  async (input, context) => {
    const author = await getCurrentUser(null, context)
    const { blob, fileName, postId } = input
    const rawData = blob.replace(/^data:image\/(.+?);base64,/, "")
    const filePath = path.resolve(__dirname, "../../../../public/uploads")
    await fsp.writeFile(`${filePath}/${fileName}`, rawData)
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const image = await db.image.create({
      data: {
        fileName,
        author: { connect: { id: author?.id } },
        post: { connect: { id: postId } },
      },
    })

    return image
  }
)
