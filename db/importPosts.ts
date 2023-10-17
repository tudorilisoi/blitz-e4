import { S, makeSlug } from "../src/helpers"

// To access your database
// Append api/* to import from api and web/* to import from web
import { PostStatuses, Prisma } from "@prisma/client"
import fs from "fs"

import db from "./index"

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
  let jsonData = JSON.parse(fs.readFileSync(`${__dirname}/../.data/xclassified.json`).toString())
    .xclassified.map(mapPost)
    .filter((data) => data !== null)
  console.log("PostData parsed")

  let missingUsers = 0
  let postCount = 0

  for (let data of jsonData) {
    const user = await db.user.findFirst({ where: { id: data.userId } })
    if (!user) {
      console.log(`Missig user #${data.userId}`)
      missingUsers++
      return false
    }
    const record = await db.post.create({ data })
    postCount++
    // console.log(record)
  }

  console.log(`PostData imported ${postCount} records`)
  console.log(`PostData skipped ${missingUsers} records because missing user`)
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
  let jsonData = JSON.parse(fs.readFileSync(`${__dirname}/../.data/xcategory.json`).toString())
    .xcategory.map(mapCategory)
    .filter((data) => data !== null)
  console.log("CategoryData parsed")

  await Promise.all(
    jsonData.map(async (data) => {
      const record = await db.category.create({ data })
      // console.log(record)
    })
  )

  console.log("CategoryData imported")
}

const mapUpload = (c): Prisma.ImageUncheckedCreateInput => {
  const { id, parent_id, server_name, date_created, date_modified } = c
  return {
    id,
    fileName: server_name,
    postId: parent_id,
    createdAt: new Date(date_created),
    updatedAt: new Date(date_modified),
    userId: 0,
  }
}

const importImages = async () => {
  let jsonData = JSON.parse(fs.readFileSync(`${__dirname}/../.data/xupload.json`).toString())
    .xupload.map(mapUpload)
    .filter((data) => data !== null)
  console.log("UploadData parsed")

  await Promise.all(
    jsonData.map(async (data) => {
      try {
        const post = await db.post.findFirst({
          where: { id: data.postId },
          select: { userId: true },
        })
        if (!post) {
          console.log("ORPHAN UPLOAD", data.fileName)
          return
        }
        data.userId = post.userId
        const record = await db.image.create({ data })
      } catch (error) {
        if (error.meta?.field_name === "Image_postId_fkey (index)") {
          console.log(`SKIP image ${data.id} because of missing post ${data.postId} `)
        } else {
          console.log(`SKIP image ${data.id}: ${error.message}`)
        }
      }
    })
  )

  console.log("UploadData imported")
}

export default async () => {
  // Your script here...

  try {
    await db.image.deleteMany({ where: {} })
    console.log("Images deleted")
    await db.post.deleteMany({ where: {} })
    console.log("Posts deleted")
    await db.category.deleteMany({ where: {} })
    console.log("Categories deleted")

    await importCategories()
    await importPosts()
    await importImages()
  } catch (error) {
    console.warn("ERROR IMPORTING POSTS.")
    console.error(error)
  }
}
