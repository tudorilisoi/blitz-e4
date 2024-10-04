import { PostStatuses } from "@prisma/client"
import db, { mapPostToMeili } from "db"
import { ServerResponse } from "http"
import { postInclude } from "src/config"
import { getImageUrl } from "src/core/components/image/helpers"
import { canonical } from "src/helpers"
import { makePostNavUrl } from "src/pages/anunt/[[...params]]"
import { makePostsNavUrl } from "src/pages/anunturi/[[...params]]"
import { meiliClient, init } from "integrations/meili"
const LIMIT = 20
async function rebuildMeiliIndex(req, res: ServerResponse) {
  console.log(req.query)

  const posts = await db.post.findMany({
    // where: { status: { not: PostStatuses.EXPIRED } },
    orderBy: { id: "desc" },
    // take: LIMIT,
    include: postInclude,
  })
  await init()
  await meiliClient.index("Post").addDocuments(posts.map(mapPostToMeili))

  res.setHeader("Content-Type", "application/json")
  res.setHeader("Cache-Control", `public, max-age=${3600}, stale-while-revalidate=59`)
  res.end(
    JSON.stringify(
      {
        status: "IN_PROGRESS",
      },
      null,
      4
    )
  )
}
const reindexAPI = async (req, res) => {
  try {
    await rebuildMeiliIndex(req, res)
  } catch (error) {
    res.statusCode = 500
    res.end("Internal Server Error")
  }
}

export default reindexAPI
