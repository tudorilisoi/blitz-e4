import { formatDate } from "./../../../helpers"
import { NotFoundError } from "blitz"
import db from "db"
import fs from "fs"
import { ServerResponse } from "http"
import mime from "mime-types"
import sharp from "sharp"
import { UPLOADS_PATH } from "src/config"
const fsp = fs.promises
// NOTE Only assets that are in the public directory at build time will be served by Next.js
// Because of this we need to serve uploads dynamically

// 16:9 ratio
const responsiveSize = {
  w: 600,
  h: 340,
}

export default async function serveUpload(req, res: ServerResponse) {
  // console.log("serveUpload:", req.headers)
  const { uploadParams } = req.query
  // URI: /responsive/id/....rest or /id/...rest
  const responsive = uploadParams[0] === "responsive"
  const id = parseInt(uploadParams[!responsive ? 0 : 1])
  try {
    const image = await db.image.findFirst({ where: { id } })
    if (!image) {
      throw new NotFoundError("No such record")
    }
    if (responsive) {
      await createThumbnail({
        fileName: image.fileName,
        ...responsiveSize,
      })
    }
    const path = getImagePath(image.fileName, responsive)
    res.statusCode = 200
    await serveImage(res, req, path)
  } catch (error) {
    const notFoundPath = `${process.cwd()}/public/404.webp`
    res.statusCode = 404
    await serveImage(res, req, notFoundPath)

    return
  }
}
export const getImagePath = (fileName: string, responsive: boolean) => {
  return `${UPLOADS_PATH}${responsive ? "/miniaturi/" : "/"}${fileName}`
}

const serveImage = async (res, req, path) => {
  const { mtime, size } = fs.statSync(path)
  var reqModDate = req.headers["if-modified-since"]

  //check if if-modified-since header is the same as the mtime of the file
  if (reqModDate != null) {
    reqModDate = new Date(reqModDate)
    console.log(
      `🚀 ~ serveImage ~ if-modified-since:`,
      formatDate(reqModDate, formatDate.longDateTime)
    )
    if (reqModDate.getTime() < mtime.getTime()) {
      res.statusCode = 304
      console.log(`304 ${path}`)
      res.setHeader("Last-Modified", mtime.toUTCString())
      res.end()
      return true
    }
  }

  const blob = await fsp.readFile(path)
  const mimeType = mime.lookup(path)
  res.setHeader("Content-Type", mimeType)
  res.setHeader("Content-Length", size)
  res.setHeader("Last-Modified", mtime.toUTCString())
  res.setHeader("Cache-Control", `public, max-age=${3600}, stale-while-revalidate=59`)
  res.write(blob)
  res.end()
}

const createThumbnail = async ({ fileName, w, h }: { fileName: string; w: number; h: number }) => {
  const path = getImagePath(fileName, false)
  const destPath = getImagePath(fileName, true)
  const exists = fs.existsSync(destPath)
  if (exists) {
    return
  }
  await sharp(path)
    .resize(w, h, {
      kernel: sharp.kernel.nearest,
      fit: sharp.fit.inside,
      withoutEnlargement: true,
      // background: { r: 255, g: 255, b: 255, alpha: 0.5 }
    })
    .toFile(destPath)
    .then(function (info) {
      console.log("Thumb info is ", info)
    })
}

export const removeStoredImages = async (fileName) => {
  const paths = [getImagePath(fileName, false), getImagePath(fileName, true)]
  for (let p of paths) {
    if (fs.existsSync(p)) {
      await fsp.unlink(p)
    }
  }
}
