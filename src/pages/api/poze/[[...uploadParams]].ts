import db from "db"
import fs from "fs"
import { ServerResponse } from "http"
import mime from "mime-types"
import { UPLOADS_PATH } from "src/config"
const fsp = fs.promises
// NOTE Only assets that are in the public directory at build time will be served by Next.js
// Because of this we need to serve uploads dynamically
export default async function serveUpload(req, res: ServerResponse) {
  console.log(req.query)
  const { uploadParams } = req.query
  const id = parseInt(uploadParams[0])
  try {
    // TODO make a serveImage utility function
    const image = await db.image.findFirst({ where: { id } })
    const path = `${UPLOADS_PATH}/${image?.fileName}`
    const blob = await fsp.readFile(path)
    const mimeType = mime.lookup(path)
    res.setHeader("Content-Type", mimeType)
    res.statusCode = 200
    res.write(blob)
    res.end()
  } catch (error) {
    // throw new NotFoundError("No such record")

    const notFoundPath = `${process.cwd()}/public/404.webp`
    const blob = await fsp.readFile(notFoundPath)
    const mimeType = mime.lookup(notFoundPath)
    res.setHeader("Content-Type", mimeType)
    res.statusCode = 404
    res.write(blob)
    res.end()
    return
  }
}
