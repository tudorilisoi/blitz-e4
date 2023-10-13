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
    console.log("ENV", process.env)
    const author = await getCurrentUser(null, context)
    const { blob, fileName, postId } = input
    const rawData = blob.substring(blob.indexOf(",") + 1)
    let buff = Buffer.from(rawData, "base64")

    const filePath = path.resolve(process.cwd(), "public/uploads")
    await fsp.writeFile(`${filePath}/${fileName}`, buff)
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const image = await db.image.create({
      data: {
        fileName,
        author: { connect: { id: author?.id } },
        post: { connect: { id: postId } },
      },
      select: { id: true, fileName: true },
    })

    return image
  }
)
