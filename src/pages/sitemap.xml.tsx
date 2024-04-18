import { PostStatuses, Prisma } from "@prisma/client"
import { gSSP } from "src/blitz-server"
import getPosts from "src/posts/queries/getPosts"
import { makePostNavUrl } from "./anunt/[[...params]]"
import { formatDate, formatDateTZ } from "src/helpers"
import { CategoryWithCounters, PostWithIncludes } from "src/posts/helpers"
import getCategories from "src/posts/queries/getCategories"
import { makePostsNavUrl } from "./anunturi/[[...params]]"

const createSitemap = (posts: PostWithIncludes[], categories: CategoryWithCounters[]) => {
  const mostRecentPostDate = formatDate(posts[0]?.updatedAt ?? new Date(), formatDate.ISO)
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${`${process.env.NEXT_PUBLIC_APP_URL}`}</loc>
        <lastmod>${mostRecentPostDate}</lastmod>
        <changefreq>daily</changefreq>
    </url>
    ${categories
      .map((category) => {
        const url = makePostsNavUrl(category.slug, 1)
        return `
                <url>
                    <loc>${`${process.env.NEXT_PUBLIC_APP_URL}${url}`}</loc>
                    <changefreq>daily</changefreq>
                </url>
            `
      })
      .join("")}
        ${posts
          .map((post) => {
            const url = makePostNavUrl(post)
            return `
                    <url>
                        <loc>${`${process.env.NEXT_PUBLIC_APP_URL}${url}`}</loc>
                        <lastmod>${formatDate(post.updatedAt, formatDate.ISO)}</lastmod>
                        <changefreq>monthly</changefreq>
                    </url>
                `
          })
          .join("")}

    </urlset>
    `
}
export const getServerSideProps = gSSP(async (args) => {
  const { query, ctx, res } = args
  const categories = await getCategories({}, ctx)
  const cArgs = {
    take: 99999999,
    skip: 0,
    where: {
      status: { not: PostStatuses.EXPIRED },
    },
    orderBy: { updatedAt: "desc" } as Prisma.PostOrderByWithRelationInput,
  }
  const latestPosts = await getPosts(cArgs, ctx)
  res.setHeader("Cache-Control", `public, max-age=${5 * 60}, stale-while-revalidate=59`)
  res.setHeader("Content-Type", "text/xml")
  res.write(createSitemap(latestPosts.posts, categories))
  res.end()
  return { props: { status: "generated" } }
})

const SiteMap = ({ status }) => {
  // return <>{status}</>
  return null
}
export default SiteMap
