import { Routes } from "@blitzjs/next"
import { Category, Post } from "@prisma/client"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useRouter } from "next/router"
import { gSSP } from "src/blitz-server"
import Layout from "src/core/layouts/Layout"
import getCategories from "src/posts/queries/getCategories"
import getPosts from "src/posts/queries/getPosts"

export const makePostNavUrl = (postSlug: string, categorySlug: string, postId: number) => {
  return `/anunt/${categorySlug}/${postSlug}-${postId}`
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
  const postSlug = params[1] || ""
  const postId = Number(postSlug.substring(postSlug.lastIndexOf("-") + 1))

  const { posts } = await getPosts(
    {
      // @ts-ignore
      where: { id: postId },
      orderBy: {},
      take: 1,
      skip: 0,
    },
    ctx
  )
  if (posts.length !== 1) {
    return {
      notFound: true,
    }
  }
  return { props: { category, post: posts[0] } }
})

export default function PostPage({ category, post }: { category: Category; post: Post }) {
  const router = useRouter()
  const title = `Anunţ: ${post.title} | ${category.title} | eRădăuţi `
  const description = `Anunţ: ${post.title} | ${category.title} | eRădăuţi `
  return (
    <Layout title={title} description={description}>
      {<pre>{JSON.stringify(post, null, 4)}</pre>}
      <Link href={Routes.EditPostPage({ postId: post.id })}>Edit</Link>
    </Layout>
  )
}
