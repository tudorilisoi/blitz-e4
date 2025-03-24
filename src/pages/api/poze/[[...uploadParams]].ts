import { formatDate } from "./../../../helpers"
import { NotFoundError } from "blitz"
import db from "db"
import gm from "gm"
import fs from "fs"
import { ServerResponse } from "http"
import mime from "mime-types"
import { UPLOADS_PATH } from "src/config"
import gc from "expose-gc/function"

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
  console.log(`🚀 ~ serveUpload ~ uploadParams:`, uploadParams)
  // URI: /responsive/id/....rest or /id/...rest
  const responsive = uploadParams[0] === "responsive"
  const id = parseInt(uploadParams[!responsive ? 0 : 1])
  if (uploadParams.length > 3) {
    res.statusCode = 400
    res.end("Malformed URI")
    return
  }

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
  let _fileName = `${UPLOADS_PATH}${responsive ? "/miniaturi/" : "/"}${fileName}`
  if (responsive) {
    _fileName = _fileName.replace(/\.([^.]+)?$/, ".webp")
  }
  return _fileName
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

  const mimeType = mime.lookup(path)
  res.setHeader("Content-Type", mimeType)
  res.setHeader("Content-Length", size)
  res.setHeader("Last-Modified", mtime.toUTCString())
  res.setHeader("Cache-Control", `public, max-age=${3600}, stale-while-revalidate=59`)
  const fileStream = fs.createReadStream(path)
  // Pipe the file stream to the response stream
  fileStream.pipe(res)
  // Handle errors during streaming
  fileStream.on("error", (err) => {
    console.error("Error reading file:", err)
    res.statusCode = 500
    res.end("Internal Server Error")
  })
}

const createThumbnail = async ({ fileName, w, h }: { fileName: string; w: number; h: number }) => {
  const path = getImagePath(fileName, false)
  const destPath = getImagePath(fileName, true)
  const exists = fs.existsSync(destPath)
  if (exists) {
    return
  }
  /* await sharp(path)
    .resize(w, h, {
      kernel: sharp.kernel.nearest,
      fit: sharp.fit.inside,
      withoutEnlargement: true,
      // background: { r: 255, g: 255, b: 255, alpha: 0.5 }
    })
    .toFile(destPath)
    .then(function (info) {
      console.log("Thumb info is ", info)
      global.gc && global.gc()
    }) */

  // Read the image file
  // const imageBuffer = await fsp.readFile(path)

  // Resize the image using GraphicsMagick
  const p = new Promise((resolve, reject) => {
    const maybeReject = (err) => {
      if (err) {
        reject(err)
      }
    }
    gm(path)
      .resize(w, h, ">")
      .gravity("Center")
      // .extent(w, h)
      .toBuffer("webp", (err, buffer) => {
        maybeReject(err)
        return fsp.writeFile(destPath, buffer).then(resolve).catch(reject)
      })
  })
  const resizedImageBuffer = await p

  console.log(`Thumbnail successfully created: ${destPath}`)
  gc()
}

export const removeStoredImages = async (fileName) => {
  const paths = [getImagePath(fileName, false), getImagePath(fileName, true)]
  for (let p of paths) {
    if (fs.existsSync(p)) {
      await fsp.unlink(p)
    }
  }
}
