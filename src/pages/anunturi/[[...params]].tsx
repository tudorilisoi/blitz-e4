import { NotFoundError } from "blitz"
import { useRouter } from "next/router"
import { gSSP } from "src/blitz-server"
import Layout from "src/core/layouts/Layout"
import { shortenText } from "src/helpers"
import getCategories from "src/posts/queries/getCategories"
import getPosts from "src/posts/queries/getPosts"

const ITEMS_PER_PAGE = 9

const makePostsNavUrl = (categorySlug, page) => {
  return `/anunturi/${categorySlug}${page === 1 ? "" : "/pagina-" + page}`
}

export const getServerSideProps = gSSP(async (args) => {
  const { query, ctx } = args
  const params = query.params as string[]
  const categorySlug = params[0]
  const categories = await getCategories({ where: { slug: categorySlug } }, ctx)
  if (categories.length !== 1) {
    throw new NotFoundError()
  }
  const category = categories[0]
  const pageSlug = params[1] || null
  const page = Number(pageSlug?.split("-")[1] || 1)

  const { posts, count, hasMore } = await getPosts(
    {
      // @ts-ignore
      where: { categoryId: category.id },
      orderBy: { createdAt: "desc" },
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
    },
    ctx
  )

  console.log("GSSP", categorySlug, page, posts)
  return { props: { category, posts, count, hasMore, page } }
  // return { props: {} }
})

export default function PostsNavPage({ category, posts, page, hasMore }) {
  console.log(`🚀 ~ PostsPage ~ { posts, page, hasMore }:`, { posts, page, hasMore })
  const router = useRouter()
  const goToPreviousPage = () => router.push(makePostsNavUrl(category.slug, page - 1))
  const goToNextPage = () => router.push(makePostsNavUrl(category.slug, page + 1))
  const title = `eRădăuţi Anunţuri: ${category.title} p.${page} `
  const description = `eRădăuţi Anunţuri: ${category.title} p.${page} ${category.description} `
  return (
    <Layout title={title} description={description}>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
        {posts.map((post, index) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{shortenText(post.title, 100)}</h2>
            <p className="text-gray-600">{shortenText(post.body, 140)}</p>
          </div>
        ))}
      </div>
      <nav aria-label="Page navigation" className="text-center mt-4">
        <ul className="inline-flex ">
          <li>
            <button
              disabled={page === 1}
              onClick={goToPreviousPage}
              className="h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white rounded-l-lg focus:shadow-outline hover:bg-indigo-100"
            >
              Prev
            </button>
          </li>
          <li>
            <button className="h-10 px-5 text-white transition-colors duration-150 bg-indigo-600 focus:shadow-outline">
              1
            </button>
          </li>
          <li>
            <button className="h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white focus:shadow-outline hover:bg-indigo-100">
              2
            </button>
          </li>
          <li>
            <button className="h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white focus:shadow-outline hover:bg-indigo-100">
              3
            </button>
          </li>
          <li>
            <button
              disabled={!hasMore}
              onClick={goToNextPage}
              className="h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white rounded-r-lg focus:shadow-outline hover:bg-indigo-100"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </Layout>
  )
}
