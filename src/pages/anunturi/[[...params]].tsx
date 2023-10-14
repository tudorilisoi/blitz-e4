import Link from "next/link"
import { useRouter } from "next/router"
import { gSSP } from "src/blitz-server"
import Layout from "src/core/layouts/Layout"
import PostCell from "src/posts/components/PostCell"
import getCategories from "src/posts/queries/getCategories"
import getPosts from "src/posts/queries/getPosts"

const ITEMS_PER_PAGE = 9

export const makePostsNavUrl = (categorySlug: string, page: number) => {
  return `/anunturi/${categorySlug}${page === 1 ? "" : "/pagina-" + page}`
}

export const getServerSideProps = gSSP(async (args) => {
  const { query, ctx } = args
  const params = query.params as string[]
  const categorySlug = params[0]
  const categories = await getCategories({ where: { slug: categorySlug } }, ctx)
  if (categories.length !== 1) {
    return {
      notFound: true,
    }
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
  if (page > Math.ceil(count / ITEMS_PER_PAGE)) {
    return {
      notFound: true,
    }
  }

  return { props: { category, posts, count, hasMore, page } }
  // return { props: {} }
})

export default function PostsNavPage({ category, posts, page, hasMore }) {
  const router = useRouter()

  const prevPageURL = makePostsNavUrl(category.slug, page - 1)
  const nextPageURL = makePostsNavUrl(category.slug, page + 1)

  const title = `Anunţuri: ${category.title} p.${page} | eRădăuţi `
  const description = `eRădăuţi Anunţuri: ${category.title} p.${page} ${category.description} `
  return (
    <Layout title={title} description={description}>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
        {posts.map((post) => PostCell({ post, category }))}
      </div>
      <nav aria-label="Page navigation" className="text-center mt-4">
        <ul className="inline-flex ">
          <Link key={prevPageURL} href={page === 1 ? "#" : prevPageURL}>
            <li>
              <button
                disabled={page === 1}
                className="h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white rounded-l-lg focus:shadow-outline hover:bg-indigo-100"
              >
                Prev
              </button>
            </li>
          </Link>

          <Link href={!hasMore ? "#" : nextPageURL}>
            <li>
              <button
                disabled={!hasMore}
                className="h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white rounded-r-lg focus:shadow-outline hover:bg-indigo-100"
              >
                Next
              </button>
            </li>
          </Link>
        </ul>
      </nav>
    </Layout>
  )
}
