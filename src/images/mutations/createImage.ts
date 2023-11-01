import { resolver } from "@blitzjs/rpc"
import db from "db"
import fs from "fs"

import slugify from "slugify"
import { guardAuthenticated, guardEdit } from "src/auth/helpers"
import { UPLOADS_PATH, imageSelect } from "src/config"
import getPost from "src/posts/queries/getPost"
import getCurrentUser from "src/users/queries/getCurrentUser"
import { CreateImageSchema } from "../schemas"
import sharp from "sharp"
const fsp = fs.promises

export default resolver.pipe(resolver.zod(CreateImageSchema), async (input, context) => {
  await guardAuthenticated(context)
  const author = await getCurrentUser(null, context)
  const { blob, fileName, postId } = input
  const post = await getPost({ id: postId }, context)
  await guardEdit(post, context)

  const image = await db.image.create({
    data: {
      fileName: "NOT_YET_DETERMINED",
      author: { connect: { id: author?.id } },
      post: { connect: { id: postId } },
    },
    select: imageSelect,
  })
  const normalizedName = `${postId}-${image.id}-${slugify(decodeURI(fileName))}`
  const rawData = blob.substring(blob.indexOf(",") + 1)
  let buff = Buffer.from(rawData, "base64")
  const meta = await sharp(buff).metadata()
  console.log(`🚀 ~ resolver.pipe ~ meta:`, meta)
  await fsp.writeFile(`${UPLOADS_PATH}/${normalizedName}`, buff)
  const updatedImage = await db.image.update({
    where: { id: image.id },
    data: { fileName: normalizedName, width: meta.width, height: meta.height },
  })

  return updatedImage
})
