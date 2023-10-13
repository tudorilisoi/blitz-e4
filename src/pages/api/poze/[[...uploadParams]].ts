import { NotFoundError } from "blitz"
import db from "db"
import fs from "fs"
import { UPLOADS_PATH } from "src/images/mutations/createImage"
import mime from "mime-types"
import { ServerResponse } from "http"
const fsp = fs.promises
// NOTE Only assets that are in the public directory at build time will be served by Next.js
// Because of this we need to serve uploads dynamically
export default async function serveUpload(req, res: ServerResponse) {
  console.log(req.query)
  const { uploadParams } = req.query
  const id = parseInt(uploadParams[0])
  const image = await db.image.findFirst({ where: { id } })
  if (!image) {
    throw new NotFoundError("No such record")
  }
  const path = `${UPLOADS_PATH}/${image.fileName}`
  const blob = await fsp.readFile(path)
  const mimeType = mime.lookup(path)
  res.setHeader("Content-Type", mimeType)
  res.statusCode = 200
  res.write(blob)
  res.end()
}
