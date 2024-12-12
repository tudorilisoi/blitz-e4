import { S, makeSlug } from "../src/helpers"
import { LRUCache } from "lru-cache"

// To access your database
// Append api/* to import from api and web/* to import from web
import { Post, PostStatuses, Prisma } from "@prisma/client"
import fs from "fs"

import db from "./index"

// NOTE saves 5 seconds :P
const postsCache = new LRUCache({ max: 5000 })

const cliProgress = require("cli-progress")

// create new container
const multibar = new cliProgress.MultiBar(
  {
    fps: 5,
    clearOnComplete: false,
    hideCursor: true,
    forceRedraw: true,
    etaBuffer: 100,
    format: "{model}[{bar}] {percentage}% | ETA: {eta}s | {value}/{total}",
  },
  cliProgress.Presets.shades_grey
)

const logger = (...args) => {
  const str = args.map((a) => a as string).join(" ")
  multibar.log("> " + str + "\n")
  // console.log("> " + str)
}

function mapPost(post: Record<string, any>): Prisma.PostUncheckedCreateInput {
  const {
    id,
    title,
    raw_content,
    phone,
    user_id,
    cat_id,
    currency,
    price,
    status,
    date_expires,
    date_created,
    date_modified,
  } = post

  // if (status === 2) {
  //   return null
  // }
  let _status: PostStatuses = PostStatuses.EXPIRED

  //TODO compute expiration by date_expires
  if (status === 0) {
    _status = PostStatuses.ACTIVE
  }
  if (status === 2) {
    _status = PostStatuses.EXPIRED_WARNING_SENT
  }
  return {
    id,
    status: _status,
    phone: phone?.trim() ?? null,
    title: title.trim(),
    slug: makeSlug(title),
    body: S(raw_content).HTMLToText().trim().get(),
    price: price === null ? undefined : price,
    currency,
    userId: user_id,
    categoryId: cat_id,
    createdAt: new Date(date_created),
    updatedAt: new Date(date_modified),
    expiresAt: new Date(date_expires),
  }
}
const importPosts = async () => {
  let jsonData = JSON.parse(
    fs.readFileSync(`${__dirname}/../.data/db_seed/xclassified.json`).toString()
  )
    .data.map(mapPost)
    .filter((data) => data !== null)
  logger("PostData parsed")
  // add bars
  const pb = multibar.create(0, 0, { model: "Posts".padEnd(15) })
  pb.setTotal(jsonData.length)

  let missingUsers = 0
  let postCount = 0

  for (let data of jsonData) {
    pb.increment()
    // updatePB(pb, "Posts")
    const user = await db.user.findFirst({ where: { id: data.userId } })
    if (!user) {
      logger(`Missig user #${data.userId}`)
      missingUsers++
      continue
    }
    const record = await db.post.create({ data })
    postCount++
    // logger(record)
  }

  logger(`PostData imported ${postCount} records`)
  logger(`PostData skipped ${missingUsers} records because missing user`)
  pb.stop()
}

const mapCategory = (c): Prisma.CategoryUncheckedCreateInput => {
  const { id, title, content, slug } = c
  return {
    id,
    title,
    slug,
    description: S(content).HTMLToText().trim().get(),
  }
}

const importCategories = async () => {
  let jsonData = JSON.parse(
    fs.readFileSync(`${__dirname}/../.data/db_seed/xcategory.json`).toString()
  )
    .data.map(mapCategory)
    .filter((data) => data !== null)
  logger("CategoryData parsed")

  for (const data of jsonData) {
    {
      const record = await db.category.create({ data })
    }
  }

  logger("CategoryData imported")
}

const mapUpload = (c): Prisma.ImageUncheckedCreateInput => {
  const { id, parent_id, server_name, date_created, date_modified, width, height } = c
  return {
    id,
    fileName: server_name,
    postId: parent_id,
    createdAt: new Date(date_created),
    updatedAt: new Date(date_modified),
    userId: 0,
    width,
    height,
  }
}

const importImages = async () => {
  let jsonData = JSON.parse(
    fs.readFileSync(`${__dirname}/../.data/db_seed/xupload.json`).toString()
  )
    .data.map(mapUpload)
    .filter((data) => data !== null)
  logger("UploadData parsed")

  const pb = multibar.create(0, 0, { model: "Images".padEnd(15) })
  pb.setTotal(jsonData.length)

  for (const data of jsonData) {
    // updatePB(pb, "Images")
    pb.increment()
    const { postId } = data
    let post: any = postsCache.get(postId)
    try {
      if (!post) {
        post = await db.post.findFirst({
          where: { id: postId },
          select: { userId: true },
        })
        post && postsCache.set(postId, post)
      } else {
        // logger("CACHED POST", postId)
      }
      if (!post) {
        logger("ORPHAN UPLOAD", data.fileName)
        continue
      }
      data.userId = post.userId
      const record = await db.image.create({ data })
    } catch (error) {
      if (error.meta?.field_name === "Image_postId_fkey (index)") {
        logger(`SKIP image ${data.id} because of missing post ${data.postId} `)
      } else {
        logger(`SKIP image ${data.id}: ${error.message}`)
      }
    }
  }

  logger("UploadData imported")
}

export default async function importPostsTask() {
  // Your script here...

  try {
    await db.image.deleteMany({ where: {} })
    logger("Images deleted")
    await db.post.deleteMany({ where: {} })
    logger("Posts deleted")
    await db.category.deleteMany({ where: {} })
    logger("Categories deleted")

    await importCategories()
    await importPosts()
    await importImages()
  } catch (error) {
    console.warn("ERROR IMPORTING POSTS.")
    console.error(error)
  } finally {
    multibar.stop()
  }
}
