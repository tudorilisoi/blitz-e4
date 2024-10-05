import db, { mapPostToMeili } from "db"
import { ServerResponse } from "http"
import { init, meiliClient } from "integrations/meili/meili"
import { postInclude } from "src/config"
import { formatDate } from "src/helpers"
const LIMIT = 20
async function rebuildMeiliIndex(req, res: ServerResponse) {
  console.log(req.query)

  const posts = await db.post.findMany({
    // where: { status: { not: PostStatuses.EXPIRED } },
    orderBy: { id: "desc" },
    // take: LIMIT,
    include: postInclude,
  })
  await meiliClient.deleteIndex("Post").catch(() => "Post index not found in pre-init")
  await init()
  await meiliClient.index("Post").addDocuments(posts.map(mapPostToMeili))

  res.setHeader("Content-Type", "application/json")
  res.setHeader("Cache-Control", `public, max-age=${0}`)
  res.end(
    JSON.stringify(
      {
        status: `RAN AT ${formatDate(new Date(), formatDate.longDateTime)}`,
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
