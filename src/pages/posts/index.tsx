import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import getPosts from "src/posts/queries/getPosts"

import { gSSP } from "src/blitz-server"
import { shortenText } from "src/helpers"

const ITEMS_PER_PAGE = 9

export const getServerSideProps = gSSP(async (args) => {
  const { query, ctx } = args
  const page = Number(query?.page) || 0
  const { posts, count, hasMore } = await getPosts(
    {
      orderBy: { createdAt: "desc" },
      take: ITEMS_PER_PAGE,
      skip: page * ITEMS_PER_PAGE,
    },
    ctx
  )

  return { props: { posts, count, hasMore, page } }
})

function PostsPage({ posts, page, hasMore }) {
  console.log(`🚀 ~ PostsPage ~ { posts, page, hasMore }:`, { posts, page, hasMore })
  const router = useRouter()
  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })
  return (
    <Layout>
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
              disabled={page === 0}
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

export default PostsPage

/*
const ITEMS_PER_PAGE = 9

export const PostsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ posts, hasMore }] = usePaginatedQuery(getPosts, {
    orderBy: { updatedAt: "desc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
        {posts.map((post, index) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600">{post.body}</p>
          </div>
        ))}
      </div>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const PostsPage = () => {
  return (
    <Layout>
      <Head>
        <title>Posts</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewPostPage()}>Create Post</Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <PostsList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default PostsPage
 */
