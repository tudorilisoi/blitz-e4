import { Routes } from "@blitzjs/next"
import { Category, Post } from "@prisma/client"
import Link from "next/link"
import { useRouter } from "next/router"
import { gSSP } from "src/blitz-server"
import ImageGallery from "src/core/components/image/ImageGallery"
import Layout from "src/core/layouts/Layout"
import { S } from "src/helpers"
import { PostWithIncludes } from "src/posts/helpers"
import getCategories from "src/posts/queries/getCategories"
import getPosts from "src/posts/queries/getPosts"

export const makePostNavUrl = (post: PostWithIncludes) => {
  const { slug, id } = post
  return `/anunt/${post.category.slug}/${slug}-${id}`
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

export default function PostPage({
  category,
  post,
}: {
  category: Category
  post: PostWithIncludes
}) {
  const router = useRouter()
  const title = `Anunţ: ${post.title} | ${category.title} | eRădăuţi `
  const description = `Anunţ: ${post.title} | ${category.title} | eRădăuţi `
  return (
    <>
      <div className="prose mb-4">
        <h1 className="text-2xl text-base-content">{post.title}</h1>
        <p className="text-lg text-base-content">{S(post.body).obscurePhoneNumbers().get()}</p>
      </div>
      <ImageGallery images={post.images} />
      <Link href={Routes.EditPostPage({ postId: post.id })}>Edit</Link>
    </>
  )
}
PostPage.getLayout = (page) => <Layout>{page}</Layout>
