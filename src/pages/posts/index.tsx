import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import getPosts from "src/posts/queries/getPosts"

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
