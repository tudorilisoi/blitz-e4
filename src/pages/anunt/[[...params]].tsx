import { Routes } from "@blitzjs/next"
import { Category, Post } from "@prisma/client"
import Link from "next/link"
import { useRouter } from "next/router"
import { gSSP } from "src/blitz-server"
import ImageGallery from "src/core/components/image/ImageGallery"
import Layout from "src/core/layouts/Layout"
import { S, formatDate } from "src/helpers"
import { PostWithIncludes } from "src/posts/helpers"
import getCategories from "src/posts/queries/getCategories"
import getPosts from "src/posts/queries/getPosts"
import { makePostsNavUrl } from "../anunturi/[[...params]]"
import Head from "next/head"
import getPermissions, { PermissionFlags } from "src/posts/queries/getPermissions"

export const makePostNavUrl = (post: PostWithIncludes) => {
  const { slug, id } = post
  return `/anunt/${post.category.slug}/${slug}-${id}`
}

export const getServerSideProps = gSSP(async (args) => {
  const { query, ctx } = args
  const params = query.params as string[]
  const postSlug = params[1] || ""
  const postId = Number(postSlug.substring(postSlug.lastIndexOf("-") + 1))
  const categorySlug = params[0]
  const categories = await getCategories({ where: { slug: categorySlug } }, ctx)
  if (categories.length !== 1) {
    return {
      notFound: true,
    }
  }
  const category = categories[0]

  const { posts, permissions } = await getPosts(
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
  return { props: { category, post: posts[0], permissionFlags: permissions[postId] } }
})

export default function PostPage({
  category,
  post,
  permissionFlags,
}: {
  category: Category
  post: PostWithIncludes
  permissionFlags: PermissionFlags
}) {
  const router = useRouter()
  const sanitizedBody = S(post.body).obscurePhoneNumbers().get()

  const title = `Anunţ: ${post.title} | ${category.title} | eRădăuţi `
  const description = `${S(sanitizedBody).shortenText(200).get()}`
  const head = (
    <Head>
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <title>{title}</title>
      <meta key="description" name="description" content={description} />
    </Head>
  )
  return (
    <>
      {head}
      <div className="flex flex-col sm:flex-row mb-4">
        <div className="flex-grow">
          <div className="prose">
            <h1 className="not-prose font-extrabold text-2xl text-base-content">
              <Link
                className="link link-hover text-accent-focus "
                href={makePostsNavUrl(post.category.slug)}
              >
                {post.category.title}
              </Link>{" "}
              {post.title}
            </h1>
            <p className="text-lg text-base-content">
              <span className="inline-block bg-neutral p-2 rounded text-sm ">
                {formatDate(post.updatedAt, formatDate.short)}
              </span>{" "}
              {sanitizedBody}
            </p>
          </div>
        </div>
        {!permissionFlags.mayEdit ? null : (
          <div className="pl-6">
            <Link className="btn btn-primary" href={Routes.EditPostPage({ postId: post.id })}>
              Modifică
            </Link>
          </div>
        )}
      </div>
      <div className={post.images.length == 1 ? "max-w-[45vw]" : ""}>
        <ImageGallery images={post.images} />
      </div>
    </>
  )
}
PostPage.getLayout = (page) => <Layout>{page}</Layout>
