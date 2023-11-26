import { Routes } from "@blitzjs/next"
import { Category, PostStatuses } from "@prisma/client"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { gSSP } from "src/blitz-server"
import { nextSymbol, prevSymbol } from "src/core/components/SimpleNav"
import ImageGallery from "src/core/components/image/ImageGallery"
import { OGImage } from "src/core/components/image/OGImage"
import Layout from "src/core/layouts/Layout"
import { S, canonical, formatDate } from "src/helpers"
import { PostWithIncludes } from "src/posts/helpers"
import getCategories from "src/posts/queries/getCategories"
import { PermissionFlags } from "src/posts/queries/getPermissions"
import getPosts from "src/posts/queries/getPosts"
import { SimpleNav, makePostsNavUrl } from "../anunturi/[[...params]]"

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
      take: 1,
      skip: 0,
    },
    ctx
  )
  if (posts.length === 0) {
    return {
      notFound: true,
    }
  }
  const post = posts[0]

  const cArgs = {
    cursor: { id: post?.id },
    take: -1,
    skip: 1,
    where: {
      status: { not: PostStatuses.EXPIRED },
      categoryId: post?.categoryId,
    },
    orderBy: { updatedAt: "desc" },
  }

  // @ts-ignore
  const { posts: prevPosts } = await getPosts(cArgs, ctx)
  // @ts-ignore
  const { posts: nextPosts } = await getPosts({ ...cArgs, take: 1 }, ctx)
  console.log(
    `🚀 ~ getServerSideProps ~ prevPosts:`,
    (prevPosts || []).map((p) => p.title)
  )
  console.log(
    `🚀 ~ getServerSideProps ~ nextPosts:`,
    (nextPosts || []).map((p) => p.title)
  )
  const prevPost = prevPosts.length == 1 ? prevPosts[0] : null
  const nextPost = nextPosts.length == 1 ? nextPosts[0] : null

  return {
    props: {
      category,
      post,
      permissionFlags: permissions[postId],
      prevPost,
      nextPost,
    },
  }
})

export default function PostPage({
  category,
  post,
  permissionFlags,
  nextPost,
  prevPost,
}: {
  category: Category
  post: PostWithIncludes
  permissionFlags: PermissionFlags
  prevPost: PostWithIncludes | null
  nextPost: PostWithIncludes | null
}) {
  const router = useRouter()
  const sanitizedBody = S(post.body).obscurePhoneNumbers().get()

  const title = `Anunţ: ${post.title} | ${category.title} | eRădăuţi `
  const description = `${S(sanitizedBody).shortenText(200).get()}`
  const ogImage = OGImage(post.images[0] ?? null)

  const canonicalUrl = canonical(makePostNavUrl(post))
  const head = (
    <Head>
      <title>{title}</title>
      <link rel="canonical" content={canonicalUrl} />
      <meta key="description" name="description" content={description} />
      <meta name="og:url" content={canonicalUrl} />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      {ogImage}
      <meta property="og:type" content="article" />
      <meta
        property="article:modified_time"
        content={formatDate(post.updatedAt, formatDate.ISO)}
      ></meta>
      <meta
        property="article:published_time"
        content={formatDate(post.createdAt, formatDate.ISO)}
      ></meta>
      <meta property="article:section" content={`${post.category.title}`} />
      <meta property="article:tag" content={`${post.category.title}`} />
      <meta property="article:tag" content={`eRădăuţi`} />
      <meta property="article:tag" content={`Rădăuţi`} />
      <meta property="article:tag" content={`Suceava`} />
      <meta property="article:tag" content={`Anunţuri`} />
    </Head>
  )
  const pagination = (
    <SimpleNav
      nextLink={nextPost ? makePostNavUrl(nextPost) : null}
      prevLink={prevPost ? makePostNavUrl(prevPost) : null}
      prevText={
        <span className="flex-grow" title={prevPost?.title || ""}>
          {prevSymbol}Anunţul anterior
        </span>
      }
      nextText={
        <span className="flex-grow" title={nextPost?.title || ""}>
          Anunţul următor{nextSymbol}
        </span>
      }
    />
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
      {pagination}
    </>
  )
}
PostPage.getLayout = (page) => <Layout>{page}</Layout>
