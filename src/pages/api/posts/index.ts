import { PostStatuses } from "@prisma/client"
import db from "db"
import { ServerResponse } from "http"
import { postInclude } from "src/config"
import { getImageUrl } from "src/core/components/image/helpers"
import { canonical } from "src/helpers"
import { makePostNavUrl } from "src/pages/anunt/[[...params]]"
import { makePostsNavUrl } from "src/pages/anunturi/[[...params]]"
const LIMIT = 20
async function getAPIPosts(req, res: ServerResponse) {
  console.log(req.query)
  let mappedPosts: unknown = []
  let { categoryId } = req.query

  categoryId = parseInt(categoryId, 10)
  if (!isNaN(categoryId)) {
    const posts = await db.post.findMany({
      where: { categoryId, status: { not: PostStatuses.EXPIRED } },
      orderBy: { updatedAt: "desc" },
      take: LIMIT,
      include: postInclude,
    })
    mappedPosts = posts.map((post) => {
      return {
        title: post.title,
        body: post.body,
        dateUpdated: post.updatedAt,
        price: post.price,
        currency: post.currency,
        url: canonical(makePostNavUrl(post)),
        images: post.images.map((image) => canonical(getImageUrl(image, true))),
      }
    })
  }
  const categories = await db.category.findMany({ orderBy: { title: "asc" } })
  const mappedCategories = categories.map((category) => {
    return {
      id: category.id,
      title: category.title,
      url: canonical(makePostsNavUrl(category.slug)),
      apiUrl: canonical(`/api/posts?categoryId=${category.id}`),
    }
  })
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Cache-Control", `public, max-age=${3600}, stale-while-revalidate=59`)
  res.end(
    JSON.stringify(
      {
        posts: mappedPosts,
        categories: mappedCategories,
      },
      null,
      4
    )
  )
}

export default async (req, res) => {
  try {
    await getAPIPosts(req, res)
  } catch (error) {
    res.statusCode = 500
    res.end("Internal Server Error")
  }
}
